
#This layer will be responsible only for retrieving information from PostgreSQL.
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import (
    Department,
    Category,
    Project,
    Trip,
    Currency,
    ApprovalPolicy,
)


def get_categories(db: Session):

    statement = (
        select(Category)
        .where(Category.active.is_(True))
        .order_by(Category.id)
    )

    return db.scalars(statement).all()


def get_projects(db: Session):

    statement = (
        select(Project)
        .where(Project.active.is_(True))
        .order_by(Project.name)
    )

    return db.scalars(statement).all()


def get_trips(db: Session):

    statement = (
        select(Trip)
        .where(Trip.active.is_(True))
        .order_by(Trip.name)
    )

    return db.scalars(statement).all()


def get_currencies(db: Session):

    statement = (
        select(Currency)
        .where(Currency.active.is_(True))
        .order_by(Currency.code)
    )

    return db.scalars(statement).all()


def get_departments(db: Session):

    statement = (
        select(Department)
        .where(Department.active.is_(True))
        .order_by(Department.name)
    )

    return db.scalars(statement).all()


def get_approval_policy(db: Session):

    statement = (
        select(ApprovalPolicy)
        .where(
            ApprovalPolicy.id == "POL-001",
            ApprovalPolicy.active.is_(True)
        )
    )

    return db.scalar(statement)
