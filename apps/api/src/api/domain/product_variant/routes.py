from uuid import UUID

from fastapi import APIRouter
from starlette.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
)

from .models import ProductVariant
from .schemas import (
    ProductVariantCreate,
    ProductVariantResponse,
    ProductVariantUpdate,
)
from .service import ProductVariants


router = APIRouter(prefix="/product-variants", tags=["product_variants"])


def _set_or_update_vendor_categories(
    product_variant: ProductVariant,
    vendor_color_range: list[str] = [],
    vendor_product_type: list[str] = [],
):
    """Helper function to update vendor categories"""
    if isinstance(vendor_color_range, list) and len(vendor_color_range) > 0:
        for color_range in vendor_color_range:
            if color_range not in product_variant.vendor_color_range:
                product_variant.vendor_color_range.append(color_range)

    if isinstance(vendor_product_type, list) and len(vendor_product_type) > 0:
        for product_type in vendor_product_type:
            if product_type not in product_variant.vendor_product_type:
                product_variant.vendor_product_type.append(product_type)


@router.post("", response_model=ProductVariantResponse, status_code=HTTP_201_CREATED)
async def create_product_variant(
    product_variant_in: ProductVariantCreate,
    service: ProductVariants,
):
    """Create a new product variant"""
    product_variant_data = product_variant_in.model_dump(exclude_unset=True)
    product_variant = ProductVariant(**product_variant_data)

    # Set or update vendor categories
    _set_or_update_vendor_categories(
        product_variant,
        vendor_color_range=product_variant_in.vendor_color_range,
        vendor_product_type=product_variant_in.vendor_product_type,
    )

    await service.create(product_variant)
    return ProductVariantResponse.model_validate(product_variant)


@router.get(
    "/{product_variant_id}",
    response_model=ProductVariantResponse,
    status_code=HTTP_200_OK,
)
async def get_product_variant(
    product_variant_id: UUID,
    service: ProductVariants,
):
    """Get a product variant by ID"""
    product_variant = await service.get(
        ProductVariant.id == product_variant_id,
    )
    return ProductVariantResponse.model_validate(product_variant)


@router.put(
    "/{product_variant_id}",
    response_model=ProductVariantResponse,
    status_code=HTTP_200_OK,
)
async def update_product_variant(
    product_variant_id: UUID,
    product_variant_in: ProductVariantUpdate,
    service: ProductVariants,
):
    """Update a product variant"""
    product_variant = await service.get_and_update(
        ProductVariant.id == product_variant_id,
        data=product_variant_in.model_dump(exclude_unset=True),
    )

    return ProductVariantResponse.model_validate(product_variant)


@router.delete("/{product_variant_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_variant(
    product_variant_id: UUID,
    service: ProductVariants,
):
    """Delete a product variant"""
    await service.delete(ProductVariant.id == product_variant_id)

    return None
