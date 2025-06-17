from uuid import UUID

from advanced_alchemy.filters import SearchFilter
from advanced_alchemy.service import OffsetPagination
from advanced_alchemy.utils.text import slugify
from domain.dependencies import Services
from domain.filters import PaginatedResponse
from domain.helpers import as_dict
from fastapi import APIRouter, HTTPException, Query
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from typing_extensions import Annotated

from .models import Product
from .schemas import (
    ProductCreate,
    ProductFilters,
    ProductResponse,
    ProductUpdate,
)


# if TYPE_CHECKING:
#     from domain.tag.models import Tag


product_router = APIRouter(tags=["Product"])


@product_router.post("/products", response_model=ProductResponse, status_code=HTTP_201_CREATED)
async def create_product(
    container: Services,
    data: ProductCreate,
):
    """Create a new product"""
    # Create product without relationships
    model = as_dict(data)
    product = await container.provide_products.to_model(model)

    tags: list[str] = []
    analogous_tags: list[str] = []

    if isinstance(data, dict):
        tags = data.pop("tags", [])
        analogous_tags = data.pop("analogous", [])

    # Add relationships
    if swatch := model.get("swatch", None) is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Swatch is required to create a product.",
        )
    if len(variants := model.get("variants", [])) == 0:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Variants are required to create a product.",
        )

    if tags:
        product_tags = []
        for tag in tags:
            tag_model = await container.provide_tags.get_or_upsert(name=tag, slug=slugify(tag))
            product_tags.append(tag_model)
        product.tags.extend(product_tags)

    if analogous_tags:
        product_analogous_tags = []
        for tag in product_analogous_tags:
            tag_model = await container.provide_analogous.get_or_upsert(name=tag, slug=slugify(tag))
            product_analogous_tags.append(tag_model)

        product.analogous.extend(product_analogous_tags)

    swatch = as_dict(swatch)

    product = await container.provide_products.create_product(model)
    swatch["product_id"] = product.id
    product.swatch = await container.provide_product_swatches.create(swatch)

    for variant in variants:
        variant["product_id"] = product.id
        variant["locale_id"] = container.provide_locales.current_locale.id

    product_variants = await container.provide_product_variants.create_many(variants, auto_commit=True)
    product.variants.extend(product_variants)

    product = await container.provide_products.repository.create(product, auto_commit=True)

    return container.provide_products.to_schema(product)


@product_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID, container: Services):
    """Get a product by ID"""
    product = await container.provide_products.get(product_id)
    return container.provide_products.to_schema(product)


@product_router.get("/products", response_model=OffsetPagination[ProductResponse])
async def list_products(
    container: Services,
    filter_query: Annotated[ProductFilters, Query()],
    limit_offset: PaginatedResponse,
):
    """List products with filtering"""

    filters = []
    if filter_query.id:
        filters.append(Product.id == filter_query.id)
    if filter_query.name:
        filters.append(SearchFilter("name", filter_query.name, ignore_case=True))
    if filter_query.slug:
        filters.append(SearchFilter("slug", filter_query.slug, ignore_case=True))
    if filter_query.iscc_nbs_category:
        filters.append(SearchFilter("iscc_nbs_category", filter_query.iscc_nbs_category, ignore_case=True))
    if filter_query.color_range:
        filters.append(SearchFilter("color_range", filter_query.color_range.value, ignore_case=True))
    if filter_query.product_type:
        filters.append(SearchFilter("product_type", filter_query.product_type.value, ignore_case=True))
    if filter_query.tag:
        filters.append(Product.tags.any(name=filter_query.tag))
    if filter_query.analogous:
        filters.append(Product.analogous.any(name=filter_query.analogous))

    results, total = await container.provide_products.list_and_count(
        *filters,
        limit_offset=limit_offset,
        order_by=Product.name.asc(),
    )
    return container.provide_products.to_schema(results, total, filters=[limit_offset])


@product_router.patch("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    container: Services,
    product_id: UUID,
    product_in: ProductUpdate,
):
    """Update a product"""

    # Update product without relationships
    try:
        product, updated = await container.provide_products.get_and_update(
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

    return container.provide_products.to_schema(product)


@product_router.delete("/products/{product_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product(product_id: UUID, container: Services):
    """Delete a product"""
    _ = await container.provide_products.delete(Product.id == product_id)

    return None
