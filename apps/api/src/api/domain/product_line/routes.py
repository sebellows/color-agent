from uuid import UUID

from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from api.schemas.pagination import PaginatedResponse, get_paginated_list
from .dependencies import provide_product_line_repository
from .models import ProductLine
from .repository import ProductLineRepository
from .schemas import (
    ProductLine as ProductLineSchema,
)
from .schemas import (
    ProductLineCreate,
    ProductLineUpdate,
)


router = APIRouter(
    prefix="/product-lines",
    tags=["product_lines"],
)


@router.post("", response_model=ProductLineSchema, status_code=HTTP_201_CREATED)
async def create_product_line(
    product_line_in: ProductLineCreate,
    repository: ProductLineRepository = Depends(provide_product_line_repository),
):
    """Create a new product line"""
    product_line_data = product_line_in.model_dump(exclude_unset=True)
    product_line = ProductLine(**product_line_data)
    await repository.add(product_line)
    return ProductLineSchema.model_validate(product_line)


@router.get("/{product_line_id}", response_model=ProductLineSchema, status_code=HTTP_200_OK)
async def get_product_line(
    product_line_id: UUID,
    repository: ProductLineRepository = Depends(provide_product_line_repository),
):
    """Get a product line by ID"""
    product_line = await repository.get(ProductLine.id == product_line_id)
    return ProductLineSchema.model_validate(product_line)


@router.get("", response_model=PaginatedResponse[ProductLineSchema], status_code=HTTP_200_OK)
async def list_product_lines(
    page: int = 1,
    limit: int = 100,
    name: str | None = None,
    product_line_type: str | None = None,
    vendor_id: UUID | None = None,
    repository: ProductLineRepository = Depends(provide_product_line_repository),
):
    """List product lines with filtering"""
    return await get_paginated_list(
        repository=repository,
        page=page,
        limit=limit,
        name=name,
        product_line_type=product_line_type,
        vendor_id=vendor_id,
    )


@router.put("/{product_line_id}", response_model=ProductLineSchema, status_code=HTTP_200_OK)
async def update_product_line(
    product_line_id: UUID,
    product_line_in: ProductLineUpdate,
    repository: ProductLineRepository = Depends(provide_product_line_repository),
):
    """Update a product line"""
    product_line, _updated = await repository.get_and_update(
        ProductLine.id == product_line_id,
        data=product_line_in.model_dump(exclude_unset=True),
    )
    return ProductLineSchema.model_validate(product_line)


@router.delete("/{product_line_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_line(
    product_line_id: UUID,
    repository: ProductLineRepository = Depends(provide_product_line_repository),
):
    """Delete a product line"""
    await repository.delete(ProductLine.id == product_line_id)
    return None
