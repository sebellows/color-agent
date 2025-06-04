from uuid import UUID

from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .dependencies import provide_product_swatch_repository
from .models import ProductSwatch
from .repository import ProductSwatchRepository
from .schemas import (
    ProductSwatch as ProductSwatchSchema,
)
from .schemas import (
    ProductSwatchCreate,
    ProductSwatchUpdate,
)


router = APIRouter(
    prefix="/product-swatch",
    tags=["product_swatch"],
)


@router.post("", response_model=ProductSwatchSchema, status_code=HTTP_201_CREATED)
async def create_product_swatch(
    product_swatch_in: ProductSwatchCreate,
    repository: ProductSwatchRepository = Depends(provide_product_swatch_repository),
):
    """Create a new product swatch"""
    product_swatch_data = product_swatch_in.model_dump(exclude_unset=True)
    product_swatch = ProductSwatch(**product_swatch_data)

    await repository.add(product_swatch)

    return ProductSwatchSchema.model_validate(product_swatch)


@router.get("/{product_swatch_id}", response_model=ProductSwatchSchema, status_code=HTTP_200_OK)
async def get_product_swatch(
    product_swatch_id: UUID,
    repository: ProductSwatchRepository = Depends(provide_product_swatch_repository),
):
    """Get a product swatch by ID"""
    product_swatch = await repository.get(
        ProductSwatch.id == product_swatch_id,
    )
    return ProductSwatchSchema.model_validate(product_swatch)


@router.get("", response_model=list[ProductSwatchSchema], status_code=HTTP_200_OK)
async def list_product_swatches(
    product_id: UUID | None = None,
    repository: ProductSwatchRepository = Depends(provide_product_swatch_repository),
):
    """List product swatches with optional filtering by product ID"""
    filters = []
    if product_id:
        filters.append(ProductSwatch.product_id == product_id)
    product_swatches = await repository.list(
        filters=filters,
        exclude_none=True,
    )
    return [ProductSwatchSchema.model_validate(ps) for ps in product_swatches]


@router.put("/{product_swatch_id}", response_model=ProductSwatchSchema, status_code=HTTP_200_OK)
async def update_product_swatch(
    product_swatch_id: UUID,
    product_swatch_in: ProductSwatchUpdate,
    repository: ProductSwatchRepository = Depends(provide_product_swatch_repository),
):
    """Update a product swatch"""
    product_swatch, _updated = await repository.get_and_update(
        ProductSwatch.id == product_swatch_id,
        data=product_swatch_in.model_dump(exclude_unset=True),
    )
    return ProductSwatchSchema.model_validate(product_swatch)


@router.delete("/{product_swatch_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_swatch(
    product_swatch_id: UUID,
    repository: ProductSwatchRepository = Depends(provide_product_swatch_repository),
):
    """Delete a product swatch"""
    await repository.delete(ProductSwatch.id == product_swatch_id)
    return None
