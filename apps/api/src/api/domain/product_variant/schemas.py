from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field

from api.core.enums import (
    ApplicationMethodEnum,
    OpacityEnum,
    PackagingTypeEnum,
    ViscosityEnum,
)
from api.schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)


class ProductVariantBase(BaseModel):
    display_name: Annotated[str, Field(description="Display name")]
    marketing_name: Annotated[str, Field(description="Marketing name")]
    sku: Annotated[str, Field(description="Stock keeping unit")]
    discontinued: Annotated[bool | None, Field(description="Whether the variant is discontinued")] = False
    image_url: Annotated[str, Field(description="Image URL")]
    packaging: Annotated[PackagingTypeEnum, Field(description="Packaging type")]
    volume_ml: Annotated[float | None, Field(description="Volume in milliliters")] = None
    volume_oz: Annotated[float | None, Field(description="Volume in fluid ounces")] = None
    price: Annotated[int, Field(description="Price in cents")]
    product_url: Annotated[str, Field(description="Product URL")]
    opacity: Annotated[OpacityEnum | None, Field(description="Opacity level")] = None
    viscosity: Annotated[ViscosityEnum | None, Field(description="Viscosity level")] = None
    application_method: Annotated[ApplicationMethodEnum | None, Field(description="Application method")] = None
    vendor_product_id: Annotated[str | None, Field(description="Vendor's product ID")] = None


class ProductVariantCreate(ProductVariantBase):
    product_id: Annotated[UUID, Field(description="ID of the product")]
    locale_id: Annotated[UUID, Field(description="ID of the locale")]
    vendor_color_ranges: Annotated[
        list[str],
        Field(
            description="Original assigned vendor color range categories",
            default_factory=list,
        ),
    ]
    vendor_product_types: Annotated[
        list[str],
        Field(
            description="Original assigned vendor product type categories",
            default_factory=list,
        ),
    ]


class ProductVariantUpdate(BaseModel):
    display_name: Annotated[str | None, Field(description="Display name")] = None
    marketing_name: Annotated[str | None, Field(description="Marketing name")] = None
    sku: Annotated[str | None, Field(description="Stock keeping unit")] = None
    discontinued: Annotated[bool | None, Field(description="Whether the variant is discontinued")] = None
    image_url: Annotated[str | None, Field(description="Image URL")] = None
    packaging: Annotated[PackagingTypeEnum | None, Field(description="Packaging type")] = None
    volume_ml: Annotated[float | None, Field(description="Volume in milliliters")] = None
    volume_oz: Annotated[float | None, Field(description="Volume in fluid ounces")] = None
    price: Annotated[int | None, Field(description="Price in cents")] = None
    product_url: Annotated[str | None, Field(description="Product URL")] = None
    opacity: Annotated[OpacityEnum | None, Field(description="Opacity level")] = None
    viscosity: Annotated[ViscosityEnum | None, Field(description="Viscosity level")] = None
    application_method: Annotated[ApplicationMethodEnum | None, Field(description="Application method")] = None
    vendor_product_id: Annotated[str | None, Field(description="Vendor's product ID")] = None
    product_id: Annotated[UUID | None, Field(description="ID of the product")] = None
    locale_id: Annotated[UUID | None, Field(description="ID of the locale")] = None
    vendor_color_ranges: Annotated[
        list[str],
        Field(
            description="Original assigned vendor color range categories",
            default_factory=list,
        ),
    ]
    vendor_product_types: Annotated[
        list[str],
        Field(
            description="Original assigned vendor product type categories",
            default_factory=list,
        ),
    ]


class ProductVariantDelete(BaseModel, SoftDeletionSchema):
    """Product Variant delete schema"""

    pass


class ProductVariant(ProductVariantBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    product_id: Annotated[UUID, Field(description="ID of the product")]
    locale_id: Annotated[UUID, Field(description="ID of the locale")]
    vendor_color_ranges: Annotated[list[str], Field(description="Original assigned vendor color range categories")]
    vendor_product_types: Annotated[list[str], Field(description="Original assigned vendor product type categories")]

    class Config:
        from_attributes = True


class ProductVariantFilterParams(BaseModel):
    product_id: Annotated[UUID | None, Field(description="Filter by product ID")] = None
    locale_id: Annotated[UUID | None, Field(description="Filter by locale ID")] = None
    discontinued: Annotated[bool | None, Field(description="Filter by discontinued status")] = None
