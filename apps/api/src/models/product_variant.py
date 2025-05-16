from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Boolean, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
from .associations import variant_vendor_color_range, variant_vendor_product_type

if TYPE_CHECKING:
    from .product import Product
    from .locale import Locale
    from .supporting import VendorColorRange, VendorProductType


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE")
    )
    locale_id: Mapped[int] = mapped_column(ForeignKey("locales.id", ondelete="CASCADE"))
    display_name: Mapped[str] = mapped_column(String(255))
    marketing_name: Mapped[str] = mapped_column(String(255))
    sku: Mapped[str] = mapped_column(String(100), index=True)
    discontinued: Mapped[Optional[bool]] = mapped_column(Boolean, default=False)
    image_url: Mapped[str] = mapped_column(String(512))
    packaging: Mapped[str] = mapped_column(String(100))
    volume_ml: Mapped[Optional[float]] = mapped_column(Float)
    volume_oz: Mapped[Optional[float]] = mapped_column(Float)
    price: Mapped[int] = mapped_column(Integer)  # Store price in cents
    product_url: Mapped[str] = mapped_column(String(512))
    opacity: Mapped[Optional[str]] = mapped_column(String(50))
    viscosity: Mapped[Optional[str]] = mapped_column(String(50))
    application_method: Mapped[Optional[str]] = mapped_column(String(50))
    vendor_product_id: Mapped[Optional[str]] = mapped_column(String(100))

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    locale: Mapped["Locale"] = relationship("Locale", back_populates="variants")

    # Many-to-many relationships
    vendor_color_ranges: Mapped[List["VendorColorRange"]] = relationship(
        "VendorColorRange",
        secondary=variant_vendor_color_range,
        back_populates="variants",
    )
    vendor_product_types: Mapped[List["VendorProductType"]] = relationship(
        "VendorProductType",
        secondary=variant_vendor_product_type,
        back_populates="variants",
    )
