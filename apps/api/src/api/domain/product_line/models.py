from collections.abc import Hashable
from typing import TYPE_CHECKING
from uuid import UUID

from advanced_alchemy.utils.text import slugify
from sqlalchemy import ColumnElement, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.enums import ProductLineTypeEnum
from api.core.models import Entity, WithFullTimeAuditMixin, WithUniqueSlugMixin


if TYPE_CHECKING:
    from api.domain.product.models import Product
    from api.domain.vendor.models import Vendor


class ProductLine(Entity, WithFullTimeAuditMixin, WithUniqueSlugMixin):
    __tablename__ = "product_lines"

    vendor_id: Mapped[UUID] = mapped_column(ForeignKey("vendors.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    marketing_name: Mapped[str] = mapped_column(String(255))
    vendor_slug: Mapped[str | None] = mapped_column(String(100))
    product_line_type: Mapped[str] = mapped_column(Enum(ProductLineTypeEnum))
    description: Mapped[str | None] = mapped_column(Text)

    # @declared_attr
    # def slug(cls) -> Mapped[str]:
    #     """Slug field."""
    #     return mapped_column(String(length=100), nullable=False)

    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="product_lines", default=None)
    products: Mapped[list["Product"]] = relationship(
        "Product",
        back_populates="product_line",
        default_factory=list,
        cascade="all, delete",
        passive_deletes=True,
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
        if slug:
            return cls.slug == slug
        return cls.slug == slugify(name)
