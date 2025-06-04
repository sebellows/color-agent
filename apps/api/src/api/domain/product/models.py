from typing import TYPE_CHECKING

from advanced_alchemy.base import UUIDv7AuditBase
from advanced_alchemy.mixins import SlugKey, UniqueMixin
from sqlalchemy import UUID, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.models import SoftDeleteMixin
from api.domain.associations import (
    product_analogous_association,
    product_color_range_association,
    product_product_type_association,
    product_tag_association,
)


if TYPE_CHECKING:
    from api.domain.analogous.models import Analogous
    from api.domain.color_range.models import ColorRange
    from api.domain.product_line.models import ProductLine
    from api.domain.product_swatch.models import ProductSwatch
    from api.domain.product_type.models import ProductType
    from api.domain.product_variant.models import ProductVariant
    from api.domain.tag.models import Tag


class Product(UUIDv7AuditBase, SoftDeleteMixin, SlugKey, UniqueMixin):
    __tablename__ = "products"

    product_line_id: Mapped[UUID] = mapped_column(ForeignKey("product_lines.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    iscc_nbs_category: Mapped[str | None] = mapped_column(String(100))

    # Relationships
    product_line: Mapped["ProductLine"] = relationship("ProductLine", back_populates="products")
    swatch: Mapped["ProductSwatch"] = relationship(
        "ProductSwatch",
        back_populates="product",
        uselist=False,
        cascade="all, delete-orphan",
    )
    variants: Mapped[list["ProductVariant"]] = relationship(
        "ProductVariant", back_populates="product", cascade="all, delete-orphan"
    )

    # Many-to-many relationships
    product_type: Mapped[list["ProductType"]] = relationship(
        "ProductType", secondary=product_product_type_association, back_populates="products", lazy="selectin"
    )
    color_range: Mapped[list["ColorRange"]] = relationship(
        "ColorRange", secondary=product_color_range_association, back_populates="products", lazy="selectin"
    )
    tags: Mapped[list["Tag"]] = relationship(
        "Tag", secondary=product_tag_association, back_populates="products", lazy="selectin"
    )
    analogous: Mapped[list["Analogous"]] = relationship(
        "Analogous", secondary=product_analogous_association, back_populates="products", lazy="selectin"
    )
