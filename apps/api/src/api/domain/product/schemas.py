from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field

from api.core.enums import ColorRangeEnum, ProductTypeEnum
from api.domain.analogous import AnalogousSchema

# from api.core.enums import ColorRangeEnum, ProductTypeEnum
from api.domain.product_swatch.schemas import ProductSwatch
from api.domain.product_variant.schemas import ProductVariant
from api.domain.tag import TagSchema
from api.schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)
from api.schemas.pagination import PaginatedResponse


class ProductBase(BaseModel):
    name: Annotated[str, Field(description="Product name")]
    iscc_nbs_category: Annotated[str | None, Field(description="ISCC NBS color category")]
    description: Annotated[str | None, Field(description="Product description", default=None)]
    color_range: Annotated[
        list["ColorRangeEnum"], Field(description="List of color range categories", default_factory=list)
    ]
    product_type: Annotated[
        list["ProductTypeEnum"], Field(description="List of product type categories", default_factory=list)
    ]

    class Config:
        from_attributes = True
        use_enum_values = True


class ProductCreate(ProductBase):
    product_line_id: Annotated[UUID, Field(description="ID of the parent product line")]
    # product_type: list[ProductTypeEnum]
    # color_range: list[ColorRangeEnum]
    slug: Annotated[str, Field(description="Product slug, must be unique")]

    # product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    # slug: Annotated[str, Field(description="Product slug, must be unique")]
    # product_type: Annotated[list["ProductTypeEnum"] | None, Field(description="IDs of product types", default=None)]
    # color_range: Annotated[list["ColorRangeEnum"] | None, Field(description="IDs of color ranges", default=None)]
    tags: Annotated[list[str] | None, Field(description="IDs of tags", default=None)]
    analogous: Annotated[list[str] | None, Field(description="IDs of analogous colors", default=None)]


class ProductUpdate(ProductBase):
    # pass
    # name: str | None
    # slug: str | None
    # iscc_nbs_category: str | None
    # product_type: list[ProductTypeEnum] | None
    # color_range: list[ColorRangeEnum] | None
    tags: list[str] | None
    analogous: list[str] | None


# class ProductUpdate(BaseModel):
#     name: Annotated[str | None, Field(description="Product name", default=None)]
#     slug: Annotated[str | None, Field(description="Product slug, must be unique", default=None)]
#     iscc_nbs_category: Annotated[str | None, Field(description="ISCC NBS color category", default=None)]
#     product_line_id: Annotated[UUID | None, Field(description="ID of the product line", default=None)]
#     product_type: Annotated[list[ProductTypeEnum] | None, Field(description="IDs of product types", default=None)]
#     color_range: Annotated[list[ColorRangeEnum] | None, Field(description="IDs of color ranges", default=None)]
#     tags: Annotated[list[str] | None, Field(description="IDs of tags", default=None)]
#     analogous: Annotated[list[str] | None, Field(description="IDs of analogous colors", default=None)]


class ProductDelete(BaseModel, SoftDeletionSchema):
    """Product delete schema"""

    pass


class Product(ProductBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique slug for the product")]
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    # swatch: Annotated[ProductSwatch | None, Field(description="Product swatch information", default=None)]
    # variants: Annotated[list[ProductVariant], Field(description="Product variants")]
    # product_type: Annotated[list[ProductTypeEnum], Field(description="Product type categories")]
    # color_range: Annotated[list[ColorRangeEnum], Field(description="Color range categories")]
    # tags: Annotated[list[TagSchema], Field(description="Tags", default_factory=list)]
    # analogous: Annotated[list[AnalogousSchema], Field(description="Analogous colors", default_factory=list)]


class ProductResponse(ProductBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique slug for the product")]
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    swatch: Annotated[ProductSwatch, Field(description="Product swatch information")]
    variants: Annotated[list[ProductVariant], Field(description="Product variants")]
    # product_type: Annotated[list[ProductTypeEnum], Field(description="Product type categories")]
    # color_range: Annotated[list[ColorRangeEnum], Field(description="Color range categories")]
    tags: Annotated[list[TagSchema], Field(description="Tags", default_factory=list)]
    analogous: Annotated[list[AnalogousSchema], Field(description="Analogous colors", default_factory=list)]


class ProductFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by name", default=None)]
    slug: Annotated[str | None, Field(description="Filter by slug", default=None)]
    product_line_id: Annotated[UUID | None, Field(description="Filter by product line ID", default=None)]
    product_type_id: Annotated[UUID | None, Field(description="Filter by product type ID", default=None)]
    color_range_id: Annotated[UUID | None, Field(description="Filter by color range ID", default=None)]
    tag_id: Annotated[UUID | None, Field(description="Filter by tag ID", default=None)]
    analogous_id: Annotated[UUID | None, Field(description="Filter by analogous ID", default=None)]
    iscc_nbs_category: Annotated[str | None, Field(description="Filter by ISCC NBS category", default=None)]


class PaginatedProducts(PaginatedResponse[ProductResponse]):
    """Paginated response for products."""

    pass
