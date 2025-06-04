from uuid import UUID
from fastapi import APIRouter, Depends
from starlette.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
)

from .dependencies import provide_product_variant_repository
from .models import ProductVariant
from .repository import ProductVariantRepository
from .schemas import (
    ProductVariant as ProductVariantSchema,
    ProductVariantCreate,
    ProductVariantUpdate,
)

router = APIRouter(prefix="/product-variants", tags=["product_variants"])


def _set_or_update_vendor_categories(
    product_variant: ProductVariant,
    vendor_color_ranges: list[str] = [],
    vendor_product_types: list[str] = [],
):
    """Helper function to update vendor categories"""
    if isinstance(vendor_color_ranges, list) and len(vendor_color_ranges) > 0:
        for color_range in vendor_color_ranges:
            if color_range not in product_variant.vendor_color_ranges:
                product_variant.vendor_color_ranges.append(color_range)

    if isinstance(vendor_product_types, list) and len(vendor_product_types) > 0:
        for product_type in vendor_product_types:
            if product_type not in product_variant.vendor_product_types:
                product_variant.vendor_product_types.append(product_type)


@router.post("", response_model=ProductVariantSchema, status_code=HTTP_201_CREATED)
async def create_product_variant(
    product_variant_in: ProductVariantCreate,
    repository: ProductVariantRepository = Depends(provide_product_variant_repository),
):
    """Create a new product variant"""
    product_variant_data = product_variant_in.model_dump(exclude_unset=True)
    product_variant = ProductVariant(**product_variant_data)

    # Set or update vendor categories
    _set_or_update_vendor_categories(
        product_variant,
        vendor_color_ranges=product_variant_in.vendor_color_ranges,
        vendor_product_types=product_variant_in.vendor_product_types,
    )

    await repository.add(product_variant)
    return ProductVariantSchema.model_validate(product_variant)


@router.get(
    "/{product_variant_id}",
    response_model=ProductVariantSchema,
    status_code=HTTP_200_OK,
)
async def get_product_variant(
    product_variant_id: UUID,
    repository: ProductVariantRepository = Depends(provide_product_variant_repository),
):
    """Get a product variant by ID"""
    product_variant = await repository.get(
        ProductVariant.id == product_variant_id,
    )
    return ProductVariantSchema.model_validate(product_variant)


@router.put(
    "/{product_variant_id}",
    response_model=ProductVariantSchema,
    status_code=HTTP_200_OK,
)
async def update_product_variant(
    product_variant_id: UUID,
    product_variant_in: ProductVariantUpdate,
    repository: ProductVariantRepository = Depends(provide_product_variant_repository),
):
    """Update a product variant"""
    product_variant = await repository.get_and_update(
        ProductVariant.id == product_variant_id,
        data=product_variant_in.model_dump(exclude_unset=True),
    )

    return ProductVariantSchema.model_validate(product_variant)


@router.delete("/{product_variant_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_variant(
    product_variant_id: UUID,
    repository: ProductVariantRepository = Depends(provide_product_variant_repository),
):
    """Delete a product variant"""
    await repository.delete(ProductVariant.id == product_variant_id)

    return None
