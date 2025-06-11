from uuid import UUID

from fastapi import APIRouter
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .models import Locale
from .schemas import LocaleCreate, LocaleResponse, LocaleUpdate
from .service import Locales


router = APIRouter(
    prefix="/locales",
    tags=["locales"],
)


@router.post("", response_model=LocaleResponse, status_code=HTTP_201_CREATED)
async def create_locale(
    locale_in: LocaleCreate,
    service: Locales,
):
    """Create a new locale"""
    locale_data = Locale(**locale_in.model_dump(exclude_unset=True))
    locale = await service.create(locale_data)
    return LocaleResponse.model_validate(locale)


@router.get("/{locale_id}", response_model=LocaleResponse, status_code=HTTP_200_OK)
async def get_locale(locale_id: UUID, service: Locales):
    """Get a locale by ID"""
    locale = await service.get(Locale.id == locale_id)

    return LocaleResponse.model_validate(locale)


@router.get("", response_model=list[LocaleResponse], status_code=HTTP_200_OK)
async def list_locales(
    service: Locales,
    country_code: str | None = None,
    language_code: str | None = None,
    currency_code: str | None = None,
):
    results = await service.list(
        filters=[
            (Locale.country_code == country_code) if country_code else None,
            (Locale.language_code == language_code) if language_code else None,
            (Locale.currency_code == currency_code) if currency_code else None,
        ],
        exclude_none=True,
    )
    return results


@router.put("/{locale_id}", response_model=LocaleResponse, status_code=HTTP_200_OK)
async def update_locale(
    locale_id: UUID,
    locale_in: LocaleUpdate,
    service: Locales,
):
    """Update a locale"""
    locale = await service.get_and_update(
        Locale.id == locale_id,
        data=locale_in.model_dump(exclude_unset=True),
    )

    return LocaleResponse.model_validate(locale)


@router.delete("/{locale_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_locale(locale_id: UUID, service: Locales):
    """Delete a locale"""
    await service.delete(Locale.id == locale_id)
    return None
