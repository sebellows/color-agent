from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from starlette.status import HTTP_204_NO_CONTENT, HTTP_201_CREATED, HTTP_404_NOT_FOUND

from ...core.database import get_db
from ...models import ProductLine
from ...schemas import (
    ProductLine as ProductLineSchema,
    ProductLineCreate,
    ProductLineUpdate,
    PageResponse,
)

router = APIRouter()


@router.post("/", response_model=ProductLineSchema, status_code=HTTP_201_CREATED)
async def create_product_line(
    product_line_in: ProductLineCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new product line"""
    product_line = ProductLine(**product_line_in.model_dump())
    db.add(product_line)
    await db.commit()
    await db.refresh(product_line)
    return product_line


@router.get("/{product_line_id}", response_model=ProductLineSchema)
async def get_product_line(product_line_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a product line by ID"""
    result = await db.execute(
        select(ProductLine).filter(ProductLine.id == product_line_id)
    )
    product_line = result.scalars().first()
    if not product_line:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product line with ID {product_line_id} not found",
        )
    return product_line


@router.get("/", response_model=PageResponse[ProductLineSchema])
async def list_product_lines(
    skip: int = 0,
    limit: int = 100,
    name: str | None = None,
    product_line_type: str | None = None,
    vendor_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List product lines with filtering"""
    query = select(ProductLine)
    count_query = select(func.count()).select_from(ProductLine)

    # Apply filters
    if name:
        query = query.filter(ProductLine.name.ilike(f"%{name}%"))
        count_query = count_query.filter(ProductLine.name.ilike(f"%{name}%"))
    if product_line_type:
        query = query.filter(ProductLine.product_line_type == product_line_type)
        count_query = count_query.filter(
            ProductLine.product_line_type == product_line_type
        )
    if vendor_id:
        query = query.filter(ProductLine.vendor_id == vendor_id)
        count_query = count_query.filter(ProductLine.vendor_id == vendor_id)

    # Get total count
    result = await db.execute(count_query)
    scalar = result.scalar()
    total = scalar if scalar is not None else 0

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    product_lines = result.scalars().all()

    return PageResponse(
        items=product_lines,
        total=total,
        page=skip // limit + 1,
        items_per_page=limit,
        pages=(total + limit - 1) // limit,
    )


@router.put("/{product_line_id}", response_model=ProductLineSchema)
async def update_product_line(
    product_line_id: UUID,
    product_line_in: ProductLineUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a product line"""
    result = await db.execute(
        select(ProductLine).filter(ProductLine.id == product_line_id)
    )
    product_line = result.scalars().first()
    if not product_line:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product line with ID {product_line_id} not found",
        )

    update_data = product_line_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product_line, key, value)

    await db.commit()
    await db.refresh(product_line)
    return product_line


@router.delete("/{product_line_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_product_line(
    product_line_id: UUID, db: AsyncSession = Depends(get_db)
):
    """Delete a product line"""
    result = await db.execute(
        select(ProductLine).filter(ProductLine.id == product_line_id)
    )
    product_line = result.scalars().first()
    if not product_line:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Product line with ID {product_line_id} not found",
        )

    await db.delete(product_line)
    await db.commit()
    return None
