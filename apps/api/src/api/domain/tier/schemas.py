from uuid import UUID
from pydantic import BaseModel, Field
from typing_extensions import Annotated

from api.schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
    UUIDSchema,
)


class TierBase(BaseModel):
    name: Annotated[str, Field(examples=["unlimited"])]

    class Config:
        from_attributes = True
        validate_assignment = True


class TierCreate(TierBase):
    slug: Annotated[str, Field(description="Unique slug for the tier", examples=["unlimited-tier"])]


class TierUpdate(TierBase):
    pass


class TierDelete(BaseModel, SoftDeletionSchema):
    pass


class TierResponse(TierBase, TimestampSchema, UUIDSchema):
    slug: Annotated[str, Field(description="Unique slug for the tier", examples=["unlimited-tier"])]
