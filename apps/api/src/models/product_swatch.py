from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, ForeignKey, ARRAY, Float
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .product import Product


class ProductSwatch(Base):
    __tablename__ = "product_swatches"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), unique=True
    )
    hex_color: Mapped[str] = mapped_column(String(7))
    rgb_color: Mapped[List[int]] = mapped_column(ARRAY(Float))
    oklch_color: Mapped[List[float]] = mapped_column(ARRAY(Float))
    gradient_start: Mapped[List[float]] = mapped_column(ARRAY(Float))
    gradient_end: Mapped[List[float]] = mapped_column(ARRAY(Float))
    overlay: Mapped[Optional[str]] = mapped_column(String(50))

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="swatch")
