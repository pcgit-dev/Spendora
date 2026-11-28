
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy.orm import Session

from app.models import (
    User,
    Category,
    Currency,
    Project,
    Trip,
    ApprovalPolicy,
)

from app.modules.spend.schemas import (
    SpendRequestCreate,
)


class ApprovalRuleError(ValueError):
    pass


# ---------------------------------------
# Approval Engine Output
# ---------------------------------------

@dataclass(frozen=True)
class RequiredApprover:

    user_id: str
    name: str
    approval_role: str
    sequence: int


@dataclass(frozen=True)
class ApprovalPlan:

    requester_department: str

    amount_usd: Decimal
    usd_rate: Decimal

    policy_id: str
    policy_snapshot: dict

    category_name: str

    project_name: str | None
    trip_name: str | None

    approvers: tuple[RequiredApprover, ...]


# ---------------------------------------
# Currency Conversion
# ---------------------------------------

def calculate_usd_amount(
    amount: Decimal,
    usd_rate: Decimal,
) -> Decimal:

    return (
        amount * usd_rate
    ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )


# ---------------------------------------
# Additional Approval Rule
# ---------------------------------------

def requires_additional_approval(

    amount_usd: Decimal,

    threshold_usd: Decimal,

    is_it: bool,

    require_it_approval: bool,

) -> bool:

    is_large_spend = (
        amount_usd > threshold_usd
    )

    is_it_spend = (
        is_it and require_it_approval
    )

    return is_large_spend or is_it_spend


# ---------------------------------------
# Generate Unique Approval Chain
# ---------------------------------------

def build_approval_chain(

    requester_id: str,

    manager_id: str,

    additional_approver_id: str,

    additional_required: bool,

) -> list[str]:

    approvers = [manager_id]

    if additional_required:

        approvers.append(
            additional_approver_id
        )

    # Prevent duplicate approvals.
    unique_approvers = list(
        dict.fromkeys(approvers)
    )

    # Never silently skip a required approval
    # if the requester is also an approver.
    if requester_id in unique_approvers:

        raise ApprovalRuleError(
            "Self-approval is not permitted. "
            "An alternative approval authority "
            "must be configured."
        )

    return unique_approvers


# ---------------------------------------
# Retrieve Active Master Data
# ---------------------------------------

def get_active_record(
    db: Session,
    model,
    record_id: str,
    label: str,
):

    record = db.get(model, record_id)

    if record is None or not record.active:

        raise ApprovalRuleError(
            f"Invalid or inactive {label}: {record_id}"
        )

    return record


# ---------------------------------------
# Main Approval Engine
# ---------------------------------------

def calculate_approval_plan(

    db: Session,

    requester_id: str,

    request: SpendRequestCreate,

) -> ApprovalPlan:

    # 1. Retrieve the employee.

    requester = get_active_record(
        db,
        User,
        requester_id,
        "requester"
    )

    # 2. Validate the reporting hierarchy.

    if not requester.manager_id:

        raise ApprovalRuleError(
            "No line manager is configured "
            "for this employee."
        )

    # 3. Retrieve expenditure category.

    category = get_active_record(
        db,
        Category,
        request.category_id,
        "category"
    )

    # 4. Retrieve currency configuration.

    currency = get_active_record(
        db,
        Currency,
        request.currency_code,
        "currency"
    )

    # 5. Validate project requirements.

    project = None

    if category.requires_project:
        if not request.project_id:
            raise ApprovalRuleError(
                "Project selection is required "
                "for this expenditure category."
            )

    if request.project_id:

        project = get_active_record(
            db,
            Project,
            request.project_id,
            "project"
        )

    # 6. Validate trip requirements.

    trip = None

    if category.requires_trip:
        if not request.trip_id:
            raise ApprovalRuleError(
                "Trip selection is required "
                "for this expenditure category."
            )

    if request.trip_id:

        trip = get_active_record(
            db,
            Trip,
            request.trip_id,
            "trip"
        )

    # 7. Retrieve the active approval policy.

    policy = get_active_record(
        db,
        ApprovalPolicy,
        "POL-001",
        "approval policy"
    )

    # 8. Convert expenditure amount to USD.

    amount_usd = calculate_usd_amount(
        request.amount,
        currency.usd_rate
    )

    # 9. Determine additional approval.

    additional_required = (
        requires_additional_approval(
            amount_usd=amount_usd,
            threshold_usd=policy.threshold_usd,
            is_it=category.is_it,
            require_it_approval=(
                policy.require_it_approval
            )
        )
    )

    # 10. Generate unique approver identities.

    approver_ids = build_approval_chain(
        requester_id=requester.id,
        manager_id=requester.manager_id,
        additional_approver_id=(
            policy.additional_approver_id
        ),
        additional_required=additional_required
    )

    # 11. Resolve active approval authorities.

    approvers = []

    for index, approver_id in enumerate(
        approver_ids,
        start=1
    ):

        approver = get_active_record(
            db,
            User,
            approver_id,
            "approver"
        )

        if approver.role not in (
            "MANAGER",
            "APPROVER"
        ):

            raise ApprovalRuleError(
                f"{approver.name} is not configured "
                "as an approval authority."
            )

        approval_role = (
            "LINE_MANAGER"
            if index == 1
            else "ADDITIONAL_APPROVER"
        )

        approvers.append(
            RequiredApprover(
                user_id=approver.id,
                name=approver.name,
                approval_role=approval_role,
                sequence=index
            )
        )

    # 12. Capture the policy used for this request.

    policy_snapshot = {
        "policy_id": policy.id,
        "policy_name": policy.name,

        "threshold_usd": str(
            policy.threshold_usd
        ),

        "require_it_approval": (
            policy.require_it_approval
        ),

        "additional_approver_id": (
            policy.additional_approver_id
        ),

        "is_it": category.is_it,

        "requires_project": (
            category.requires_project
        ),

        "requires_trip": (
            category.requires_trip
        ),

        "manager_id": requester.manager_id,

        "additional_required": (
            additional_required
        ),

        "threshold_operator": ">",

        "approval_mode": "SEQUENTIAL",

        "usd_rate": str(currency.usd_rate),

        "rounding": "ROUND_HALF_UP",
    }

    # 13. Return the calculated approval plan.

    return ApprovalPlan(

        requester_department=requester.department,

        amount_usd=amount_usd,

        usd_rate=currency.usd_rate,

        policy_id=policy.id,

        policy_snapshot=policy_snapshot,

        category_name=category.name,

        project_name=(
            project.name if project else None
        ),

        trip_name=(
            trip.name if trip else None
        ),

        approvers=tuple(approvers),
    )
