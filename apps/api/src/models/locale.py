from typing import List, TYPE_CHECKING
from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .product_variant import ProductVariant


class Locale(Base):
    __tablename__ = "locales"

    id: Mapped[int] = mapped_column(primary_key=True)
    language_code: Mapped[str] = mapped_column(String(10))
    country_code: Mapped[str] = mapped_column(String(10))
    currency_code: Mapped[str] = mapped_column(String(10))
    currency_symbol: Mapped[str] = mapped_column(String(10))

    # Unique constraint for language + country combination
    __table_args__ = (
        UniqueConstraint(
            "language_code", "country_code", name="uix_locale_lang_country"
        ),
    )

    # Relationships
    variants: Mapped[List["ProductVariant"]] = relationship(
        "ProductVariant", back_populates="locale"
    )
