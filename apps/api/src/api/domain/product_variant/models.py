from dataclasses import dataclass
from typing import TYPE_CHECKING

from core.models import Entity, WithFullTimeAuditMixin
from domain.enums import ApplicationMethodEnum, OpacityEnum, PackagingTypeEnum, ViscosityEnum
from sqlalchemy import UUID, Boolean, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship


if TYPE_CHECKING:
    from domain.locale.models import Locale
    from domain.product.models import Product


@dataclass
class ProductVariant(Entity, WithFullTimeAuditMixin):
    __tablename__ = "product_variants"

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    locale: Mapped["Locale"] = relationship("Locale", back_populates="variants")

    # Required fields (no default values)
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    locale_id: Mapped[UUID] = mapped_column(ForeignKey("locales.id"))  # , ondelete="CASCADE"
    display_name: Mapped[str] = mapped_column(String(255))
    marketing_name: Mapped[str] = mapped_column(String(255))
    sku: Mapped[str] = mapped_column(String(100), index=True)
    image_url: Mapped[str] = mapped_column(String(512))
    packaging: Mapped[Enum] = mapped_column(Enum(PackagingTypeEnum))
    price: Mapped[int] = mapped_column(Integer)  # Store price in cents
    product_url: Mapped[str] = mapped_column(String(512))

    # Optional fields (with default values or nullable)
    vendor_color_range: Mapped[list[str]] = mapped_column(
        MutableList.as_mutable(ARRAY(String, dimensions=1)), default_factory=list
    )
    vendor_product_type: Mapped[list[str]] = mapped_column(
        MutableList.as_mutable(ARRAY(String, dimensions=1)), default_factory=list
    )
    discontinued: Mapped[bool | None] = mapped_column(Boolean, default=False)
    volume_ml: Mapped[float | None] = mapped_column(Float, default=None)
    volume_oz: Mapped[float | None] = mapped_column(Float, default=None)
    application_method: Mapped[Enum | None] = mapped_column(
        Enum(ApplicationMethodEnum), default=ApplicationMethodEnum.Unknown
    )
    opacity: Mapped[Enum | None] = mapped_column(Enum(OpacityEnum), default=OpacityEnum.Unknown)
    viscosity: Mapped[Enum | None] = mapped_column(Enum(ViscosityEnum), default=ViscosityEnum.Unknown)
    vendor_product_id: Mapped[str | None] = mapped_column(String(100), default=None)
