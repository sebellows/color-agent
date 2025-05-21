from typing import Optional, List, Annotated
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


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
    name: Annotated[Optional[str], Field(description="Vendor name")] = None
    url: Annotated[Optional[str], Field(description="Vendor website URL")] = None
    slug: Annotated[Optional[str], Field(description="Unique identifier slug")] = None
    platform: Annotated[Optional[str], Field(description="E-commerce platform")] = None
    description: Annotated[Optional[str], Field(description="Vendor description")] = (
        None
    )
    pdp_slug: Annotated[
        Optional[str], Field(description="Product detail page slug")
    ] = None
    plp_slug: Annotated[
        Optional[str], Field(description="Product listing page slug")
    ] = None


class Vendor(VendorBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
    created_at: Annotated[datetime, Field(description="Creation timestamp")]
    updated_at: Annotated[datetime, Field(description="Last update timestamp")]


class VendorFilterParams(BaseModel):
    name: Annotated[Optional[str], Field(description="Filter by vendor name")] = None
    platform: Annotated[Optional[str], Field(description="Filter by platform")] = None
    slug: Annotated[Optional[str], Field(description="Filter by slug")] = None
