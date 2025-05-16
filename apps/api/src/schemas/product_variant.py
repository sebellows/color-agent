from typing import Optional, List, Annotated
from pydantic import BaseModel, Field, ConfigDict


class ProductVariantBase(BaseModel):
    display_name: Annotated[str, Field(description="Display name")]
    marketing_name: Annotated[str, Field(description="Marketing name")]
    sku: Annotated[str, Field(description="Stock keeping unit")]
    discontinued: Annotated[
        Optional[bool], Field(description="Whether the variant is discontinued")
    ] = False
    image_url: Annotated[str, Field(description="Image URL")]
    packaging: Annotated[str, Field(description="Packaging type")]
    volume_ml: Annotated[
        Optional[float], Field(description="Volume in milliliters")
    ] = None
    volume_oz: Annotated[
        Optional[float], Field(description="Volume in fluid ounces")
    ] = None
    price: Annotated[int, Field(description="Price in cents")]
    product_url: Annotated[str, Field(description="Product URL")]
    opacity: Annotated[Optional[str], Field(description="Opacity level")] = None
    viscosity: Annotated[Optional[str], Field(description="Viscosity level")] = None
    application_method: Annotated[
        Optional[str], Field(description="Application method")
    ] = None
    vendor_product_id: Annotated[
        Optional[str], Field(description="Vendor's product ID")
    ] = None


class ProductVariantCreate(ProductVariantBase):
    product_id: Annotated[int, Field(description="ID of the product")]
    locale_id: Annotated[int, Field(description="ID of the locale")]
    vendor_color_ranges: Annotated[
        Optional[List[int]], Field(description="IDs of vendor color ranges")
    ] = None
    vendor_product_types: Annotated[
        Optional[List[int]], Field(description="IDs of vendor product types")
    ] = None


class ProductVariantUpdate(BaseModel):
    display_name: Annotated[Optional[str], Field(description="Display name")] = None
    marketing_name: Annotated[Optional[str], Field(description="Marketing name")] = None
    sku: Annotated[Optional[str], Field(description="Stock keeping unit")] = None
    discontinued: Annotated[
        Optional[bool], Field(description="Whether the variant is discontinued")
    ] = None
    image_url: Annotated[Optional[str], Field(description="Image URL")] = None
    packaging: Annotated[Optional[str], Field(description="Packaging type")] = None
    volume_ml: Annotated[
        Optional[float], Field(description="Volume in milliliters")
    ] = None
    volume_oz: Annotated[
        Optional[float], Field(description="Volume in fluid ounces")
    ] = None
    price: Annotated[Optional[int], Field(description="Price in cents")] = None
    product_url: Annotated[Optional[str], Field(description="Product URL")] = None
    opacity: Annotated[Optional[str], Field(description="Opacity level")] = None
    viscosity: Annotated[Optional[str], Field(description="Viscosity level")] = None
    application_method: Annotated[
        Optional[str], Field(description="Application method")
    ] = None
    vendor_product_id: Annotated[
        Optional[str], Field(description="Vendor's product ID")
    ] = None
    product_id: Annotated[Optional[int], Field(description="ID of the product")] = None
    locale_id: Annotated[Optional[int], Field(description="ID of the locale")] = None
    vendor_color_ranges: Annotated[
        Optional[List[int]], Field(description="IDs of vendor color ranges")
    ] = None
    vendor_product_types: Annotated[
        Optional[List[int]], Field(description="IDs of vendor product types")
    ] = None


class ProductVariant(ProductVariantBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    product_id: Annotated[int, Field(description="ID of the product")]
    locale_id: Annotated[int, Field(description="ID of the locale")]
    vendor_color_ranges: Annotated[
        List["VendorColorRangeInfo"], Field(description="Vendor color ranges")
    ]
    vendor_product_types: Annotated[
        List["VendorProductTypeInfo"], Field(description="Vendor product types")
    ]


class VendorColorRangeInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    name: Annotated[str, Field(description="Vendor color range name")]


class VendorProductTypeInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    name: Annotated[str, Field(description="Vendor product type name")]


class ProductVariantFilterParams(BaseModel):
    product_id: Annotated[Optional[int], Field(description="Filter by product ID")] = (
        None
    )
    locale_id: Annotated[Optional[int], Field(description="Filter by locale ID")] = None
    discontinued: Annotated[
        Optional[bool], Field(description="Filter by discontinued status")
    ] = None
    vendor_color_range_id: Annotated[
        Optional[int], Field(description="Filter by vendor color range ID")
    ] = None
    vendor_product_type_id: Annotated[
        Optional[int], Field(description="Filter by vendor product type ID")
    ] = None
