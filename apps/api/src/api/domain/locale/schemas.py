from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field


class LocaleBase(BaseModel):
    country_code: Annotated[str, Field(description="Country code (e.g., 'US')")]
    country_name: Annotated[str, Field(description="Country name (e.g., 'United States')")]
    currency_code: Annotated[str, Field(description="Currency code (e.g., 'USD')")]
    currency_decimal_spaces: Annotated[int | None, Field(description="Decimal places for the currency")]
    currency_symbol: Annotated[str, Field(description="Currency symbol (e.g., '$')")]
    display_name: Annotated[
        str | None,
        Field(description="The name of the country in the locale's language (Endonym), e.g., 'Deutchland' for Germany"),
    ]
    language_code: Annotated[str, Field(description="Language code (e.g., 'en')")]
    locale: Annotated[str, Field(description="Locale identifier (e.g., 'en-US')")]

    class Config:
        from_attributes = True


class LocaleCreate(LocaleBase):
    pass


class LocaleUpdate(BaseModel):
    country_code: Annotated[str | None, Field(description="Country code (e.g., 'US')", default=None)]
    country_name: Annotated[str | None, Field(description="Country name (e.g., 'United States')", default=None)]
    currency_code: Annotated[str | None, Field(description="Currency code (e.g., 'USD')", default=None)]
    currency_decimal_spaces: Annotated[int | None, Field(description="Decimal places for the currency", default=None)]
    currency_symbol: Annotated[str | None, Field(description="Currency symbol (e.g., '$')", default=None)]
    display_name: Annotated[
        str | None,
        Field(
            description="The name of the country in the locale's language (Endonym), e.g., 'Deutchland' for Germany",
            default=None,
        ),
    ]
    language_code: Annotated[str | None, Field(description="Language code (e.g., 'en')", default=None)]
    locale: Annotated[str | None, Field(description="Locale identifier (e.g., 'en-US')", default=None)]


class LocaleRead(LocaleBase):
    id: Annotated[UUID, Field(description="Unique identifier")]


class LocaleResponse(LocaleBase):
    id: Annotated[UUID, Field(description="Unique identifier")]


class LocaleFilterParams(BaseModel):
    language_code: Annotated[str | None, Field(description="Filter by language code", default=None)]
    country_code: Annotated[str | None, Field(description="Filter by country code", default=None)]
    country_name: Annotated[str | None, Field(description="Filter by country name", default=None)]
    display_name: Annotated[str | None, Field(description="Filter by country endonym", default=None)]
