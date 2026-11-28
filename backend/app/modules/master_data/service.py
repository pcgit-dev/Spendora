#caching, additional validation and business rules later.
from sqlalchemy.orm import Session
from app.modules.master_data import repository


def get_categories(db: Session):

    return repository.get_categories(db)


def get_projects(db: Session):

    return repository.get_projects(db)


def get_trips(db: Session):

    return repository.get_trips(db)


def get_currencies(db: Session):

    return repository.get_currencies(db)


def get_departments(db: Session):

    return repository.get_departments(db)


def get_approval_policy(db: Session):

    return repository.get_approval_policy(db)
