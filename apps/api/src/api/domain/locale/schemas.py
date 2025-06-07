from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field


class LocaleBase(BaseModel):
    language_code: Annotated[str, Field(description="Language code (e.g., 'en')")]
    country_code: Annotated[str, Field(description="Country code (e.g., 'US')")]
    currency_code: Annotated[str, Field(description="Currency code (e.g., 'USD')")]
    currency_symbol: Annotated[str, Field(description="Currency symbol (e.g., '$')")]


class LocaleCreate(LocaleBase):
    pass


class LocaleUpdate(BaseModel):
    language_code: Annotated[str | None, Field(description="Language code", default=None)]
    country_code: Annotated[str | None, Field(description="Country code", default=None)]
    currency_code: Annotated[str | None, Field(description="Currency code", default=None)]
    currency_symbol: Annotated[str | None, Field(description="Currency symbol", default=None)]
    slug: Annotated[str | None, Field(description="Unique identifier slug", default=None)]


class Locale(LocaleBase):
    id: Annotated[UUID, Field(description="Unique identifier")]

    class Config:
        from_attributes = True


class LocaleResponse(LocaleBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique identifier slug")]

    class Config:
        from_attributes = True


class LocaleFilterParams(BaseModel):
    language_code: Annotated[str | None, Field(description="Filter by language code", default=None)]
    country_code: Annotated[str | None, Field(description="Filter by country code", default=None)]
