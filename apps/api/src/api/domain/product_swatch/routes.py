from uuid import UUID

from fastapi import APIRouter
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .models import ProductSwatch
from .schemas import (
    ProductSwatchCreate,
    ProductSwatchResponse,
    ProductSwatchUpdate,
)
from .service import ProductSwatches


router = APIRouter(
    prefix="/product-swatch",
    tags=["product_swatch"],
)


@router.post("", response_model=ProductSwatchResponse, status_code=HTTP_201_CREATED)
async def create_product_swatch(
    product_swatch_in: ProductSwatchCreate,
    service: ProductSwatches,
):
    """Create a new product swatch"""
    product_swatch_data = product_swatch_in.model_dump(exclude_unset=True)
    product_swatch = ProductSwatch(**product_swatch_data)

    await service.create(product_swatch)

    return ProductSwatchResponse.model_validate(product_swatch)


@router.get("/{product_swatch_id}", response_model=ProductSwatchResponse, status_code=HTTP_200_OK)
async def get_product_swatch(
    product_swatch_id: UUID,
    service: ProductSwatches,
):
    """Get a product swatch by ID"""
    product_swatch = await service.get_one(
        ProductSwatch.id == product_swatch_id,
    )
    return ProductSwatchResponse.model_validate(product_swatch)


@router.get("", response_model=list[ProductSwatchResponse], status_code=HTTP_200_OK)
async def list_product_swatches(
    product_id: UUID,
    service: ProductSwatches,
):
    """List product swatches with optional filtering by product ID"""
    filters = []
    if product_id:
        filters.append(ProductSwatch.product_id == product_id)
    product_swatches = await service.list(
        filters=filters,
        exclude_none=True,
    )

    return [ProductSwatchResponse.model_validate(ps) for ps in product_swatches]


@router.put("/{product_swatch_id}", response_model=ProductSwatchResponse, status_code=HTTP_200_OK)
async def update_product_swatch(
    product_swatch_id: UUID,
    product_swatch_in: ProductSwatchUpdate,
    service: ProductSwatches,
):
    """Update a product swatch"""
    product_swatch, _updated = await service.get_and_update(
        ProductSwatch.id == product_swatch_id,
        data=product_swatch_in.model_dump(exclude_unset=True),
    )
    return ProductSwatchResponse.model_validate(product_swatch)


@router.delete("/{product_swatch_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_swatch(
    product_swatch_id: UUID,
    service: ProductSwatches,
):
    """Delete a product swatch"""
    await service.delete(ProductSwatch.id == product_swatch_id)
    return None
