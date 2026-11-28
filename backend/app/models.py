
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    CheckConstraint,
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
