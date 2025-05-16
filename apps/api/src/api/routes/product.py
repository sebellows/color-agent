from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from ...core.database import get_db
from ...models import Product
from ...schemas import (
    Product as ProductSchema,
    ProductCreate,
    ProductUpdate,
    ProductFilterParams,
    PageResponse,
)

router = APIRouter()


@router.post("/", response_model=ProductSchema, status_code=status.HTTP_201_CREATED)
async def create_product(product_in: ProductCreate, db: AsyncSession = Depends(get_db)):
    """Create a new product"""
    # Extract relationship IDs
    product_types = product_in.product_types or []
    color_ranges = product_in.color_ranges or []
    tags = product_in.tags or []
    analogous = product_in.analogous or []

    # Create product without relationships
    product_data = product_in.model_dump(
        exclude={"product_types", "color_ranges", "tags", "analogous"}
    )
    product = Product(**product_data)

    db.add(product)
    await db.commit()
    await db.refresh(product)

    # Add relationships
    if product_types:
        await db.execute(
            """
            INSERT INTO product_product_type (product_id, product_type_id)
            SELECT :product_id, pt.id FROM product_type pt
            WHERE pt.id IN :product_type_ids
            """,
            {"product_id": product.id, "product_type_ids": tuple(product_types)},
        )

    if color_ranges:
        await db.execute(
            """
            INSERT INTO product_color_range (product_id, color_range_id)
            SELECT :product_id, cr.id FROM color_range cr
            WHERE cr.id IN :color_range_ids
            """,
            {"product_id": product.id, "color_range_ids": tuple(color_ranges)},
        )

    if tags:
        await db.execute(
            """
            INSERT INTO product_tag (product_id, tag_id)
            SELECT :product_id, t.id FROM tag t
            WHERE t.id IN :tag_ids
            """,
            {"product_id": product.id, "tag_ids": tuple(tags)},
        )

    if analogous:
        await db.execute(
            """
            INSERT INTO product_analogous (product_id, analogous_id)
            SELECT :product_id, a.id FROM analogous a
            WHERE a.id IN :analogous_ids
            """,
            {"product_id": product.id, "analogous_ids": tuple(analogous)},
        )

    await db.commit()
    await db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductSchema)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    """Get a product by ID"""
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return product


@router.get("/", response_model=PageResponse[ProductSchema])
async def list_products(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    product_line_id: Optional[int] = None,
    product_type_id: Optional[int] = None,
    color_range_id: Optional[int] = None,
    tag_id: Optional[int] = None,
    analogous_id: Optional[int] = None,
    iscc_nbs_category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List products with filtering"""
    query = select(Product)
    count_query = select(func.count()).select_from(Product)

    # Apply filters
    if name:
        query = query.filter(Product.name.ilike(f"%{name}%"))
        count_query = count_query.filter(Product.name.ilike(f"%{name}%"))
    if product_line_id:
        query = query.filter(Product.product_line_id == product_line_id)
        count_query = count_query.filter(Product.product_line_id == product_line_id)
    if iscc_nbs_category:
        query = query.filter(Product.iscc_nbs_category == iscc_nbs_category)
        count_query = count_query.filter(Product.iscc_nbs_category == iscc_nbs_category)

    # Relationship filters would require joins, which we'll implement in a more complex way
    # This is a simplified version

    # Get total count
    result = await db.execute(count_query)
    total = result.scalar()

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    products = result.scalars().all()

    return PageResponse(
        items=products,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit,
    )


@router.put("/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: int, product_in: ProductUpdate, db: AsyncSession = Depends(get_db)
):
    """Update a product"""
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    # Extract relationship IDs
    product_types = product_in.product_types
    color_ranges = product_in.color_ranges
    tags = product_in.tags
    analogous = product_in.analogous

    # Update product without relationships
    update_data = product_in.model_dump(
        exclude={"product_types", "color_ranges", "tags", "analogous"},
        exclude_unset=True,
    )
    for key, value in update_data.items():
        setattr(product, key, value)

    # Update relationships if provided
    if product_types is not None:
        # Clear existing relationships
        await db.execute(
            "DELETE FROM product_product_type WHERE product_id = :product_id",
            {"product_id": product.id},
        )

        # Add new relationships
        if product_types:
            await db.execute(
                """
                INSERT INTO product_product_type (product_id, product_type_id)
                SELECT :product_id, pt.id FROM product_type pt
                WHERE pt.id IN :product_type_ids
                """,
                {"product_id": product.id, "product_type_ids": tuple(product_types)},
            )

    if color_ranges is not None:
        # Clear existing relationships
        await db.execute(
            "DELETE FROM product_color_range WHERE product_id = :product_id",
            {"product_id": product.id},
        )

        # Add new relationships
        if color_ranges:
            await db.execute(
                """
                INSERT INTO product_color_range (product_id, color_range_id)
                SELECT :product_id, cr.id FROM color_range cr
                WHERE cr.id IN :color_range_ids
                """,
                {"product_id": product.id, "color_range_ids": tuple(color_ranges)},
            )

    if tags is not None:
        # Clear existing relationships
        await db.execute(
            "DELETE FROM product_tag WHERE product_id = :product_id",
            {"product_id": product.id},
        )

        # Add new relationships
        if tags:
            await db.execute(
                """
                INSERT INTO product_tag (product_id, tag_id)
                SELECT :product_id, t.id FROM tag t
                WHERE t.id IN :tag_ids
                """,
                {"product_id": product.id, "tag_ids": tuple(tags)},
            )

    if analogous is not None:
        # Clear existing relationships
        await db.execute(
            "DELETE FROM product_analogous WHERE product_id = :product_id",
            {"product_id": product.id},
        )

        # Add new relationships
        if analogous:
            await db.execute(
                """
                INSERT INTO product_analogous (product_id, analogous_id)
                SELECT :product_id, a.id FROM analogous a
                WHERE a.id IN :analogous_ids
                """,
                {"product_id": product.id, "analogous_ids": tuple(analogous)},
            )

    await db.commit()
    await db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a product"""
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    await db.delete(product)
    await db.commit()
    return None
