from typing import Optional, List, Annotated
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from .product_swatch import ProductSwatch
from .product_variant import ProductVariant
from ..core.enums import ProductTypeEnum, ColorRangeEnum


class ProductBase(BaseModel):
    name: Annotated[str, Field(description="Product name")]
    iscc_nbs_category: Annotated[
        Optional[str], Field(description="ISCC NBS color category")
    ] = None


class ProductCreate(ProductBase):
    product_line_id: Annotated[int, Field(description="ID of the product line")]
    product_types: Annotated[
        Optional[List[int]], Field(description="IDs of product types")
    ] = None
    color_ranges: Annotated[
        Optional[List[int]], Field(description="IDs of color ranges")
    ] = None
    tags: Annotated[Optional[List[int]], Field(description="IDs of tags")] = None
    analogous: Annotated[
        Optional[List[int]], Field(description="IDs of analogous colors")
    ] = None


class ProductUpdate(BaseModel):
    name: Annotated[Optional[str], Field(description="Product name")] = None
    iscc_nbs_category: Annotated[
        Optional[str], Field(description="ISCC NBS color category")
    ] = None
    product_line_id: Annotated[
        Optional[int], Field(description="ID of the product line")
    ] = None
    product_types: Annotated[
        Optional[List[int]], Field(description="IDs of product types")
    ] = None
    color_ranges: Annotated[
        Optional[List[int]], Field(description="IDs of color ranges")
    ] = None
    tags: Annotated[Optional[List[int]], Field(description="IDs of tags")] = None
    analogous: Annotated[
        Optional[List[int]], Field(description="IDs of analogous colors")
    ] = None


class ProductTypeInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    name: Annotated[ProductTypeEnum, Field(description="Product type name")]


class ColorRangeInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    name: Annotated[ColorRangeEnum, Field(description="Color range name")]


class TagInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    name: Annotated[str, Field(description="Tag name")]


class AnalogousInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    name: Annotated[str, Field(description="Analogous color name")]


class Product(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    product_line_id: Annotated[int, Field(description="ID of the product line")]
    swatch: Annotated[
        Optional[ProductSwatch], Field(description="Product swatch information")
    ] = None
    variants: Annotated[List[ProductVariant], Field(description="Product variants")]
    product_types: Annotated[List[ProductTypeInfo], Field(description="Product types")]
    color_ranges: Annotated[List[ColorRangeInfo], Field(description="Color ranges")]
    tags: Annotated[List[TagInfo], Field(description="Tags")]
    analogous: Annotated[List[AnalogousInfo], Field(description="Analogous colors")]
    created_at: Annotated[datetime, Field(description="Creation timestamp")]
    updated_at: Annotated[datetime, Field(description="Last update timestamp")]


class ProductFilterParams(BaseModel):
    name: Annotated[Optional[str], Field(description="Filter by name")] = None
    product_line_id: Annotated[
        Optional[int], Field(description="Filter by product line ID")
    ] = None
    product_type_id: Annotated[
        Optional[int], Field(description="Filter by product type ID")
    ] = None
    color_range_id: Annotated[
        Optional[int], Field(description="Filter by color range ID")
    ] = None
    tag_id: Annotated[Optional[int], Field(description="Filter by tag ID")] = None
    analogous_id: Annotated[
        Optional[int], Field(description="Filter by analogous ID")
    ] = None
    iscc_nbs_category: Annotated[
        Optional[str], Field(description="Filter by ISCC NBS category")
    ] = None
