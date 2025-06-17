from typing import TYPE_CHECKING, Annotated
from uuid import UUID

from domain.enums import ColorRangeEnum, ProductTypeEnum
from pydantic import BaseModel, Field
from schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)


if TYPE_CHECKING:
    from domain.analogous.schemas import AnalogousResponse
    from domain.product_swatch.schemas import ProductSwatchCreate, ProductSwatchResponse
    from domain.product_variant.schemas import ProductVariantCreate, ProductVariantResponse
    from domain.tag.schemas import TagResponse


class ProductBase(BaseModel):
    name: Annotated[str, Field(description="Product name")]
    iscc_nbs_category: Annotated[
        str | None, Field(description="ISCC NBS color category", examples=["Deep Purplish Red", "Vivid Yellow"])
    ]
    description: Annotated[str | None, Field(description="Product description", default=None)]
    color_range: Annotated[
        list["ColorRangeEnum"],
        Field(description="List of color range categories", examples=["Red", "Turquoise"], default_factory=list),
    ]
    product_type: Annotated[
        list["ProductTypeEnum"],
        Field(description="List of product type categories", examples=["Metallic", "Wash"], default_factory=list),
    ]

    class Config:
        from_attributes = True
        # Use enum values instead of names for serialization,
        # `color_range` and `product_type`
        use_enum_values = True


class ProductCreate(ProductBase):
    product_line_id: Annotated[UUID, Field(description="ID of the parent product line")]
    slug: Annotated[
        str, Field(description="Product slug, must be unique", examples=["nighthaunt-gloom", "screaming-skull"])
    ]
    tags: Annotated[list[str] | None, Field(description="Tags", default_factory=list)]
    analogous: Annotated[list[str] | None, Field(description="Analogous color tags", default_factory=list)]
    swatch: Annotated["ProductSwatchCreate", Field(description="Product swatch information")]
    variants: Annotated[list["ProductVariantCreate"], Field(description="Product variants")]


class ProductUpdate(ProductBase):
    """Product update schema"""

    tags: Annotated[list[str] | None, Field(description="Tags", default_factory=list)]
    analogous: Annotated[list[str] | None, Field(description="Analogous color tags", default_factory=list)]


class ProductDelete(BaseModel, SoftDeletionSchema):
    """Product delete schema"""

    pass


class ProductRead(ProductBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[
        str, Field(description="Unique slug for the product", examples=["nighthaunt-gloom", "screaming-skull"])
    ]
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]


class ProductResponse(ProductBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[
        str, Field(description="Unique slug for the product", examples=["nighthaunt-gloom", "screaming-skull"])
    ]
    product_line_id: Annotated[UUID, Field(description="ID of the product line")]
    swatch: Annotated["ProductSwatchResponse", Field(description="Product swatch information")]
    variants: Annotated[list["ProductVariantResponse"], Field(description="Product variants")]
    tags: Annotated[list["TagResponse"], Field(description="Tags", default_factory=list)]
    analogous: Annotated[list["AnalogousResponse"], Field(description="Analogous colors", default_factory=list)]


class ProductFilters(BaseModel):
    id: Annotated[UUID | None, Field(description="Filter by product ID", default=None)]
    name: Annotated[str | None, Field(description="Filter by name", default=None)]
    slug: Annotated[
        str | None, Field(description="Filter by slug", examples=["nighthaunt-gloom", "screaming-skull"], default=None)
    ]
    product_type: Annotated[ProductTypeEnum | None, Field(description="Filter by product type", default=None)]
    color_range: Annotated[ColorRangeEnum | None, Field(description="Filter by color range ID", default=None)]
    tag: Annotated[str | None, Field(description="Filter by tag", default=None)]
    analogous: Annotated[str | None, Field(description="Filter by analogous color tag", default=None)]
    iscc_nbs_category: Annotated[str | None, Field(description="Filter by ISCC NBS category", default=None)]
