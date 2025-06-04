from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from api.schemas.pagination import PaginatedResponse, get_paginated_list

from .dependencies import provide_vendor_repository
from .models import Vendor
from .repository import VendorRepository
from .schemas import (
    Vendor as VendorSchema,
)
from .schemas import (
    VendorCreate,
    VendorUpdate,
)


router = APIRouter(
    prefix="/vendor",
    tags=["vendors"],
)


@router.post("", response_model=VendorSchema, status_code=HTTP_201_CREATED)
async def create_vendor(
    vendor_in: VendorCreate,
    repository: VendorRepository = Depends(provide_vendor_repository),
):
    """Create a new vendor"""
    vendor_data = vendor_in.model_dump(exclude_unset=True)
    vendor = Vendor(**vendor_data)
    await repository.add(vendor)
    return VendorSchema.model_validate(vendor)


@router.get("/{vendor_id}", response_model=VendorSchema, status_code=HTTP_200_OK)
async def get_vendor(vendor_id: int, repository: VendorRepository = Depends(provide_vendor_repository)):
    """Get a vendor by ID"""
    return await repository.get(
        Vendor.id == vendor_id,
    )


@router.get("", response_model=PaginatedResponse[VendorSchema], status_code=HTTP_200_OK)
async def list_vendors(
    page: int = 1,
    limit: int = 100,
    name: str | None = None,
    slug: str | None = None,
    repository: VendorRepository = Depends(provide_vendor_repository),
):
    """List vendors with filtering"""
    return get_paginated_list(
        repository=repository,
        limit=limit,
        page=page,
        name=name,
        slug=slug,
    )


@router.put("/{vendor_id}", response_model=VendorSchema, status_code=HTTP_200_OK)
async def update_vendor(
    vendor_id: int,
    vendor_in: VendorUpdate,
    repository: VendorRepository = Depends(provide_vendor_repository),
):
    """Update a vendor"""
    vendor = await repository.get_and_update(Vendor.id == vendor_id, data=vendor_in.model_dump(exclude_unset=True))
    return VendorSchema.model_validate(vendor)


@router.delete("/{vendor_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_vendor(vendor_id: int, repository: VendorRepository = Depends(provide_vendor_repository)):
    """Delete a vendor"""
    await repository.delete(Vendor.id == vendor_id)

    return None
