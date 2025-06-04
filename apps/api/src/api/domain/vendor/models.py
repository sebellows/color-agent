from collections.abc import Hashable
from typing import TYPE_CHECKING

from advanced_alchemy.base import UUIDv7AuditBase
from advanced_alchemy.utils.text import slugify
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.elements import ColumnElement

from api.core.models import SoftDeleteMixin, UniqueSlugMixin


if TYPE_CHECKING:
    from ..product_line.models import ProductLine


class Vendor(UUIDv7AuditBase, SoftDeleteMixin, UniqueSlugMixin):
    __tablename__ = "vendors"

    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    url: Mapped[str] = mapped_column(String(255))
    platform: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    pdp_slug: Mapped[str] = mapped_column(String(100))
    plp_slug: Mapped[str] = mapped_column(String(100))

    # Relationships
    product_lines: Mapped[list["ProductLine"]] = relationship(
        "ProductLine",
        back_populates="vendor",
        cascade="all, delete",
        passive_deletes=True,
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
