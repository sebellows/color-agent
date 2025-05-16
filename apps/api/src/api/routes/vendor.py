from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from ...core.database import get_db
from ...models import Vendor
from ...schemas import (
    Vendor as VendorSchema,
    VendorCreate,
    VendorUpdate,
    VendorFilterParams,
    PageResponse,
)

router = APIRouter()


@router.post("/", response_model=VendorSchema, status_code=status.HTTP_201_CREATED)
async def create_vendor(vendor_in: VendorCreate, db: AsyncSession = Depends(get_db)):
    """Create a new vendor"""
    vendor = Vendor(**vendor_in.model_dump())
    db.add(vendor)
    await db.commit()
    await db.refresh(vendor)
    return vendor


@router.get("/{vendor_id}", response_model=VendorSchema)
async def get_vendor(vendor_id: int, db: AsyncSession = Depends(get_db)):
    """Get a vendor by ID"""
    result = await db.execute(select(Vendor).filter(Vendor.id == vendor_id))
    vendor = result.scalars().first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vendor with ID {vendor_id} not found",
        )
    return vendor


@router.get("/", response_model=PageResponse[VendorSchema])
async def list_vendors(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    platform: Optional[str] = None,
    slug: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List vendors with filtering"""
    query = select(Vendor)
    count_query = select(func.count()).select_from(Vendor)

    # Apply filters
    if name:
        query = query.filter(Vendor.name.ilike(f"%{name}%"))
        count_query = count_query.filter(Vendor.name.ilike(f"%{name}%"))
    if platform:
        query = query.filter(Vendor.platform == platform)
        count_query = count_query.filter(Vendor.platform == platform)
    if slug:
        query = query.filter(Vendor.slug == slug)
        count_query = count_query.filter(Vendor.slug == slug)

    # Get total count
    result = await db.execute(count_query)
    total = result.scalar()

    # Apply pagination
    query = query.offset(skip).limit(limit)

    # Execute query
    result = await db.execute(query)
    vendors = result.scalars().all()

    return PageResponse(
        items=vendors,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit,
    )


@router.put("/{vendor_id}", response_model=VendorSchema)
async def update_vendor(
    vendor_id: int, vendor_in: VendorUpdate, db: AsyncSession = Depends(get_db)
):
    """Update a vendor"""
    result = await db.execute(select(Vendor).filter(Vendor.id == vendor_id))
    vendor = result.scalars().first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vendor with ID {vendor_id} not found",
        )

    update_data = vendor_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vendor, key, value)

    await db.commit()
    await db.refresh(vendor)
    return vendor


@router.delete("/{vendor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vendor(vendor_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a vendor"""
    result = await db.execute(select(Vendor).filter(Vendor.id == vendor_id))
    vendor = result.scalars().first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vendor with ID {vendor_id} not found",
        )

    await db.delete(vendor)
    await db.commit()
    return None
