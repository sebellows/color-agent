from typing import Annotated
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

from .mixins import (
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


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    name: Annotated[str | None, Field(description="Vendor name")] = None
    url: Annotated[str | None, Field(description="Vendor website URL")] = None
    slug: Annotated[str | None, Field(description="Unique identifier slug")] = None
    platform: Annotated[str | None, Field(description="E-commerce platform")] = None
    description: Annotated[str | None, Field(description="Vendor description")] = None
    pdp_slug: Annotated[str | None, Field(description="Product detail page slug")] = (
        None
    )
    plp_slug: Annotated[str | None, Field(description="Product listing page slug")] = (
        None
    )


class VendorDelete(BaseModel, SoftDeletionSchema):
    """Vendor delete schema"""

    pass


class Vendor(VendorBase, TimestampSchema, SoftDeletionSchema):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]


class VendorFilterParams(BaseModel):
    name: Annotated[str | None, Field(description="Filter by vendor name")] = None
    platform: Annotated[str | None, Field(description="Filter by platform")] = None
    slug: Annotated[str | None, Field(description="Filter by slug")] = None
