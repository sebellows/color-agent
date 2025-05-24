from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.status import HTTP_204_NO_CONTENT, HTTP_201_CREATED, HTTP_404_NOT_FOUND

from ...core.database import get_db
from ...models import ProductSwatch
from ...schemas import (
    ProductSwatch as ProductSwatchSchema,
    ProductSwatchCreate,
    ProductSwatchUpdate,
)

router = APIRouter()


@router.post("/", response_model=ProductSwatchSchema, status_code=HTTP_201_CREATED)
async def create_product_swatch(
    product_swatch_in: ProductSwatchCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new product swatch"""
    product_swatch = ProductSwatch(**product_swatch_in.model_dump())
    db.add(product_swatch)
    await db.commit()
    await db.refresh(product_swatch)
    return product_swatch


@router.get("/{product_swatch_id}", response_model=ProductSwatchSchema)
async def get_product_swatch(
    product_swatch_id: UUID, db: AsyncSession = Depends(get_db)
):
    """Get a product swatch by ID"""
    result = await db.execute(
        select(ProductSwatch).filter(ProductSwatch.id == product_swatch_id)
    )
    product_swatch = result.scalars().first()
    if not product_swatch:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product swatch with ID {product_swatch_id} not found",
        )
    return product_swatch


@router.get("/", response_model=list[ProductSwatchSchema])
async def list_product_swatches(
    product_id: UUID | None = None, db: AsyncSession = Depends(get_db)
):
    """List product swatches with optional filtering by product ID"""
    query = select(ProductSwatch)

    # Apply filters
    if product_id:
        query = query.filter(ProductSwatch.product_id == product_id)

    # Execute query
    result = await db.execute(query)
    product_swatches = result.scalars().all()

    return product_swatches


@router.put("/{product_swatch_id}", response_model=ProductSwatchSchema)
async def update_product_swatch(
    product_swatch_id: UUID,
    product_swatch_in: ProductSwatchUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a product swatch"""
    result = await db.execute(
        select(ProductSwatch).filter(ProductSwatch.id == product_swatch_id)
    )
    product_swatch = result.scalars().first()
    if not product_swatch:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product swatch with ID {product_swatch_id} not found",
        )

    update_data = product_swatch_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product_swatch, key, value)

    await db.commit()
    await db.refresh(product_swatch)
    return product_swatch


@router.delete("/{product_swatch_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_swatch(
    product_swatch_id: UUID, db: AsyncSession = Depends(get_db)
):
    """Delete a product swatch"""
    result = await db.execute(
        select(ProductSwatch).filter(ProductSwatch.id == product_swatch_id)
    )
    product_swatch = result.scalars().first()
    if not product_swatch:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product swatch with ID {product_swatch_id} not found",
        )

    await db.delete(product_swatch)
    await db.commit()
    return None
