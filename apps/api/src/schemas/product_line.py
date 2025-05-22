from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from ..core.enums import ProductLineTypeEnum

from .mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)


class ProductLineBase(BaseModel):
    name: Annotated[str, Field(description="Product line name")]
    marketing_name: Annotated[
        str, Field(description="Marketing name for the product line")
    ]
    slug: Annotated[str, Field(description="Unique identifier slug")]
    vendor_slug: Annotated[str | None, Field(description="Vendor-specific slug")] = None
    product_line_type: Annotated[
        ProductLineTypeEnum, Field(description="Type of product line")
    ]
    description: Annotated[
        str | None, Field(description="Product line description")
    ] = None


class ProductLineCreate(ProductLineBase):
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]


class ProductLineUpdate(BaseModel):
    name: Annotated[str | None, Field(description="Product line name")] = None
    marketing_name: Annotated[str | None, Field(description="Marketing name")] = None
    slug: Annotated[str | None, Field(description="Unique identifier slug")] = None
    vendor_slug: Annotated[str | None, Field(description="Vendor-specific slug")] = None
    product_line_type: Annotated[
        ProductLineTypeEnum | None, Field(description="Type of product line")
    ] = None
    description: Annotated[
        str | None, Field(description="Product line description")
    ] = None
    vendor_id: Annotated[UUID | None, Field(description="ID of the vendor")] = None


class ProductLineDelete(BaseModel, SoftDeletionSchema):
    """Product Line delete schema"""

    pass


class ProductLine(ProductLineBase, TimestampSchema, SoftDeletionSchema):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]


class ProductLineFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by name")] = None
    product_line_type: Annotated[
        ProductLineTypeEnum | None, Field(description="Filter by type")
    ] = None
    vendor_id: Annotated[UUID | None, Field(description="Filter by vendor ID")] = None
