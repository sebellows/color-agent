from collections.abc import Hashable
from typing import TYPE_CHECKING

from advanced_alchemy.utils.text import slugify
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.elements import ColumnElement

from api.core.models import Entity, WithFullTimeAuditMixin, WithUniqueSlugMixin


if TYPE_CHECKING:
    from api.domain.product_line import ProductLine


class Vendor(Entity, WithFullTimeAuditMixin, WithUniqueSlugMixin):
    __tablename__ = "vendors"

    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    url: Mapped[str] = mapped_column(String(255))
    platform: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    pdp_slug: Mapped[str] = mapped_column(String(100))
    plp_slug: Mapped[str] = mapped_column(String(100))

    # @declared_attr
    # def slug(cls) -> Mapped[str]:
    #     """Slug field."""
    #     return mapped_column(String(length=100), nullable=False)

    # Relationships
    product_lines: Mapped[list["ProductLine"]] = relationship(
        "ProductLine",
        back_populates="vendor",
        cascade="all, delete",
        default_factory=list,
        # passive_deletes=True,
    )

    @classmethod
    def unique_hash(cls, name: str, slug: str | None = None) -> Hashable:
        """Generate a unique hash for deduplication."""
        return slug if slug else slugify(name)

    @classmethod
    def unique_filter(
        cls,
        name: str,
        slug: str | None = None,
    ) -> ColumnElement[bool]:
        """SQL filter for finding existing records."""
        if slug and cls.slug:
            return cls.slug == slug
        return cls.slug == slugify(name)
