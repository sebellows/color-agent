from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND

from api.domain.locale import Locales
from api.domain.product_swatch import ProductSwatches
from api.domain.product_variant import ProductVariants
from api.schemas.pagination import PaginatedResponse, get_paginated_list

from .models import Product
from .schemas import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from .service import Products


router = APIRouter(
    prefix="/products",
    tags=["products"],
)


@router.post("", response_model=ProductResponse, status_code=HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    products_service: Products,
    swatch_service: ProductSwatches,
    variant_service: ProductVariants,
    locale_service: Locales,
):
    """Create a new product"""
    # Extract relationship IDs
    swatch = product_in.swatch
    variants = product_in.variants or []

    # # Create product without relationships
    new_product = Product(**product_in.model_dump(exclude_unset=True))
    product = await products_service.create_product(new_product)

    # Add relationships
    if swatch:
        if isinstance(swatch, dict):
            swatch["product_id"] = product.id

        swatch = await swatch_service.create(swatch)
        product.swatch = swatch

    if variants:
        for variant in variants:
            if isinstance(variant, dict):
                variant["product_id"] = product.id
                variant["locale_id"] = locale_service.current_locale.id

        new_variants = await variant_service.create_many(variants, auto_commit=True)
        product.variants.extend(new_variants)

    return ProductResponse.model_validate(product)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, service: Products):
    """Get a product by ID"""
    product = await service.get(Product.id == product_id)
    return ProductResponse.model_validate(product)


@router.get("", response_model=PaginatedResponse[ProductResponse])
async def list_products(
    service: Products,
    page: int = 1,
    limit: int = 100,
    name: str | None = None,
    product_line_id: int | None = None,
    product_type_id: int | None = None,
    color_range_id: int | None = None,
    tag_id: int | None = None,
    analogous_id: int | None = None,
    iscc_nbs_category: str | None = None,
):
    """List products with filtering"""
    filters = []
    if name:
        filters.append(Product.name.ilike(f"%{name}%"))
    if product_line_id:
        filters.append(Product.product_line_id == product_line_id)
    if product_type_id:
        filters.append(Product.product_type.any(id=product_type_id))
    if color_range_id:
        filters.append(Product.color_range.any(id=color_range_id))
    if tag_id:
        filters.append(Product.tags.any(id=tag_id))
    if analogous_id:
        filters.append(Product.analogous.any(id=analogous_id))
    if iscc_nbs_category:
        filters.append(Product.iscc_nbs_category == iscc_nbs_category)

    return await get_paginated_list(
        *filters,
        service=service,
        page=page,
        limit=limit,
    )


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_in: ProductUpdate,
    service: Products,
):
    """Update a product"""

    # Update product without relationships
    try:
        product, updated = await service.get_and_update(
            Product.id == product_id,
            data=product_in.model_dump(exclude_unset=True),
        )
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found: {str(e)}",
        )

    if not updated:
        print(f"Product with ID {product_id} was either not found or not updated.")

    return ProductResponse.model_validate(product)


@router.delete("/{product_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, service: Products):
    """Delete a product"""
    await service.delete(Product.id == product_id)

    return None
