from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field

from api.core.enums import ColorRangeEnum


# ColorRange schemas
class ColorRangeBase(BaseModel):
    name: Annotated[ColorRangeEnum, Field(description="Color range name")]


class ColorRangeCreate(ColorRangeBase):
    pass


class ColorRangeUpdate(ColorRangeBase):
    pass


class ColorRange(ColorRangeBase):
    id: Annotated[UUID, Field(description="Unique identifier")]

    class Config:
        from_attributes = True
