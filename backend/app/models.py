
from datetime import datetime
from decimal import Decimal
from uuid import uuid4
from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    CheckConstraint,
    Integer,
    Text,
    JSON,
    ForeignKeyConstraint,
    UniqueConstraint,
    func,
    true,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


# ---------------------------------------
# Department
# ---------------------------------------

class Department(Base):

    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(
        String(50), primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False
    )

    active: Mapped[bool] = mapped_column(
        Boolean, server_default=true()
    )


# ---------------------------------------
# Employee / User
# ---------------------------------------

class User(Base):

    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint(
            "role IN ('EMPLOYEE', 'MANAGER', 'APPROVER', 'FINANCE')",
            name="ck_users_role"
        ),
    )

    id: Mapped[str] = mapped_column(
        String(50), primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255), nullable=False
    )

    role: Mapped[str] = mapped_column(
        String(50), nullable=False
    )

    department: Mapped[str] = mapped_column(
        String(100), nullable=False
    )

    manager_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )

    active: Mapped[bool] = mapped_column(
        Boolean, server_default=true()
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ---------------------------------------
# Expenditure Category
# ---------------------------------------

class Category(Base):

    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String(50), primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(150), unique=True, nullable=False
    )

    is_it: Mapped[bool] = mapped_column(
        Boolean, default=False
    )

    requires_project: Mapped[bool] = mapped_column(
        Boolean, default=False
    )

    requires_trip: Mapped[bool] = mapped_column(
        Boolean, default=False
    )

    active: Mapped[bool] = mapped_column(
        Boolean, server_default=true()
    )


# ---------------------------------------
# Project
# ---------------------------------------

class Project(Base):

    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(
        String(50), primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )

    active: Mapped[bool] = mapped_column(
        Boolean, server_default=true()
    )


# ---------------------------------------
# Trip
# ---------------------------------------

class Trip(Base):

    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(
        String(50), primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )

    active: Mapped[bool] = mapped_column(
        Boolean, server_default=true()
    )


# ---------------------------------------
# Currency
# ---------------------------------------

class Currency(Base):

    __tablename__ = "currencies"

    __table_args__ = (
        CheckConstraint(
            "usd_rate > 0",
            name="ck_currency_positive_rate"
        ),
    )

    code: Mapped[str] = mapped_column(
        String(3), primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(100), nullable=False
    )

    usd_rate: Mapped[Decimal] = mapped_column(
        Numeric(18, 8), nullable=False
    )

    active: Mapped[bool] = mapped_column(
        Boolean, server_default=true()
    )


# ---------------------------------------
# Approval Policy
# ---------------------------------------

class ApprovalPolicy(Base):

    __tablename__ = "approval_policies"

    __table_args__ = (
        CheckConstraint(
            "threshold_usd > 0",
            name="ck_policy_positive_threshold"
        ),
    )

    id: Mapped[str] = mapped_column(
        String(50), primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )

    threshold_usd: Mapped[Decimal] = mapped_column(
        Numeric(18, 2), nullable=False
    )

    additional_approver_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )

    require_it_approval: Mapped[bool] = mapped_column(
        Boolean, default=True
    )

    active: Mapped[bool] = mapped_column(
        Boolean, server_default=true()
    )

# ---------------------------------------
# Spend Request
# ---------------------------------------

class SpendRequest(Base):

    __tablename__ = "spend_requests"

    __table_args__ = (
        CheckConstraint(
            "status IN ('DRAFT', 'PENDING_APPROVAL', "
            "'APPROVED', 'REJECTED', 'CANCELLED')",
            name="ck_spend_request_status"
        ),

        CheckConstraint(
            "current_version >= 1",
            name="ck_request_version_positive"
        ),
    )

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"REQ-{uuid4()}"
    )

    requester_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    department: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PENDING_APPROVAL",
        index=True
    )

    current_version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

# ---------------------------------------
# Request Version
# ---------------------------------------

class RequestVersion(Base):

    __tablename__ = "request_versions"

    __table_args__ = (
        CheckConstraint(
            "version >= 1",
            name="ck_version_positive"
        ),

        CheckConstraint(
            "amount > 0 AND usd_rate > 0",
            name="ck_version_amount_positive"
        ),

        CheckConstraint(
            "amount_usd >= 0",
            name="ck_version_usd_amount"
        ),
    )

    request_id: Mapped[str] = mapped_column(
        ForeignKey("spend_requests.id"),
        primary_key=True
    )

    version: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False
    )

    currency_code: Mapped[str] = mapped_column(
        ForeignKey("currencies.code"),
        nullable=False
    )

    usd_rate: Mapped[Decimal] = mapped_column(
        Numeric(18, 8),
        nullable=False
    )

    amount_usd: Mapped[Decimal] = mapped_column(
        Numeric(18, 2),
        nullable=False
    )

    category_id: Mapped[str] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False
    )

    category_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    supplier: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        default=""
    )

    project_id: Mapped[str | None] = mapped_column(
        ForeignKey("projects.id"),
        nullable=True
    )

    project_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    trip_id: Mapped[str | None] = mapped_column(
        ForeignKey("trips.id"),
        nullable=True
    )

    trip_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    justification: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    quote_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    no_quote_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    policy_id: Mapped[str] = mapped_column(
        ForeignKey("approval_policies.id"),
        nullable=False
    )

    policy_snapshot: Mapped[dict] = mapped_column(
        JSON,
        nullable=False
    )

    created_by: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ---------------------------------------
# Approval Task
# ---------------------------------------

class ApprovalTask(Base):

    __tablename__ = "approval_tasks"

    __table_args__ = (

        ForeignKeyConstraint(
            ["request_id", "request_version"],
            [
                "request_versions.request_id",
                "request_versions.version",
            ],
        ),

        UniqueConstraint(
            "request_id",
            "request_version",
            "sequence",
            name="uq_approval_sequence"
        ),

        UniqueConstraint(
            "request_id",
            "request_version",
            "approver_id",
            name="uq_request_version_approver"
        ),

        CheckConstraint(
            "status IN ('WAITING', 'PENDING', "
            "'APPROVED', 'REJECTED', 'CANCELLED')",
            name="ck_approval_task_status"
        ),

        CheckConstraint(
            "sequence >= 1",
            name="ck_approval_sequence_positive"
        ),

        CheckConstraint(
            "status <> 'REJECTED' OR "
            "(reason IS NOT NULL AND "
            "length(trim(reason)) > 0)",
            name="ck_approval_rejection_reason"
        ),
    )

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: str(uuid4())
    )

    request_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    request_version: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    approver_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    approver_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    approval_role: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    sequence: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="WAITING"
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    decided_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ---------------------------------------
# Audit Event
# ---------------------------------------

class AuditEvent(Base):

    __tablename__ = "audit_events"

    __table_args__ = (

        ForeignKeyConstraint(
            ["request_id", "request_version"],
            [
                "request_versions.request_id",
                "request_versions.version",
            ],
        ),
    )

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: str(uuid4())
    )

    request_id: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )

    request_version: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    actor_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    action: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    event_details: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
        default=dict
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )
