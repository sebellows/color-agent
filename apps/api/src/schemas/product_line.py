from typing import Optional, List, Annotated
from pydantic import BaseModel, Field, ConfigDict


class ProductLineBase(BaseModel):
    name: Annotated[str, Field(description="Product line name")]
    marketing_name: Annotated[
        str, Field(description="Marketing name for the product line")
    ]
    slug: Annotated[str, Field(description="Unique identifier slug")]
    vendor_slug: Annotated[Optional[str], Field(description="Vendor-specific slug")] = (
        None
    )
    product_line_type: Annotated[str, Field(description="Type of product line")]
    description: Annotated[
        Optional[str], Field(description="Product line description")
    ] = None


class ProductLineCreate(ProductLineBase):
    vendor_id: Annotated[int, Field(description="ID of the vendor")]


class ProductLineUpdate(BaseModel):
    name: Annotated[Optional[str], Field(description="Product line name")] = None
    marketing_name: Annotated[Optional[str], Field(description="Marketing name")] = None
    slug: Annotated[Optional[str], Field(description="Unique identifier slug")] = None
    vendor_slug: Annotated[Optional[str], Field(description="Vendor-specific slug")] = (
        None
    )
    product_line_type: Annotated[
        Optional[str], Field(description="Type of product line")
    ] = None
    description: Annotated[
        Optional[str], Field(description="Product line description")
    ] = None
    vendor_id: Annotated[Optional[int], Field(description="ID of the vendor")] = None


class ProductLine(ProductLineBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    vendor_id: Annotated[int, Field(description="ID of the vendor")]


class ProductLineFilterParams(BaseModel):
    name: Annotated[Optional[str], Field(description="Filter by name")] = None
    product_line_type: Annotated[Optional[str], Field(description="Filter by type")] = (
        None
    )
    vendor_id: Annotated[Optional[int], Field(description="Filter by vendor ID")] = None
