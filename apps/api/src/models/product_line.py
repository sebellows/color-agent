from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, Enum
from ..core.enums import ProductLineTypeEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .vendor import Vendor
    from .product import Product


class ProductLine(Base):
    __tablename__ = "product_lines"

    id: Mapped[int] = mapped_column(primary_key=True)
    vendor_id: Mapped[int] = mapped_column(ForeignKey("vendors.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    marketing_name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(100), index=True)
    vendor_slug: Mapped[Optional[str]] = mapped_column(String(100))
    product_line_type: Mapped[str] = mapped_column(Enum(ProductLineTypeEnum))
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="product_lines")
    products: Mapped[List["Product"]] = relationship(
        "Product", back_populates="product_line", cascade="all, delete-orphan"
    )
