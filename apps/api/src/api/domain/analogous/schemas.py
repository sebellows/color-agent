from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field


class AnalogousBase(BaseModel):
    name: Annotated[str, Field(description="Analogous color name")]


class AnalogousCreate(AnalogousBase):
    pass


class AnalogousUpdate(AnalogousBase):
    pass


class Analogous(AnalogousBase):
    id: Annotated[UUID, Field(description="Unique identifier")]

    class Config:
        from_attributes = True
