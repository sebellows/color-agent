from typing import List, TYPE_CHECKING
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.enums import ProductTypeEnum, ColorRangeEnum
from .base import Base
from .associations import (
    product_product_type,
    product_color_range,
    product_tag,
    product_analogous,
    variant_vendor_color_range,
    variant_vendor_product_type,
)
from .mixins import UUIDMixin

if TYPE_CHECKING:
    from .product import Product
    from .product_variant import ProductVariant


class ProductType(Base, UUIDMixin):
    __tablename__ = "product_types"

    name: Mapped[str] = mapped_column(Enum(ProductTypeEnum), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_product_type, back_populates="product_types"
    )


class ColorRange(Base, UUIDMixin):
    __tablename__ = "color_ranges"

    name: Mapped[str] = mapped_column(Enum(ColorRangeEnum), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_color_range, back_populates="color_ranges"
    )


class Tag(Base, UUIDMixin):
    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(String(100), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_tag, back_populates="tags"
    )


class Analogous(Base, UUIDMixin):
    __tablename__ = "analogous"

    name: Mapped[str] = mapped_column(String(100), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_analogous, back_populates="analogous"
    )


class VendorColorRange(Base, UUIDMixin):
    __tablename__ = "vendor_color_ranges"

    name: Mapped[str] = mapped_column(String(100), unique=True)

    # Relationships
    variants: Mapped[List["ProductVariant"]] = relationship(
        "ProductVariant",
        secondary=variant_vendor_color_range,
        back_populates="vendor_color_ranges",
    )


class VendorProductType(Base, UUIDMixin):
    __tablename__ = "vendor_product_types"

    name: Mapped[str] = mapped_column(String(100), unique=True)

    # Relationships
    variants: Mapped[List["ProductVariant"]] = relationship(
        "ProductVariant",
        secondary=variant_vendor_product_type,
        back_populates="vendor_product_types",
    )
