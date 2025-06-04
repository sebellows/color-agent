from pydantic import BaseModel


class Address(BaseModel):
    country: str | None = None
    formatted: str | None = None
    locality: str | None = None
    postal_code: str | None = None
    region: str | None = None
    street_address: str | None = None
    street_address_2: str | None = None

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "examples": [
                {
                    "country": "US",
                    "formatted": "123 Main St, Springfield, IL 62701, USA",
                    "locality": "Springfield",
                    "postal_code": "62701",
                    "region": "IL",
                    "street_address": "123 Main St",
                }
            ]
        }
