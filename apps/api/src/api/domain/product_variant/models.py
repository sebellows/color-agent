from typing import TYPE_CHECKING

from advanced_alchemy.base import UUIDv7AuditBase
from sqlalchemy import UUID, Boolean, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.enums import ApplicationMethodEnum, OpacityEnum, PackagingTypeEnum, ViscosityEnum
from api.core.models import SoftDeleteMixin


if TYPE_CHECKING:
    from api.domain.locale.models import Locale
    from api.domain.product.models import Product


class ProductVariant(UUIDv7AuditBase, SoftDeleteMixin):
    __tablename__ = "product_variants"

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    locale: Mapped["Locale"] = relationship("Locale", back_populates="variants")

    # Required fields (no default values)
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    locale_id: Mapped[UUID] = mapped_column(ForeignKey("locales.id", ondelete="CASCADE"))
    display_name: Mapped[str] = mapped_column(String(255))
    marketing_name: Mapped[str] = mapped_column(String(255))
    sku: Mapped[str] = mapped_column(String(100), index=True)
    image_url: Mapped[str] = mapped_column(String(512))
    packaging: Mapped[str] = mapped_column(Enum(PackagingTypeEnum))
    price: Mapped[int] = mapped_column(Integer)  # Store price in cents
    product_url: Mapped[str] = mapped_column(String(512))

    # Optional fields (with default values or nullable)
    vendor_color_ranges: Mapped[list[str]] = mapped_column(
        MutableList.as_mutable(ARRAY(String, dimensions=1)), default=[]
    )
    vendor_product_types: Mapped[list[str]] = mapped_column(
        MutableList.as_mutable(ARRAY(String, dimensions=1)), default=[]
    )
    discontinued: Mapped[bool | None] = mapped_column(Boolean, default=False)
    volume_ml: Mapped[float | None] = mapped_column(Float, default=None)
    volume_oz: Mapped[float | None] = mapped_column(Float, default=None)
    opacity: Mapped[str | None] = mapped_column(Enum(OpacityEnum), default=None)
    viscosity: Mapped[str | None] = mapped_column(Enum(ViscosityEnum), default=None)
    application_method: Mapped[str | None] = mapped_column(Enum(ApplicationMethodEnum), default=None)
    vendor_product_id: Mapped[str | None] = mapped_column(String(100), default=None)
