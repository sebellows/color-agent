from typing import Optional, List, Annotated
from pydantic import BaseModel, Field, ConfigDict


class ProductSwatchBase(BaseModel):
    hex_color: Annotated[str, Field(description="Hex color code")]
    rgb_color: Annotated[List[int], Field(description="RGB color values")]
    oklch_color: Annotated[List[float], Field(description="OKLCH color values")]
    gradient_start: Annotated[
        List[float], Field(description="Gradient start color values")
    ]
    gradient_end: Annotated[List[float], Field(description="Gradient end color values")]
    overlay: Annotated[Optional[str], Field(description="Overlay effect")] = None


class ProductSwatchCreate(ProductSwatchBase):
    product_id: Annotated[int, Field(description="ID of the product")]


class ProductSwatchUpdate(BaseModel):
    hex_color: Annotated[Optional[str], Field(description="Hex color code")] = None
    rgb_color: Annotated[Optional[List[int]], Field(description="RGB color values")] = (
        None
    )
    oklch_color: Annotated[
        Optional[List[float]], Field(description="OKLCH color values")
    ] = None
    gradient_start: Annotated[
        Optional[List[float]], Field(description="Gradient start color values")
    ] = None
    gradient_end: Annotated[
        Optional[List[float]], Field(description="Gradient end color values")
    ] = None
    overlay: Annotated[Optional[str], Field(description="Overlay effect")] = None
    product_id: Annotated[Optional[int], Field(description="ID of the product")] = None


class ProductSwatch(ProductSwatchBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    product_id: Annotated[int, Field(description="ID of the product")]
