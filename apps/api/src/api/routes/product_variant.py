from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from ...core.database import get_db
from ...models import ProductVariant
from ...schemas import (
    ProductVariant as ProductVariantSchema,
    ProductVariantCreate,
    ProductVariantUpdate,
    PageResponse,
)

router = APIRouter()


@router.post(
    "/", response_model=ProductVariantSchema, status_code=HTTPException.HTTP_201_CREATED
)
async def create_product_variant(
    product_variant_in: ProductVariantCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new product variant"""
    # Extract relationship IDs
    vendor_color_ranges = product_variant_in.vendor_color_ranges or []
    vendor_product_types = product_variant_in.vendor_product_types or []

    # Create product variant without relationships
    product_variant_data = product_variant_in.model_dump(
        exclude={"vendor_color_ranges", "vendor_product_types"}
    )
    product_variant = ProductVariant(**product_variant_data)

    db.add(product_variant)
    await db.commit()
    await db.refresh(product_variant)

    # Add relationships
    if vendor_color_ranges:
        await db.execute(
            """
            INSERT INTO product_variant_vendor_color_range (product_variant_id, vendor_color_range_id)
            SELECT :product_variant_id, vcr.id FROM vendor_color_range vcr
            WHERE vcr.id IN :vendor_color_range_ids
            """,
            {
                "product_variant_id": product_variant.id,
                "vendor_color_range_ids": tuple(vendor_color_ranges),
            },
        )

    if vendor_product_types:
        await db.execute(
            """
            INSERT INTO product_variant_vendor_product_type (product_variant_id, vendor_product_type_id)
            SELECT :product_variant_id, vpt.id FROM vendor_product_type vpt
            WHERE vpt.id IN :vendor_product_type_ids
            """,
            {
                "product_variant_id": product_variant.id,
                "vendor_product_type_ids": tuple(vendor_product_types),
            },
        )

    await db.commit()
    await db.refresh(product_variant)
    return product_variant


@router.get("/{product_variant_id}", response_model=ProductVariantSchema)
async def get_product_variant(
    product_variant_id: UUID, db: AsyncSession = Depends(get_db)
):
    """Get a product variant by ID"""
    result = await db.execute(
        select(ProductVariant).filter(ProductVariant.id == product_variant_id)
    )
    product_variant = result.scalars().first()
    if not product_variant:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Product variant with ID {product_variant_id} not found",
        )
    return product_variant


@router.get("/", response_model=PageResponse[ProductVariantSchema])
async def list_product_variants(
    skip: int = 0,
    limit: int = 100,
    product_id: UUID | None = None,
    locale_id: UUID | None = None,
    sku: str | None = None,
    discontinued: bool | None = None,
    application_method: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List product variants with filtering"""
    query = select(ProductVariant)
    count_query = select(func.count()).select_from(ProductVariant)

    # Apply filters
    if product_id:
        query = query.filter(ProductVariant.product_id == product_id)
        count_query = count_query.filter(ProductVariant.product_id == product_id)
    if locale_id:
        query = query.filter(ProductVariant.locale_id == locale_id)
        count_query = count_query.filter(ProductVariant.locale_id == locale_id)
    if sku:
        query = query.filter(ProductVariant.sku == sku)
        count_query = count_query.filter(ProductVariant.sku == sku)
    if discontinued is not None:
        query = query.filter(ProductVariant.discontinued == discontinued)
        count_query = count_query.filter(ProductVariant.discontinued == discontinued)
    if application_method:
        query = query.filter(ProductVariant.application_method == application_method)
        count_query = count_query.filter(
            ProductVariant.application_method == application_method
        )

    # Get total count
    result = await db.execute(count_query)
    scalar = result.scalar()
    total = scalar if scalar is not None else 0

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    product_variants = result.scalars().all()

    return PageResponse(
        items=product_variants,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit,
    )


@router.put("/{product_variant_id}", response_model=ProductVariantSchema)
async def update_product_variant(
    product_variant_id: UUID,
    product_variant_in: ProductVariantUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a product variant"""
    result = await db.execute(
        select(ProductVariant).filter(ProductVariant.id == product_variant_id)
    )
    product_variant = result.scalars().first()
    if not product_variant:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Product variant with ID {product_variant_id} not found",
        )

    # Extract relationship IDs
    vendor_color_ranges = product_variant_in.vendor_color_ranges
    vendor_product_types = product_variant_in.vendor_product_types

    # Update product variant without relationships
    update_data = product_variant_in.model_dump(
        exclude={"vendor_color_ranges", "vendor_product_types"}, exclude_unset=True
    )
    for key, value in update_data.items():
        setattr(product_variant, key, value)

    # Update relationships if provided
    if vendor_color_ranges is not None:
        # Clear existing relationships
        await db.execute(
            "DELETE FROM product_variant_vendor_color_range WHERE product_variant_id = :product_variant_id",
            {"product_variant_id": product_variant.id},
        )

        # Add new relationships
        if vendor_color_ranges:
            await db.execute(
                """
                INSERT INTO product_variant_vendor_color_range (product_variant_id, vendor_color_range_id)
                SELECT :product_variant_id, vcr.id FROM vendor_color_range vcr
                WHERE vcr.id IN :vendor_color_range_ids
                """,
                {
                    "product_variant_id": product_variant.id,
                    "vendor_color_range_ids": tuple(vendor_color_ranges),
                },
            )

    if vendor_product_types is not None:
        # Clear existing relationships
        await db.execute(
            "DELETE FROM product_variant_vendor_product_type WHERE product_variant_id = :product_variant_id",
            {"product_variant_id": product_variant.id},
        )

        # Add new relationships
        if vendor_product_types:
            await db.execute(
                """
                INSERT INTO product_variant_vendor_product_type (product_variant_id, vendor_product_type_id)
                SELECT :product_variant_id, vpt.id FROM vendor_product_type vpt
                WHERE vpt.id IN :vendor_product_type_ids
                """,
                {
                    "product_variant_id": product_variant.id,
                    "vendor_product_type_ids": tuple(vendor_product_types),
                },
            )

    await db.commit()
    await db.refresh(product_variant)
    return product_variant


@router.delete("/{product_variant_id}", status_code=HTTPException.HTTP_204_NO_CONTENT)
async def delete_product_variant(
    product_variant_id: UUID, db: AsyncSession = Depends(get_db)
):
    """Delete a product variant"""
    result = await db.execute(
        select(ProductVariant).filter(ProductVariant.id == product_variant_id)
    )
    product_variant = result.scalars().first()
    if not product_variant:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Product variant with ID {product_variant_id} not found",
        )

    await db.delete(product_variant)
    await db.commit()
    return None
