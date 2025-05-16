from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .associations import (
    product_product_type,
    product_color_range,
    product_tag,
    product_analogous,
)

if TYPE_CHECKING:
    from .product_line import ProductLine
    from .product_swatch import ProductSwatch
    from .product_variant import ProductVariant
    from .supporting import ProductType, ColorRange, Tag, Analogous


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_line_id: Mapped[int] = mapped_column(
        ForeignKey("product_lines.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    iscc_nbs_category: Mapped[Optional[str]] = mapped_column(String(100))

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
    variants: Mapped[List["ProductVariant"]] = relationship(
        "ProductVariant", back_populates="product", cascade="all, delete-orphan"
    )

    # Many-to-many relationships
    product_types: Mapped[List["ProductType"]] = relationship(
        "ProductType", secondary=product_product_type, back_populates="products"
    )
    color_ranges: Mapped[List["ColorRange"]] = relationship(
        "ColorRange", secondary=product_color_range, back_populates="products"
    )
    tags: Mapped[List["Tag"]] = relationship(
        "Tag", secondary=product_tag, back_populates="products"
    )
    analogous: Mapped[List["Analogous"]] = relationship(
        "Analogous", secondary=product_analogous, back_populates="products"
    )
