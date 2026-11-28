#defines the information React will eventually send when creating a spend request.

from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)


class SpendRequestCreate(BaseModel):

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

    title: str = Field(
        min_length=5,
        max_length=150
    )

    amount: Decimal = Field(
        gt=0,
        le=Decimal("100000000"),
        max_digits=12,
        decimal_places=2
    )

    currency_code: str = Field(
        pattern=r"^[A-Z]{3}$"
    )

    category_id: str = Field(
        min_length=1,
        max_length=50
    )

    supplier: str = Field(
        default="",
        max_length=150
    )

    project_id: str | None = Field(
        default=None,
        max_length=50
    )

    trip_id: str | None = Field(
        default=None,
        max_length=50
    )

    justification: str = Field(
        min_length=10,
        max_length=2000
    )

    quote_name: str | None = Field(
        default=None,
        max_length=255
    )

    no_quote_reason: str | None = Field(
        default=None,
        max_length=1000
    )

    @model_validator(mode="after")
    def validate_quotation(self):

        if not self.quote_name:

            if (
                not self.no_quote_reason
                or len(self.no_quote_reason) < 5
            ):

                raise ValueError(
                    "Provide a quotation or a valid "
                    "reason for not providing one"
                )

        return self
