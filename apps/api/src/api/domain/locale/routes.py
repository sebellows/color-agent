from uuid import UUID

from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .dependencies import provide_locale_repository
from .models import Locale
from .repository import LocaleRepository
from .schemas import Locale as LocaleSchema
from .schemas import LocaleCreate, LocaleUpdate


router = APIRouter(
    prefix="/locales",
    tags=["locales"],
)


@router.post("", response_model=LocaleSchema, status_code=HTTP_201_CREATED)
async def create_locale(
    locale_in: LocaleCreate,
    repository: LocaleRepository = Depends(provide_locale_repository),
):
    """Create a new locale"""
    locale_data = Locale(**locale_in.model_dump(exclude_unset=True))
    locale = await repository.add(locale_data)
    await repository.session.commit()
    return LocaleSchema.model_validate(locale)


@router.get("/{locale_id}", response_model=LocaleSchema, status_code=HTTP_200_OK)
async def get_locale(locale_id: UUID, repository: LocaleRepository = Depends(provide_locale_repository)):
    """Get a locale by ID"""
    locale = await repository.get(Locale.id == locale_id)

    return LocaleSchema.model_validate(locale)


@router.get("", response_model=list[LocaleSchema], status_code=HTTP_200_OK)
async def list_locales(
    country_code: str | None = None,
    language_code: str | None = None,
    currency_code: str | None = None,
    repository: LocaleRepository = Depends(provide_locale_repository),
):
    results = await repository.list(
        filters=[
            (Locale.country_code == country_code) if country_code else None,
            (Locale.language_code == language_code) if language_code else None,
            (Locale.currency_code == currency_code) if currency_code else None,
        ],
        exclude_none=True,
    )
    return results


@router.put("/{locale_id}", response_model=LocaleSchema, status_code=HTTP_200_OK)
async def update_locale(
    locale_id: UUID,
    locale_in: LocaleUpdate,
    repository: LocaleRepository = Depends(provide_locale_repository),
):
    """Update a locale"""
    locale = await repository.get_and_update(
        Locale.id == locale_id,
        data=locale_in.model_dump(exclude_unset=True),
    )

    return LocaleSchema.model_validate(locale)


@router.delete("/{locale_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_locale(locale_id: UUID, repository: LocaleRepository = Depends(provide_locale_repository)):
    """Delete a locale"""
    await repository.delete(Locale.id == locale_id)
    return None
