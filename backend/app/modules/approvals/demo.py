#should independently verify that the engine can retrieve master data and generate the correct approval chain

from app.database import SessionLocal

from app.modules.spend.schemas import (
    SpendRequestCreate,
)

from app.modules.approvals.engine import (
    calculate_approval_plan,
)


def run_demo():

    request = SpendRequestCreate(

        title="Annual ERP Software Subscription",

        amount="8000.00",

        currency_code="USD",

        category_id="CAT-001",

        supplier="Demo Software Solutions",

        project_id="PRJ-002",

        justification=(
            "Annual ERP software subscription "
            "for business operations."
        ),

        quote_name="ERP_Quotation.pdf",
    )

    with SessionLocal() as db:

        plan = calculate_approval_plan(
            db=db,
            requester_id="EMP-003",
            request=request
        )

        print("\nSpendora Approval Engine")
        print("-" * 40)

        print(f"Request: {request.title}")

        print(
            f"Amount: {request.amount} "
            f"{request.currency_code}"
        )

        print(f"USD Equivalent: {plan.amount_usd}")

        print(f"Category: {plan.category_name}")

        print(
            "Threshold: "
            f"{plan.policy_snapshot['threshold_usd']}"
        )

        print("\nRequired Approval Chain:")

        for approver in plan.approvers:

            print(
                f"{approver.sequence}. "
                f"{approver.name} "
                f"({approver.approval_role})"
            )

        print("\nApproval calculation completed.")


if __name__ == "__main__":
    run_demo()
