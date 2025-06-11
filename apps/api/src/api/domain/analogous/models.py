from collections.abc import Hashable
from typing import TYPE_CHECKING

from advanced_alchemy.utils.text import slugify
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.elements import ColumnElement

from api.core.models import Entity, WithUniqueSlugMixin
from api.domain.associations import product_analogous_association


if TYPE_CHECKING:
    from product.models import Product


class Analogous(Entity, WithUniqueSlugMixin):
    __tablename__ = "analogous"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)

    # Relationships
    products: Mapped[list["Product"]] = relationship(
        secondary=product_analogous_association, back_populates="analogous", viewonly=True
    )

    @classmethod
    def unique_hash(cls, name: str, slug: str | None = None, *args, **kwargs) -> Hashable:
        """Generate a unique hash for deduplication."""
        return slugify(name)

    @classmethod
    def unique_filter(cls, name: str, slug: str | None = None, *args, **kwargs) -> ColumnElement[bool]:
        """SQL filter for finding existing records."""
        return cls.slug == slugify(name)
