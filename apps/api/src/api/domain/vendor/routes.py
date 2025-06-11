from fastapi import APIRouter
from schemas.pagination import PaginatedResponse, get_paginated_list
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .models import Vendor
from .schemas import (
    VendorCreate,
    VendorResponse,
    VendorUpdate,
)
from .service import Vendors


router = APIRouter(
    prefix="/vendor",
    tags=["vendors"],
)


@router.post("", response_model=VendorResponse, status_code=HTTP_201_CREATED)
async def create_vendor(
    vendor_in: VendorCreate,
    service: Vendors,
):
    """Create a new vendor"""
    vendor_data = vendor_in.model_dump(exclude_unset=True)
    vendor = Vendor(**vendor_data)
    await service.create(vendor)
    return VendorResponse.model_validate(vendor)


@router.get("/{vendor_id}", response_model=VendorResponse, status_code=HTTP_200_OK)
async def get_vendor(vendor_id: int, service: Vendors):
    """Get a vendor by ID"""
    return await service.get(
        Vendor.id == vendor_id,
    )


@router.get("", response_model=PaginatedResponse[VendorResponse], status_code=HTTP_200_OK)
async def list_vendors(
    service: Vendors,
    page: int = 1,
    limit: int = 100,
    name: str | None = None,
    slug: str | None = None,
):
    """List vendors with filtering"""
    return get_paginated_list(
        service=service,
        limit=limit,
        page=page,
        name=name,
        slug=slug,
    )


@router.put("/{vendor_id}", response_model=VendorResponse, status_code=HTTP_200_OK)
async def update_vendor(
    vendor_id: int,
    vendor_in: VendorUpdate,
    service: Vendors,
):
    """Update a vendor"""
    vendor = await service.get_and_update(Vendor.id == vendor_id, data=vendor_in.model_dump(exclude_unset=True))
    return VendorResponse.model_validate(vendor)


@router.delete("/{vendor_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_vendor(vendor_id: int, service: Vendors):
    """Delete a vendor"""
    await service.delete(Vendor.id == vendor_id)

    return None
