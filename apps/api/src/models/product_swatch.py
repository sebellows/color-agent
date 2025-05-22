from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, ARRAY, Float, Enum, UUID

# from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..core.enums import OverlayEnum
from .base import Base
from .mixins import UUIDMixin

if TYPE_CHECKING:
    from .product import Product


class ProductSwatch(Base, UUIDMixin):
    __tablename__ = "product_swatches"

    product_id: Mapped[UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), unique=True
    )
    hex_color: Mapped[str] = mapped_column(String(7))
    rgb_color: Mapped[list[int]] = mapped_column(ARRAY(Float))
    oklch_color: Mapped[list[float]] = mapped_column(ARRAY(Float))
    gradient_start: Mapped[list[float]] = mapped_column(ARRAY(Float))
    gradient_end: Mapped[list[float]] = mapped_column(ARRAY(Float))
    overlay: Mapped[str | None] = mapped_column(Enum(OverlayEnum))

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="swatch")
