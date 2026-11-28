#Pydantic schemas define what information our APIs return to the frontend.


from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class MasterDataResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )


class DepartmentResponse(MasterDataResponse):

    id: str
    name: str
    active: bool


class CategoryResponse(MasterDataResponse):

    id: str
    name: str
    is_it: bool
    requires_project: bool
    requires_trip: bool
    active: bool


class ProjectResponse(MasterDataResponse):

    id: str
    name: str
    active: bool


class TripResponse(MasterDataResponse):

    id: str
    name: str
    active: bool


class CurrencyResponse(MasterDataResponse):

    code: str
    name: str
    usd_rate: Decimal
    active: bool


class ApprovalPolicyResponse(MasterDataResponse):

    id: str
    name: str
    threshold_usd: Decimal
    additional_approver_id: str
    require_it_approval: bool
    active: bool
