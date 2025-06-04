from typing import Annotated
from uuid import UUID

from api.core.enums import OverlayEnum
from pydantic import BaseModel, Field


class ProductSwatchBase(BaseModel):
    hex_color: Annotated[str, Field(description="Hex color code")]
    rgb_color: Annotated[list[int], Field(description="RGB color values")]
    oklch_color: Annotated[list[float], Field(description="OKLCH color values")]
    gradient_start: Annotated[list[float], Field(description="Gradient start color values")]
    gradient_end: Annotated[list[float], Field(description="Gradient end color values")]
    overlay: Annotated[OverlayEnum | None, Field(description="Overlay effect")] = None


class ProductSwatchCreate(ProductSwatchBase):
    product_id: Annotated[UUID, Field(description="ID of the product")]


class ProductSwatchUpdate(BaseModel):
    hex_color: Annotated[str | None, Field(description="Hex color code")] = None
    rgb_color: Annotated[list[int] | None, Field(description="RGB color values")] = None
    oklch_color: Annotated[list[float] | None, Field(description="OKLCH color values")] = None
    gradient_start: Annotated[list[float] | None, Field(description="Gradient start color values")] = None
    gradient_end: Annotated[list[float] | None, Field(description="Gradient end color values")] = None
    overlay: Annotated[OverlayEnum | None, Field(description="Overlay effect")] = None
    product_id: Annotated[UUID | None, Field(description="ID of the product")] = None


class ProductSwatch(ProductSwatchBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
    product_id: Annotated[UUID, Field(description="ID of the product")]

    class Config:
        from_attributes = True
