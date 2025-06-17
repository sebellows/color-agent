from uuid import UUID

from advanced_alchemy.filters import SearchFilter
from advanced_alchemy.service import OffsetPagination
from domain.dependencies import Services
from fastapi import APIRouter, Query
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from typing_extensions import Annotated

from .models import Locale
from .schemas import LocaleCreate, LocaleFilters, LocaleResponse, LocaleUpdate


locale_router = APIRouter(tags=["Locales"])


@locale_router.post("/locales", response_model=LocaleResponse, status_code=HTTP_201_CREATED)
async def create_locale(
    container: Services,
    data: LocaleCreate,
):
    """Create a new locale"""
    locale = await container.provide_locales.create(data)
    return container.provide_locales.to_schema(locale)


@locale_router.get("/locales/{locale_id}", response_model=LocaleResponse, status_code=HTTP_200_OK)
async def get_locale(locale_id: UUID, container: Services):
    """Get a locale by ID"""
    locale = await container.provide_locales.get(Locale.id == locale_id)
    return container.provide_locales.to_schema(locale)


@locale_router.get("/locales", response_model=OffsetPagination[LocaleResponse], status_code=HTTP_200_OK)
async def list_locales(
    filter_query: Annotated[LocaleFilters, Query()],
    container: Services,
):
    filters = []
    if filter_query.country_code:
        filters.append(SearchFilter("country_code", filter_query.country_code, ignore_case=False))
    if filter_query.language_code:
        filters.append(SearchFilter("language_code", filter_query.language_code, ignore_case=False))
    if filter_query.currency_code:
        filters.append(SearchFilter("currency_code", filter_query.currency_code, ignore_case=False))
    if filter_query.country_name:
        filters.append(SearchFilter("country_name", filter_query.country_name, ignore_case=True))
    if filter_query.display_name:
        filters.append(SearchFilter("display_name", filter_query.display_name, ignore_case=True))

    try:
        results = await container.provide_locales.list(*filters)

        return container.provide_locales.to_schema(results)
    except Exception as e:
        print(f"Error listing locales: {str(e)}")
        raise e


@locale_router.patch("/locales/{locale_id}", response_model=LocaleResponse, status_code=HTTP_200_OK)
async def update_locale(
    container: Services,
    locale_id: UUID,
    data: LocaleUpdate,
):
    """Update a locale"""
    locale = await container.provide_locales.update(data, item_id=locale_id)
    return container.provide_locales.to_schema(locale)


@locale_router.delete("/locales/{locale_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_locale(locale_id: UUID, container: Services) -> None:
    """Delete a locale"""
    _ = await container.provide_locales.delete(locale_id)
    return None
