from typing import TYPE_CHECKING
from uuid import UUID

from advanced_alchemy.filters import SearchFilter
from advanced_alchemy.service import OffsetPagination
from domain.dependencies import Services
from domain.filters import PaginatedResponse
from fastapi import APIRouter, Query
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from typing_extensions import Annotated

from .models import Vendor
from .schemas import VendorCreate, VendorFilters, VendorResponse, VendorUpdate


# from .service import Vendors


if TYPE_CHECKING:
    pass

vendor_router = APIRouter(tags=["Vendor"])


@vendor_router.post("/vendor", response_model=VendorResponse, status_code=HTTP_201_CREATED)
async def create_vendor(
    data: VendorCreate,
    container: Services,
):
    """Create a new vendor"""
    vendor = await container.provide_vendors.create(data)
    return container.provide_vendors.to_schema(vendor)


@vendor_router.get("/vendor/{vendor_id}", response_model=VendorResponse, status_code=HTTP_200_OK)
async def get_vendor(vendor_id: UUID, container: Services):
    """Get a vendor by ID"""
    vendor = await container.provide_vendors.get(vendor_id)
    return container.provide_vendors.to_schema(vendor)


@vendor_router.get("/vendor", response_model=OffsetPagination[VendorResponse], status_code=HTTP_200_OK)
async def list_vendors(
    filter_query: Annotated[VendorFilters, Query()],
    limit_offset: PaginatedResponse,
    container: Services,
):
    """List vendors with filtering"""
    filters = []
    if filter_query.name:
        filters.append(SearchFilter("name", filter_query.name, ignore_case=True))
    if filter_query.slug:
        filters.append(SearchFilter("slug", filter_query.slug, ignore_case=True))
    if filter_query.platform:
        filters.append(SearchFilter("platform", filter_query.platform, ignore_case=True))

    results, total = await container.provide_vendors.list_and_count(*filters, limit_offset)

    return container.provide_vendors.to_schema(
        results,
        total=total,
        filters=[limit_offset],
    )


@vendor_router.patch("/vendor/{vendor_id}", response_model=VendorResponse, status_code=HTTP_200_OK)
async def update_vendor(
    container: Services,
    data: VendorUpdate,
    vendor_id: UUID,
):
    """Update a vendor"""
    vendor = await container.provide_vendors.update(data, item_id=vendor_id)
    return container.provide_vendors.to_schema(vendor)


@vendor_router.delete("/vendor/{vendor_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_vendor(vendor_id: UUID, container: Services):
    """Delete a vendor"""
    _ = await container.provide_vendors.delete(Vendor.id == vendor_id)
    return None
