from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND

from api.schemas.pagination import PaginatedResponse, get_paginated_list

from .dependencies import provide_product_repository
from .models import Product
from .repository import ProductRepository
from .schemas import (
    Product as ProductSchema,
)
from .schemas import (
    ProductCreate,
    ProductUpdate,
)


router = APIRouter(
    prefix="/products",
    tags=["products"],
)


@router.post("", response_model=ProductSchema, status_code=HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    repository: ProductRepository = Depends(provide_product_repository),
):
    """Create a new product"""
    # Extract relationship IDs
    product_types = product_in.product_type or []
    color_ranges = product_in.color_range or []
    tags = product_in.tags or []
    analogous = product_in.analogous or []

    # # Create product without relationships
    new_product = Product(**product_in.model_dump(exclude_unset=True))
    product = await repository.add(new_product)

    # Add relationships
    if product_types:
        await repository.session.execute(
            text("""
            INSERT INTO product_product_type_association (product_id, product_type_id)
            SELECT :product_id, pt.id FROM product_type pt
            WHERE pt.id IN :product_type_ids
            """),
            {"product_id": product.id, "product_type_ids": tuple(product_types)},
        )

    if color_ranges:
        await repository.session.execute(
            text("""
            INSERT INTO product_color_range_association (product_id, color_range_id)
            SELECT :product_id, cr.id FROM color_range cr
            WHERE cr.id IN :color_range_ids
            """),
            {"product_id": product.id, "color_range_ids": tuple(color_ranges)},
        )

    if tags:
        await repository.session.execute(
            text("""
            INSERT INTO product_tag_association (product_id, tag_id)
            SELECT :product_id, t.id FROM tag t
            WHERE t.id IN :tag_ids
            """),
            {"product_id": product.id, "tag_ids": tuple(tags)},
        )

    if analogous:
        await repository.session.execute(
            text("""
            INSERT INTO product_analogous_association (product_id, analogous_id)
            SELECT :product_id, a.id FROM analogous a
            WHERE a.id IN :analogous_ids
            """),
            {"product_id": product.id, "analogous_ids": tuple(analogous)},
        )

    return ProductSchema.model_validate(product)


@router.get("/{product_id}", response_model=ProductSchema)
async def get_product(product_id: int, repository: ProductRepository = Depends(provide_product_repository)):
    """Get a product by ID"""
    product = await repository.get(Product.id == product_id)
    return ProductSchema.model_validate(product)


@router.get("", response_model=PaginatedResponse[ProductSchema])
async def list_products(
    page: int = 1,
    limit: int = 100,
    name: str | None = None,
    product_line_id: int | None = None,
    product_type_id: int | None = None,
    color_range_id: int | None = None,
    tag_id: int | None = None,
    analogous_id: int | None = None,
    iscc_nbs_category: str | None = None,
    repository: ProductRepository = Depends(provide_product_repository),
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
        repository=repository,
        page=page,
        limit=limit,
    )


@router.put("/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: int,
    product_in: ProductUpdate,
    repository: ProductRepository = Depends(provide_product_repository),
):
    """Update a product"""

    # # Extract relationship IDs
    product_types = product_in.product_type
    color_ranges = product_in.color_range
    tags = product_in.tags
    analogous = product_in.analogous

    # # Update product without relationships
    try:
        product, updated = await repository.get_and_update(
            Product.id == product_id,
            data=product_in.model_dump(exclude_unset=True),
        )
    except Exception as e:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found: {str(e)}",
        )
    # update_data = product_in.model_dump(
    #     exclude={"product_types", "color_ranges", "tags", "analogous"},
    #     exclude_unset=True,
    # )
    # for key, value in update_data.items():
    #     setattr(product, key, value)

    # # Update relationships if provided
    if product_types:
        # Clear existing relationships
        await repository.session.execute(
            text("DELETE FROM product_product_type_association WHERE product_id = :product_id"),
            {"product_id": product.id},
        )

        # Add new relationships
        await repository.session.execute(
            text("""
            INSERT INTO product_product_type_association (product_id, product_type_id)
            SELECT :product_id, pt.id FROM product_type pt
            WHERE pt.id IN :product_type_ids
            """),
            {"product_id": product.id, "product_type_ids": tuple(product_types)},
        )

    if color_ranges:
        # Clear existing relationships
        await repository.session.execute(
            text("DELETE FROM product_color_range_association WHERE product_id = :product_id"),
            {"product_id": product.id},
        )

        # Add new relationships
        await repository.session.execute(
            text("""
            INSERT INTO product_color_range_association (product_id, color_range_id)
            SELECT :product_id, cr.id FROM color_range cr
            WHERE cr.id IN :color_range_ids
            """),
            {"product_id": product.id, "color_range_ids": tuple(color_ranges)},
        )

    if tags:
        # Clear existing relationships
        await repository.session.execute(
            text("DELETE FROM product_tag_association WHERE product_id = :product_id"),
            {"product_id": product.id},
        )

        # Add new relationships
        await repository.session.execute(
            text("""
            INSERT INTO product_tag_association (product_id, tag_id)
            SELECT :product_id, t.id FROM tag t
            WHERE t.id IN :tag_ids
            """),
            {"product_id": product.id, "tag_ids": tuple(tags)},
        )

    if analogous:
        # Clear existing relationships
        await repository.session.execute(
            text("DELETE FROM product_analogous_association WHERE product_id = :product_id"),
            {"product_id": product.id},
        )

        # Add new relationships
        await repository.session.execute(
            text("""
            INSERT INTO product_analogous_association (product_id, analogous_id)
            SELECT :product_id, a.id FROM analogous a
            WHERE a.id IN :analogous_ids
            """),
            {"product_id": product.id, "analogous_ids": tuple(analogous)},
        )

    if not updated:
        return ProductSchema.model_validate(product)

    return ProductSchema.model_validate(product)


@router.delete("/{product_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, repository: ProductRepository = Depends(provide_product_repository)):
    """Delete a product"""
    await repository.delete(
        Product.id == product_id,
    )

    return None
