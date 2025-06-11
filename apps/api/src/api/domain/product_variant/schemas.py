from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field

from api.domain.enums import (
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
    image_url: Annotated[str, Field(description="Image URL")]
    price: Annotated[int, Field(description="Price in cents")]
    product_url: Annotated[str, Field(description="Product URL")]
    discontinued: Annotated[bool | None, Field(description="Whether the variant is discontinued", default=False)]
    volume_ml: Annotated[float | None, Field(description="Volume in milliliters", default=None)]
    volume_oz: Annotated[float | None, Field(description="Volume in fluid ounces", default=None)]
    packaging: Annotated[PackagingTypeEnum, Field(description="Packaging type", default=PackagingTypeEnum.Unknown)]
    opacity: Annotated[OpacityEnum | None, Field(description="Opacity level", default=OpacityEnum.Unknown)]
    viscosity: Annotated[ViscosityEnum | None, Field(description="Viscosity level", default=ViscosityEnum.Unknown)]
    application_method: Annotated[
        ApplicationMethodEnum | None, Field(description="Application method", default=ApplicationMethodEnum.Unknown)
    ]
    vendor_product_id: Annotated[str | None, Field(description="Vendor's product ID", default=None)]
    vendor_color_range: Annotated[
        list[str],
        Field(
            description="Original assigned vendor color range categories",
            default_factory=list,
        ),
    ]
    vendor_product_type: Annotated[
        list[str],
        Field(
            description="Original assigned vendor product type categories",
            default_factory=list,
        ),
    ]

    class Config:
        from_attributes = True
        # Use enum values instead of names for serialization
        # (for `packaging`, `opacity`, `viscosity`, `application_method`)
        use_enum_values = True


class ProductVariantCreate(ProductVariantBase):
    locale_id: Annotated[UUID, Field(description="ID of the locale")]
    product_id: Annotated[UUID, Field(description="ID of the product")]


class ProductVariantUpdate(ProductVariantBase):
    """Product Variant update schema"""

    pass


class ProductVariantDelete(BaseModel, SoftDeletionSchema):
    """Product Variant delete schema"""

    pass


class ProductVariantRead(ProductVariantBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    product_id: Annotated[UUID, Field(description="ID of the product")]
    locale_id: Annotated[UUID, Field(description="ID of the locale")]


class ProductVariantResponse(ProductVariantBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    locale_id: Annotated[UUID, Field(description="ID of the locale")]
    product_id: Annotated[UUID, Field(description="ID of the product")]


class ProductVariantFilterParams(BaseModel):
    discontinued: Annotated[bool | None, Field(description="Filter by discontinued status", default=None)]
    locale_id: Annotated[UUID | None, Field(description="Filter by locale ID", default=None)]
    name: Annotated[str | None, Field(description="Filter by display name", default=None)]
    packaging: Annotated[PackagingTypeEnum | None, Field(description="Filter by packaging type", default=None)]
    price: Annotated[int | None, Field(description="Filter by price in cents", default=None)]
    product_id: Annotated[UUID | None, Field(description="Filter by product ID", default=None)]
