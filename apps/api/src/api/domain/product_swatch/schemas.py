from typing import Annotated
from uuid import UUID

from domain.enums import OverlayEnum
from pydantic import BaseModel, Field


class ProductSwatchBase(BaseModel):
    hex_color: Annotated[str, Field(description="Hex color code")]
    rgb_color: Annotated[list[int], Field(description="RGB color values")]
    oklch_color: Annotated[list[float], Field(description="OKLCH color values")]
    gradient_start: Annotated[list[float], Field(description="Gradient start color values")]
    gradient_end: Annotated[list[float], Field(description="Gradient end color values")]
    overlay: Annotated[OverlayEnum | None, Field(description="Overlay effect", default=OverlayEnum.Unknown)]

    class Config:
        from_attributes = True
        use_enum_values = True


class ProductSwatchCreate(ProductSwatchBase):
    product_id: Annotated[UUID, Field(description="ID of the product")]


class ProductSwatchUpdate(ProductSwatchBase):
    """Product Swatch update schema"""

    pass


class ProductSwatchRead(ProductSwatchBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
    product_id: Annotated[UUID, Field(description="ID of the product")]


class ProductSwatchResponse(BaseModel):
    id: Annotated[UUID, Field(description="Unique identifier")]
    product_id: Annotated[UUID, Field(description="ID of the product")]
    hex_color: Annotated[str, Field(description="Hex color code")]
    rgb_color: Annotated[str, Field(description="Formatted RGB color values for CSS")]
    oklch_color: Annotated[str, Field(description="Formatted OKLCH color values")]
    gradient_start: Annotated[
        str, Field(description="Formatted OKLCH color for SVG gradient's starting stop color value")
    ]
    gradient_end: Annotated[str, Field(description="Formatted OKLCH color for SVG gradient's ending stop color value")]
    overlay: Annotated[OverlayEnum | None, Field(description="Overlay effect", default=OverlayEnum.Unknown)]

    class Config:
        from_attributes = True
        use_enum_values = True
