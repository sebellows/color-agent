from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Boolean, Float, Integer, Enum, UUID
from ..core.enums import (
    OpacityEnum,
    ViscosityEnum,
    ApplicationMethodEnum,
    PackagingTypeEnum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .associations import variant_vendor_color_range, variant_vendor_product_type
from .mixins import CrudTimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from .product import Product
    from .locale import Locale
    from .supporting import VendorColorRange, VendorProductType


class ProductVariant(Base, CrudTimestampMixin, UUIDMixin):
    __tablename__ = "product_variants"

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    locale: Mapped["Locale"] = relationship("Locale", back_populates="variants")

    # Many-to-many relationships
    vendor_color_ranges: Mapped[list["VendorColorRange"]] = relationship(
        "VendorColorRange",
        secondary=variant_vendor_color_range,
        back_populates="variants",
    )
    vendor_product_types: Mapped[list["VendorProductType"]] = relationship(
        "VendorProductType",
        secondary=variant_vendor_product_type,
        back_populates="variants",
    )

    # Required fields (no default values)
    product_id: Mapped[UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE")
    )
    locale_id: Mapped[UUID] = mapped_column(
        ForeignKey("locales.id", ondelete="CASCADE")
    )
    display_name: Mapped[str] = mapped_column(String(255))
    marketing_name: Mapped[str] = mapped_column(String(255))
    sku: Mapped[str] = mapped_column(String(100), index=True)
    image_url: Mapped[str] = mapped_column(String(512))
    packaging: Mapped[str] = mapped_column(Enum(PackagingTypeEnum))
    price: Mapped[int] = mapped_column(Integer)  # Store price in cents
    product_url: Mapped[str] = mapped_column(String(512))

    # Optional fields (with default values or nullable)
    discontinued: Mapped[bool | None] = mapped_column(Boolean, default=False)
    volume_ml: Mapped[float | None] = mapped_column(Float, default=None)
    volume_oz: Mapped[float | None] = mapped_column(Float, default=None)
    opacity: Mapped[str | None] = mapped_column(Enum(OpacityEnum), default=None)
    viscosity: Mapped[str | None] = mapped_column(Enum(ViscosityEnum), default=None)
    application_method: Mapped[str | None] = mapped_column(
        Enum(ApplicationMethodEnum), default=None
    )
    vendor_product_id: Mapped[str | None] = mapped_column(String(100), default=None)
