from typing import Annotated
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class LocaleBase(BaseModel):
    language_code: Annotated[str, Field(description="Language code (e.g., 'en')")]
    country_code: Annotated[str, Field(description="Country code (e.g., 'US')")]
    currency_code: Annotated[str, Field(description="Currency code (e.g., 'USD')")]
    currency_symbol: Annotated[str, Field(description="Currency symbol (e.g., '$')")]


class LocaleCreate(LocaleBase):
    pass


class LocaleUpdate(BaseModel):
    language_code: Annotated[str | None, Field(description="Language code")] = None
    country_code: Annotated[str | None, Field(description="Country code")] = None
    currency_code: Annotated[str | None, Field(description="Currency code")] = None
    currency_symbol: Annotated[str | None, Field(description="Currency symbol")] = None


class Locale(LocaleBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[UUID, Field(description="Unique identifier")]


class LocaleFilterParams(BaseModel):
    language_code: Annotated[
        str | None, Field(description="Filter by language code")
    ] = None
    country_code: Annotated[str | None, Field(description="Filter by country code")] = (
        None
    )
