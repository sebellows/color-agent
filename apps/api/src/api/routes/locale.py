from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ...core.database import get_db
from ...models import Locale
from ...schemas import Locale as LocaleSchema, LocaleCreate, LocaleUpdate

router = APIRouter()


@router.post(
    "/", response_model=LocaleSchema, status_code=HTTPException.HTTP_201_CREATED
)
async def create_locale(locale_in: LocaleCreate, db: AsyncSession = Depends(get_db)):
    """Create a new locale"""
    locale = Locale(**locale_in.model_dump())
    db.add(locale)
    await db.commit()
    await db.refresh(locale)
    return locale


@router.get("/{locale_id}", response_model=LocaleSchema)
async def get_locale(locale_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a locale by ID"""
    result = await db.execute(select(Locale).filter(Locale.id == locale_id))
    locale = result.scalars().first()
    if not locale:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Locale with ID {locale_id} not found",
        )
    return locale


@router.get("/", response_model=List[LocaleSchema])
async def list_locales(
    country_code: Optional[str] = None,
    language_code: Optional[str] = None,
    currency_code: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List locales with optional filtering"""
    query = select(Locale)

    # Apply filters
    if country_code:
        query = query.filter(Locale.country_code == country_code)
    if language_code:
        query = query.filter(Locale.language_code == language_code)
    if currency_code:
        query = query.filter(Locale.currency_code == currency_code)

    # Execute query
    result = await db.execute(query)
    locales = result.scalars().all()

    return locales


@router.put("/{locale_id}", response_model=LocaleSchema)
async def update_locale(
    locale_id: UUID, locale_in: LocaleUpdate, db: AsyncSession = Depends(get_db)
):
    """Update a locale"""
    result = await db.execute(select(Locale).filter(Locale.id == locale_id))
    locale = result.scalars().first()
    if not locale:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Locale with ID {locale_id} not found",
        )

    update_data = locale_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(locale, key, value)

    await db.commit()
    await db.refresh(locale)
    return locale


@router.delete("/{locale_id}", status_code=HTTPException.HTTP_204_NO_CONTENT)
async def delete_locale(locale_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a locale"""
    result = await db.execute(select(Locale).filter(Locale.id == locale_id))
    locale = result.scalars().first()
    if not locale:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Locale with ID {locale_id} not found",
        )

    await db.delete(locale)
    await db.commit()
    return None
