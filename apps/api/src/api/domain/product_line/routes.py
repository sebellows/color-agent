from uuid import UUID

from fastapi import APIRouter
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from api.schemas.pagination import PaginatedResponse, get_paginated_list

from .models import ProductLine
from .schemas import (
    ProductLineCreate,
    ProductLineResponse,
    ProductLineUpdate,
)
from .service import ProductLines


router = APIRouter(
    prefix="/product-lines",
    tags=["product_lines"],
)


@router.post("", response_model=ProductLineResponse, status_code=HTTP_201_CREATED)
async def create_product_line(
    product_line_in: ProductLineCreate,
    service: ProductLines,
):
    """Create a new product line"""
    product_line_data = product_line_in.model_dump(exclude_unset=True)
    product_line = ProductLine(**product_line_data)
    await service.create(product_line)
    return ProductLineResponse.model_validate(product_line)


@router.get("/{product_line_id}", response_model=ProductLineResponse, status_code=HTTP_200_OK)
async def get_product_line(
    product_line_id: UUID,
    service: ProductLines,
):
    """Get a product line by ID"""
    product_line = await service.get(ProductLine.id == product_line_id)
    return ProductLineResponse.model_validate(product_line)


@router.get("", response_model=PaginatedResponse[ProductLineResponse], status_code=HTTP_200_OK)
async def list_product_lines(
    service: ProductLines,
    page: int = 1,
    limit: int = 100,
    name: str | None = None,
    product_line_type: str | None = None,
    vendor_id: UUID | None = None,
):
    """List product lines with filtering"""
    return await get_paginated_list(
        service=service,
        page=page,
        limit=limit,
        name=name,
        product_line_type=product_line_type,
        vendor_id=vendor_id,
    )


@router.put("/{product_line_id}", response_model=ProductLineResponse, status_code=HTTP_200_OK)
async def update_product_line(
    product_line_id: UUID,
    product_line_in: ProductLineUpdate,
    service: ProductLines,
):
    """Update a product line"""
    product_line, _updated = await service.get_and_update(
        ProductLine.id == product_line_id,
        data=product_line_in.model_dump(exclude_unset=True),
    )
    return ProductLineResponse.model_validate(product_line)


@router.delete("/{product_line_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_line(
    product_line_id: UUID,
    service: ProductLines,
):
    """Delete a product line"""
    await service.delete(ProductLine.id == product_line_id)
    return None
