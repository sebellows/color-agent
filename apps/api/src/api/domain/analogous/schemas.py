from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field


class AnalogousBase(BaseModel):
    name: Annotated[str, Field(description="Analogous color name")]

    class Config:
        from_attributes = True


class AnalogousCreate(AnalogousBase):
    slug: Annotated[str, Field(description="Unique slug for the tier", examples=["unlimited-tier"])]


class AnalogousUpdate(AnalogousBase):
    pass


class AnalogousRead(AnalogousBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique slug for the tier", examples=["unlimited-tier"])]


class AnalogousResponse(AnalogousBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique slug for the tier", examples=["unlimited-tier"])]
