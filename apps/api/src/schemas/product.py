from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from ..core.enums import ProductTypeEnum, ColorRangeEnum
from .product_swatch import ProductSwatch
from .product_variant import ProductVariant

from .mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)


class ProductBase(BaseModel):
    name: Annotated[str, Field(description="Product name")]
    iscc_nbs_category: Annotated[
        str | None, Field(description="ISCC NBS color category")
    ] = None


class ProductCreate(ProductBase):
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    product_types: Annotated[
        list[UUID] | None, Field(description="IDs of product types")
    ] = None
    color_ranges: Annotated[
        list[UUID] | None, Field(description="IDs of color ranges")
    ] = None
    tags: Annotated[list[UUID] | None, Field(description="IDs of tags")] = None
    analogous: Annotated[
        list[UUID] | None, Field(description="IDs of analogous colors")
    ] = None


class ProductUpdate(BaseModel):
    name: Annotated[str | None, Field(description="Product name")] = None
    iscc_nbs_category: Annotated[
        str | None, Field(description="ISCC NBS color category")
    ] = None
    product_line_id: Annotated[
        UUID | None, Field(description="ID of the product line")
    ] = None
    product_types: Annotated[
        list[UUID] | None, Field(description="IDs of product types")
    ] = None
    color_ranges: Annotated[
        list[UUID] | None, Field(description="IDs of color ranges")
    ] = None
    tags: Annotated[list[UUID] | None, Field(description="IDs of tags")] = None
    analogous: Annotated[
        list[UUID] | None, Field(description="IDs of analogous colors")
    ] = None


class ProductDelete(BaseModel, SoftDeletionSchema):
    """Product delete schema"""

    pass


class ProductTypeInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]
    name: Annotated[ProductTypeEnum, Field(description="Product type name")]


class ColorRangeInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]
    name: Annotated[ColorRangeEnum, Field(description="Color range name")]


class TagInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]
    name: Annotated[str, Field(description="Tag name")]


class AnalogousInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]
    name: Annotated[str, Field(description="Analogous color name")]


class Product(ProductBase, TimestampSchema, SoftDeletionSchema):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    swatch: Annotated[
        ProductSwatch | None, Field(description="Product swatch information")
    ] = None
    variants: Annotated[list[ProductVariant], Field(description="Product variants")]
    product_types: Annotated[list[ProductTypeInfo], Field(description="Product types")]
    color_ranges: Annotated[list[ColorRangeInfo], Field(description="Color ranges")]
    tags: Annotated[list[TagInfo], Field(description="Tags")]
    analogous: Annotated[list[AnalogousInfo], Field(description="Analogous colors")]


class ProductFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by name")] = None
    product_line_id: Annotated[
        UUID | None, Field(description="Filter by product line ID")
    ] = None
    product_type_id: Annotated[
        UUID | None, Field(description="Filter by product type ID")
    ] = None
    color_range_id: Annotated[
        UUID | None, Field(description="Filter by color range ID")
    ] = None
    tag_id: Annotated[UUID | None, Field(description="Filter by tag ID")] = None
    analogous_id: Annotated[
        UUID | None, Field(description="Filter by analogous ID")
    ] = None
    iscc_nbs_category: Annotated[
        str | None, Field(description="Filter by ISCC NBS category")
    ] = None
