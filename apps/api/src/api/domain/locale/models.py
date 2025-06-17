from typing import TYPE_CHECKING, List

from core.models import Entity
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from .locales import countries


if TYPE_CHECKING:
    from domain.product_variant.models import ProductVariant


class Locale(Entity):
    """
    Locale model to store locale information for products.
    This model is used to store the language, country, currency code,
    and currency symbol for different locales.
    """

    __tablename__ = "locales"

    # Relationships
    variants: Mapped[List["ProductVariant"]] = relationship(back_populates="locale")

    country_name: Mapped[str] = mapped_column(String(100), nullable=False)
    country_code: Mapped[str] = mapped_column(String(2))
    currency_code: Mapped[str] = mapped_column(String(10))
    currency_symbol: Mapped[str] = mapped_column(String(10))
    language_code: Mapped[str] = mapped_column(String(2), nullable=False)
    locale: Mapped[str] = mapped_column(String(5), nullable=False, unique=True)
    display_name: Mapped[str] = mapped_column(String(100), nullable=True)
    currency_decimal_spaces: Mapped[int] = mapped_column(nullable=True)

    @validates("country_code")
    def validate_locale_fields(self, key: str, value: str) -> str:
        """Validate that the country_code is valid."""
        if key == "country_code" and value not in countries:
            raise ValueError(f"Invalid country code: {value}")
        return value
