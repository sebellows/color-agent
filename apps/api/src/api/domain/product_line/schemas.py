from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field

from api.core.enums import ProductLineTypeEnum
from api.schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)
from api.schemas.pagination import PaginatedResponse


class ProductLineBase(BaseModel):
    name: Annotated[str, Field(description="Product line name")]
    marketing_name: Annotated[str, Field(description="Marketing name for the product line")]
    slug: Annotated[str, Field(description="Unique identifier slug")]
    vendor_slug: Annotated[str | None, Field(description="Vendor-specific slug", default=None)]
    product_line_type: Annotated[ProductLineTypeEnum, Field(description="Type of product line")]
    description: Annotated[str | None, Field(description="Product line description", default=None)]

    class Config:
        from_attributes = True
        use_enum_values = True


class ProductLineCreate(ProductLineBase):
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]


class ProductLineUpdate(BaseModel):
    name: Annotated[str | None, Field(description="Product line name", default=None)]
    marketing_name: Annotated[str | None, Field(description="Marketing name", default=None)]
    slug: Annotated[str | None, Field(description="Unique identifier slug", default=None)]
    vendor_slug: Annotated[str | None, Field(description="Vendor-specific slug", default=None)]
    product_line_type: Annotated[ProductLineTypeEnum | None, Field(description="Type of product line", default=None)]
    description: Annotated[str | None, Field(description="Product line description", default=None)]
    # vendor_id: Annotated[UUID | None, Field(description="ID of the vendor", default=None)]

    class Config:
        from_attributes = True
        use_enum_values = True


class ProductLineDelete(BaseModel, SoftDeletionSchema):
    """Product Line delete schema"""

    pass


class ProductLine(ProductLineBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]


class ProductLineResponse(ProductLineBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]


class ProductLineFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by name", default=None)]
    product_line_type: Annotated[ProductLineTypeEnum | None, Field(description="Filter by type", default=None)]
    vendor_id: Annotated[UUID | None, Field(description="Filter by vendor ID", default=None)]


class PaginatedProductLine(PaginatedResponse[ProductLine]):
    """Paginated response for Product Lines"""

    pass
