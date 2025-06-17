from uuid import UUID

from domain.dependencies import Services
from domain.helpers import as_dict
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


product_variant_router = APIRouter(tags=["Product Variant"])


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


@product_variant_router.post("/product-variants", response_model=ProductVariantResponse, status_code=HTTP_201_CREATED)
async def create_product_variant(
    container: Services,
    data: ProductVariantCreate,
):
    """Create a new product variant"""
    product_variant_data = as_dict(data)
    model = await container.provide_product_variants.to_model(data)

    # Set or update vendor categories
    _set_or_update_vendor_categories(
        model,
        vendor_color_range=product_variant_data["vendor_color_range"],
        vendor_product_type=product_variant_data["vendor_product_type"],
    )

    product_variant = await container.provide_product_variants.create(model)
    return container.provide_product_variants.to_schema(product_variant)


@product_variant_router.get(
    "/product-variants/{product_variant_id}",
    response_model=ProductVariantResponse,
    status_code=HTTP_200_OK,
)
async def get_product_variant(
    product_variant_id: UUID,
    container: Services,
):
    """Get a product variant by ID"""
    product_variant = await container.provide_product_variants.get(product_variant_id)
    return container.provide_product_variants.to_schema(product_variant)


@product_variant_router.get(
    "/product-variants",
    response_model=list[ProductVariantResponse],
    status_code=HTTP_200_OK,
)
async def list_product_variants(
    product_id: UUID,
    container: Services,
):
    """Get all product variants for a given product by Product ID"""
    product_variants = await container.provide_product_variants.list(ProductVariant.product_id == product_id)
    return container.provide_product_variants.to_schema(product_variants)


@product_variant_router.patch(
    "/product-variants/{product_variant_id}",
    response_model=ProductVariantResponse,
    status_code=HTTP_200_OK,
)
async def update_product_variant(
    product_variant_id: UUID,
    data: ProductVariantUpdate,
    container: Services,
):
    """Update a product variant"""
    product_variant = await container.provide_product_variants.update(
        data,
        item_id=product_variant_id,
    )
    return container.provide_product_variants.to_schema(product_variant)


@product_variant_router.delete("/product-variants/{product_variant_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_variant(
    product_variant_id: UUID,
    container: Services,
):
    """Delete a product variant"""
    _ = await container.provide_product_variants.delete(ProductVariant.id == product_variant_id)
    return None
