from collections.abc import Hashable
from typing import TYPE_CHECKING

from advanced_alchemy.utils.text import slugify
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.elements import ColumnElement

from api.core.models import Entity, WithUniqueSlugMixin
from api.domain.associations import product_tag_association


if TYPE_CHECKING:
    from api.domain.product.models import Product


class Tag(Entity, WithUniqueSlugMixin):
    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    type: Mapped[str] = mapped_column(String(100), nullable=True)

    # Relationships
    products: Mapped[list["Product"]] = relationship(
        secondary=product_tag_association, back_populates="tags", viewonly=True
    )

    @classmethod
    def unique_hash(cls, name: str, slug: str | None = None) -> Hashable:
        """Generate a unique hash for deduplication."""
        return slugify(name)

    @classmethod
    def unique_filter(
        cls,
        name: str,
        slug: str | None = None,
    ) -> ColumnElement[bool]:
        """SQL filter for finding existing records."""
        return cls.slug == slugify(name)
