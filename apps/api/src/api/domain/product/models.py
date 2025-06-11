from collections.abc import Hashable
from typing import TYPE_CHECKING

from advanced_alchemy.utils.text import slugify
from sqlalchemy import ARRAY, UUID, ColumnElement, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.models import Entity, WithFullTimeAuditMixin, WithUniqueSlugMixin
from api.domain.associations import (
    product_analogous_association,
    product_tag_association,
)
from api.domain.enums import ColorRangeEnum, ProductTypeEnum


if TYPE_CHECKING:
    from api.domain.analogous.models import Analogous
    from api.domain.product_line.models import ProductLine
    from api.domain.product_swatch.models import ProductSwatch
    from api.domain.product_variant.models import ProductVariant
    from api.domain.tag.models import Tag


class Product(Entity, WithFullTimeAuditMixin, WithUniqueSlugMixin):
    __tablename__ = "products"

    product_line_id: Mapped[UUID] = mapped_column(ForeignKey("product_lines.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(nullable=False, index=True)
    iscc_nbs_category: Mapped[str | None] = mapped_column(nullable=True)

    color_range: Mapped[list["ColorRangeEnum"]] = mapped_column(ARRAY(Enum(ColorRangeEnum, inherit_schema=True)))
    product_type: Mapped[list["ProductTypeEnum"]] = mapped_column(ARRAY(Enum(ProductTypeEnum, inherit_schema=True)))

    # Relationships
    product_line: Mapped["ProductLine"] = relationship("ProductLine", back_populates="products")
    swatch: Mapped["ProductSwatch"] = relationship(
        "ProductSwatch",
        back_populates="product",
        cascade="all, delete-orphan",
    )
    variants: Mapped[list["ProductVariant"]] = relationship(
        "ProductVariant", back_populates="product", cascade="all, delete-orphan", lazy="selectin"
    )

    # Many-to-many relationships
    tags: Mapped[list[Tag]] = relationship(
        secondary=product_tag_association, back_populates="products", lazy="selectin"
    )
    analogous: Mapped[list[Analogous]] = relationship(
        secondary=product_analogous_association, back_populates="products", lazy="selectin"
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
