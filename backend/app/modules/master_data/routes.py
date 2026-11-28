
#master data REST endpoints.
from typing import Annotated
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.modules.master_data import service

from app.modules.master_data.schemas import (
    CategoryResponse,
    ProjectResponse,
    TripResponse,
    CurrencyResponse,
    DepartmentResponse,
    ApprovalPolicyResponse,
)


router = APIRouter(
    prefix="/master-data",
    tags=["Master Data"]
)


DBSession = Annotated[
    Session,
    Depends(get_db)
]


# --------------------------------------
# Categories API
# --------------------------------------

@router.get(
    "/categories",
    response_model=list[CategoryResponse]
)
def get_categories(db: DBSession):

    return service.get_categories(db)


# --------------------------------------
# Projects API
# --------------------------------------

@router.get(
    "/projects",
    response_model=list[ProjectResponse]
)
def get_projects(db: DBSession):

    return service.get_projects(db)


# --------------------------------------
# Trips API
# --------------------------------------

@router.get(
    "/trips",
    response_model=list[TripResponse]
)
def get_trips(db: DBSession):

    return service.get_trips(db)


# --------------------------------------
# Currencies API
# --------------------------------------

@router.get(
    "/currencies",
    response_model=list[CurrencyResponse]
)
def get_currencies(db: DBSession):

    return service.get_currencies(db)


# --------------------------------------
# Departments API
# --------------------------------------

@router.get(
    "/departments",
    response_model=list[DepartmentResponse]
)
def get_departments(db: DBSession):

    return service.get_departments(db)


# --------------------------------------
# Approval Policy API
# --------------------------------------

@router.get(
    "/approval-policy",
    response_model=ApprovalPolicyResponse
)
def get_approval_policy(db: DBSession):

    policy = service.get_approval_policy(db)

    if policy is None:

        raise HTTPException(
            status_code=404,
            detail="Active approval policy not found"
        )

    return policy
