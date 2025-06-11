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
    platform: Annotated[str, Field(description="E-commerce platform")]
    description: Annotated[str, Field(description="Vendor description")]
    pdp_slug: Annotated[str, Field(description="Product detail page slug")]
    plp_slug: Annotated[str, Field(description="Product listing page slug")]

    class Config:
        from_attributes = True


class VendorCreate(VendorBase):
    slug: Annotated[str, Field(description="Unique identifier slug", examples=["army_painter", "monument_hobbies"])]


class VendorUpdate(VendorBase):
    """Vendor update schema"""

    pass


class VendorDelete(BaseModel, SoftDeletionSchema):
    """Vendor delete schema"""

    pass


class VendorRead(VendorBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique identifier slug", examples=["army_painter", "monument_hobbies"])]


class VendorResponse(VendorBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    product_lines: Annotated[list[ProductLineResponse], Field(description="The vendor's product lines")]
    slug: Annotated[str, Field(description="Unique identifier slug", examples=["army_painter", "monument_hobbies"])]


class VendorFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by vendor name", default=None)]
    platform: Annotated[str | None, Field(description="Filter by platform", default=None)]
    slug: Annotated[
        str, Field(description="Unique identifier slug", examples=["army_painter", "monument_hobbies"], default=None)
    ]
