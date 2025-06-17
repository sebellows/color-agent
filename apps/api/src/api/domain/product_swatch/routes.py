from uuid import UUID

from domain.dependencies import Services
from fastapi import APIRouter
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .models import ProductSwatch
from .schemas import (
    ProductSwatchCreate,
    ProductSwatchResponse,
    ProductSwatchUpdate,
)


product_swatch_router = APIRouter(tags=["Product Swatch"])


@product_swatch_router.post("/product-swatch", response_model=ProductSwatchResponse, status_code=HTTP_201_CREATED)
async def create_product_swatch(
    data: ProductSwatchCreate,
    container: Services,
):
    """Create a new product swatch"""
    product_swatch = await container.provide_product_swatches.create(data)
    return container.provide_product_swatches.to_schema(product_swatch)


@product_swatch_router.get(
    "/product-swatch/{product_swatch_id}", response_model=ProductSwatchResponse, status_code=HTTP_200_OK
)
async def get_product_swatch(
    product_swatch_id: UUID,
    container: Services,
):
    """Get a product swatch by ID"""
    product_swatch = await container.provide_product_swatches.get(product_swatch_id)
    return container.provide_product_swatches.to_schema(product_swatch)


@product_swatch_router.get("/product-swatch", response_model=ProductSwatchResponse, status_code=HTTP_200_OK)
async def get_product_swatch_by_product_id(
    product_id: UUID,
    container: Services,
):
    """List product swatches with optional filtering by product ID"""
    product_swatch = await container.provide_product_swatches.get(ProductSwatch.product_id == product_id)

    return container.provide_product_swatches.to_schema(product_swatch)


@product_swatch_router.patch(
    "/product-swatch/{product_swatch_id}", response_model=ProductSwatchResponse, status_code=HTTP_200_OK
)
async def update_product_swatch(
    product_swatch_id: UUID,
    data: ProductSwatchUpdate,
    container: Services,
):
    """Update a product swatch"""
    product_swatch = await container.provide_product_swatches.update(data, item_id=product_swatch_id)
    return container.provide_product_swatches.to_schema(product_swatch)


@product_swatch_router.delete("/product-swatch/{product_swatch_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_swatch(
    product_swatch_id: UUID,
    container: Services,
):
    """Delete a product swatch"""
    _ = await container.provide_product_swatches.delete(product_swatch_id)
    return None
