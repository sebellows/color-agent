from uuid import UUID

from advanced_alchemy.filters import SearchFilter
from advanced_alchemy.service import OffsetPagination
from domain.dependencies import Services
from domain.filters import PaginatedResponse
from fastapi import APIRouter, Query
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from typing_extensions import Annotated

from .models import ProductLine
from .schemas import (
    ProductLineCreate,
    ProductLineFilters,
    ProductLineResponse,
    ProductLineUpdate,
)


product_line_router = APIRouter(tags=["Product Line"])


@product_line_router.post("/product-lines", response_model=ProductLineResponse, status_code=HTTP_201_CREATED)
async def create_product_line(
    container: Services,
    data: ProductLineCreate,
):
    """Create a new product line"""
    product_line = await container.provide_product_lines.create(data)
    return container.provide_product_lines.to_schema(product_line)


@product_line_router.get(
    "/product-lines/{product_line_id}", response_model=ProductLineResponse, status_code=HTTP_200_OK
)
async def get_product_line(
    product_line_id: UUID,
    container: Services,
):
    """Get a product line by ID"""
    product_line = await container.provide_product_lines.get(ProductLine.id == product_line_id)
    return container.provide_product_lines.to_schema(product_line)


@product_line_router.get(
    "/product-lines", response_model=OffsetPagination[ProductLineResponse], status_code=HTTP_200_OK
)
async def list_product_lines(
    filter_query: Annotated[ProductLineFilters, Query()],
    limit_offset: PaginatedResponse,
    container: Services,
):
    """List product lines with filtering"""

    filters = []
    if filter_query.name:
        filters.append(SearchFilter("name", filter_query.name, ignore_case=True))
    if filter_query.slug:
        filters.append(SearchFilter("slug", filter_query.slug, ignore_case=True))
    if filter_query.product_line_type:
        filters.append(SearchFilter("product_line_type", filter_query.product_line_type.value, ignore_case=True))
    if filter_query.vendor_id:
        filters.append(ProductLine.vendor_id == filter_query.vendor_id)

    results, total = await container.provide_product_lines.list_and_count(*filters, limit_offset)

    return container.provide_product_lines.to_schema(
        results,
        total=total,
        filters=[limit_offset],
    )


@product_line_router.put(
    "/product-lines/{product_line_id}", response_model=ProductLineResponse, status_code=HTTP_200_OK
)
async def update_product_line(
    product_line_id: UUID,
    data: ProductLineUpdate,
    container: Services,
):
    """Update a product line"""
    product_line = await container.provide_product_lines.update(data, item_id=product_line_id)
    return container.provide_product_lines.to_schema(product_line)


@product_line_router.delete("/product-lines/{product_line_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_line(
    product_line_id: UUID,
    container: Services,
):
    """Delete a product line"""
    _ = await container.provide_product_lines.delete(product_line_id)
    return None
