from pydantic import BaseModel, Field
from typing_extensions import Annotated

from api.schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
    UUIDSchema,
)


class TierBase(BaseModel):
    name: Annotated[str, Field(examples=["unlimited"])]


class TierCreate(TierBase):
    class Config:
        from_attributes = True
        validate_assignment = True


class TierUpdate(TierBase):
    class Config:
        from_attributes = True
        validate_assignment = True


class TierDelete(BaseModel, SoftDeletionSchema):
    pass


class TierResponse(TierBase, TimestampSchema, UUIDSchema):
    class Config:
        from_attributes = True
