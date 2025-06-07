from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field

from api.domain.product_line.schemas import ProductLineResponse
from api.schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)


class VendorBase(BaseModel):
    name: Annotated[str, Field(description="Vendor name")]
    url: Annotated[str, Field(description="Vendor website URL")]
    slug: Annotated[str, Field(description="Unique identifier slug")]
    platform: Annotated[str, Field(description="E-commerce platform")]
    description: Annotated[str, Field(description="Vendor description")]
    pdp_slug: Annotated[str, Field(description="Product detail page slug")]
    plp_slug: Annotated[str, Field(description="Product listing page slug")]

    class Config:
        from_attributes = True


class VendorCreate(VendorBase):
    pass


class VendorUpdate(VendorBase):
    pass
    # name: Annotated[str | None, Field(description="Vendor name", default=None)]
    # url: Annotated[str | None, Field(description="Vendor website URL", default=None)]
    # slug: Annotated[str | None, Field(description="Unique identifier slug", default=None)]
    # platform: Annotated[str | None, Field(description="E-commerce platform", default=None)]
    # description: Annotated[str | None, Field(description="Vendor description", default=None)]
    # pdp_slug: Annotated[str | None, Field(description="Product detail page slug", default=None)]
    # plp_slug: Annotated[str | None, Field(description="Product listing page slug", default=None)]


class VendorDelete(BaseModel, SoftDeletionSchema):
    """Vendor delete schema"""

    pass


class Vendor(VendorBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]


class VendorResponse(VendorBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    product_lines: Annotated[list[ProductLineResponse], Field(description="The vendor's product lines")]


class VendorFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by vendor name", default=None)]
    platform: Annotated[str | None, Field(description="Filter by platform", default=None)]
    slug: Annotated[str | None, Field(description="Filter by slug", default=None)]
