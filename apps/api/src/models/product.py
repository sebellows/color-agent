from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, String, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .associations import (
    product_product_type,
    product_color_range,
    product_tag,
    product_analogous,
)
from .mixins import CrudTimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from .product_line import ProductLine
    from .product_swatch import ProductSwatch
    from .product_variant import ProductVariant
    from .supporting import ProductType, ColorRange, Tag, Analogous


class Product(Base, UUIDMixin, CrudTimestampMixin):
    __tablename__ = "products"

    product_line_id: Mapped[UUID] = mapped_column(
        ForeignKey("product_lines.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    iscc_nbs_category: Mapped[str | None] = mapped_column(String(100))

    # Relationships
    product_line: Mapped["ProductLine"] = relationship(
        "ProductLine", back_populates="products"
    )
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
    product_types: Mapped[list["ProductType"]] = relationship(
        "ProductType", secondary=product_product_type, back_populates="products"
    )
    color_ranges: Mapped[list["ColorRange"]] = relationship(
        "ColorRange", secondary=product_color_range, back_populates="products"
    )
    tags: Mapped[list["Tag"]] = relationship(
        "Tag", secondary=product_tag, back_populates="products"
    )
    analogous: Mapped[list["Analogous"]] = relationship(
        "Analogous", secondary=product_analogous, back_populates="products"
    )
