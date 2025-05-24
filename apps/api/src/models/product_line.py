from typing import TYPE_CHECKING
from uuid import UUID
from sqlalchemy import String, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.enums import ProductLineTypeEnum
from .mixins import CrudTimestampMixin, UUIDMixin
from .base import Base

if TYPE_CHECKING:
    from .vendor import Vendor
    from .product import Product


class ProductLine(Base, UUIDMixin, CrudTimestampMixin):
    __tablename__ = "product_lines"

    vendor_id: Mapped[UUID] = mapped_column(
        ForeignKey("vendors.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    marketing_name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(100), index=True)
    vendor_slug: Mapped[str | None] = mapped_column(String(100))
    product_line_type: Mapped[str] = mapped_column(Enum(ProductLineTypeEnum))
    description: Mapped[str | None] = mapped_column(Text)

    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="product_lines")
    products: Mapped[list["Product"]] = relationship(
        "Product", back_populates="product_line", cascade="all, delete-orphan"
    )
