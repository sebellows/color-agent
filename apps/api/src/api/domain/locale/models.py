from collections.abc import Hashable
from typing import TYPE_CHECKING, List

from advanced_alchemy.base import UUIDv7Base
from advanced_alchemy.mixins import SlugKey, UniqueMixin
from advanced_alchemy.utils.text import slugify
from sqlalchemy import ColumnElement, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .locales import countries, languages


if TYPE_CHECKING:
    from api.domain.product_variant.models import ProductVariant


class Locale(UUIDv7Base, SlugKey, UniqueMixin):
    """
    Locale model to store locale information for products.
    This model is used to store the language, country, currency code,
    and currency symbol for different locales.
    """

    __tablename__ = "locales"

    language_code: Mapped[str] = mapped_column(String(10))
    country_code: Mapped[str] = mapped_column(String(10))
    currency_code: Mapped[str] = mapped_column(String(10))
    currency_symbol: Mapped[str] = mapped_column(String(10))

    # Unique constraint for language + country combination
    __table_args__ = (UniqueConstraint("language_code", "country_code", name="uix_locale_lang_country"),)

    # Relationships
    variants: Mapped[List["ProductVariant"]] = relationship("ProductVariant", back_populates="locale")

    @classmethod
    def to_locale_string(cls, language_code: str, country_code: str) -> str:
        """Convert language and country codes to a locale string."""
        if language_code not in languages or country_code not in countries:
            raise ValueError(f"Invalid language code '{language_code}' or country code '{country_code}'.")
        return f"{language_code}-{country_code}"

    @classmethod
    def unique_hash(cls, name: str, slug: str | None = None) -> Hashable:
        """Generate a unique hash for deduplication."""
        if slug is not None:
            return slug
        if "-" in name:
            lang, country = name.split("-", 1)
            return cls.to_locale_string(lang, country)
        return slugify(name)

    @classmethod
    def unique_filter(
        cls,
        name: str,
        slug: str | None = None,
    ) -> ColumnElement[bool]:
        """SQL filter for finding existing records."""
        if "-" in name:
            lang, country = name.split("-", 1)
            return cls.slug == cls.to_locale_string(lang, country)
        return cls.slug == slugify(name)
