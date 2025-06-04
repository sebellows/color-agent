from typing import TYPE_CHECKING
from uuid import UUID

from advanced_alchemy.base import UUIDv7AuditBase
from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.enums import ProductLineTypeEnum
from api.core.models import SoftDeleteMixin, UniqueSlugMixin


if TYPE_CHECKING:
    from api.domain.product.models import Product
    from api.domain.vendor.models import Vendor


class ProductLine(UUIDv7AuditBase, SoftDeleteMixin, UniqueSlugMixin):
    __tablename__ = "product_lines"

    vendor_id: Mapped[UUID] = mapped_column(ForeignKey("vendors.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    marketing_name: Mapped[str] = mapped_column(String(255))
    vendor_slug: Mapped[str | None] = mapped_column(String(100))
    product_line_type: Mapped[str] = mapped_column(Enum(ProductLineTypeEnum))
    description: Mapped[str | None] = mapped_column(Text)

    # Relationships
    vendor: Mapped["Vendor"] = relationship("Vendor", back_populates="product_lines")
    products: Mapped[list["Product"]] = relationship(
        "Product",
        back_populates="product_line",
        cascade="all, delete",
        passive_deletes=True,
    )
