from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field

from api.core.enums import ColorRangeEnum, ProductTypeEnum
from api.domain.analogous import AnalogousSchema
from api.domain.color_range import ColorRangeSchema

# from api.core.enums import ColorRangeEnum, ProductTypeEnum
from api.domain.product_swatch.schemas import ProductSwatch
from api.domain.product_type import ProductTypeSchema
from api.domain.product_variant.schemas import ProductVariant
from api.domain.tag import TagSchema
from api.schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)
from api.schemas.pagination import PaginatedResponse


class ProductBase(BaseModel):
    name: Annotated[str, Field(description="Product name")]
    iscc_nbs_category: Annotated[str | None, Field(description="ISCC NBS color category")] = None


class ProductCreate(ProductBase):
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    slug: Annotated[str, Field(description="Product slug, must be unique")]
    product_type: Annotated[list[ProductTypeEnum] | None, Field(description="IDs of product types")] = None
    color_range: Annotated[list[ColorRangeEnum] | None, Field(description="IDs of color ranges")] = None
    tags: Annotated[list[str] | None, Field(description="IDs of tags")] = None
    analogous: Annotated[list[str] | None, Field(description="IDs of analogous colors")] = None


class ProductUpdate(BaseModel):
    name: Annotated[str | None, Field(description="Product name")] = None
    iscc_nbs_category: Annotated[str | None, Field(description="ISCC NBS color category")] = None
    product_line_id: Annotated[UUID | None, Field(description="ID of the product line")] = None
    product_type: Annotated[list[ProductTypeEnum] | None, Field(description="IDs of product types")] = None
    color_range: Annotated[list[ColorRangeEnum] | None, Field(description="IDs of color ranges")] = None
    tags: Annotated[list[str] | None, Field(description="IDs of tags")] = None
    analogous: Annotated[list[str] | None, Field(description="IDs of analogous colors")] = None


class ProductDelete(BaseModel, SoftDeletionSchema):
    """Product delete schema"""

    pass


class Product(ProductBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique slug for the product")]
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    swatch: Annotated[ProductSwatch | None, Field(description="Product swatch information")] = None
    variants: Annotated[list[ProductVariant], Field(description="Product variants")]
    product_type: Annotated[list[ProductTypeSchema], Field(description="Product types")]
    color_range: Annotated[list[ColorRangeSchema], Field(description="Color ranges")]
    tags: Annotated[list[TagSchema], Field(description="Tags")]
    analogous: Annotated[list[AnalogousSchema], Field(description="Analogous colors")]

    class Config:
        from_attributes = True


class ProductResponse(ProductBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique slug for the product")]
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    swatch: Annotated[ProductSwatch | None, Field(description="Product swatch information")] = None
    variants: Annotated[list[ProductVariant], Field(description="Product variants")]
    product_type: Annotated[list[ProductTypeSchema], Field(description="Product types")]
    color_range: Annotated[list[ColorRangeSchema], Field(description="Color ranges")]
    tags: Annotated[list[TagSchema], Field(description="Tags")]
    analogous: Annotated[list[AnalogousSchema], Field(description="Analogous colors")]

    class Config:
        from_attributes = True


class ProductFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by name")] = None
    slug: Annotated[str | None, Field(description="Filter by slug")] = None
    product_line_id: Annotated[UUID | None, Field(description="Filter by product line ID")] = None
    product_type_id: Annotated[UUID | None, Field(description="Filter by product type ID")] = None
    color_range_id: Annotated[UUID | None, Field(description="Filter by color range ID")] = None
    tag_id: Annotated[UUID | None, Field(description="Filter by tag ID")] = None
    analogous_id: Annotated[UUID | None, Field(description="Filter by analogous ID")] = None
    iscc_nbs_category: Annotated[str | None, Field(description="Filter by ISCC NBS category")] = None


class PaginatedProducts(PaginatedResponse[Product]):
    """Paginated response for products."""

    pass
