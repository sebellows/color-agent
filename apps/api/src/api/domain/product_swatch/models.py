from typing import TYPE_CHECKING

from sqlalchemy import ARRAY, UUID, Enum, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.models import Entity
from api.domain.enums import OverlayEnum


if TYPE_CHECKING:
    from api.domain.product.models import Product


class ProductSwatch(Entity):
    __tablename__ = "product_swatches"

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="swatch")

    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    hex_color: Mapped[str] = mapped_column(String(7))
    rgb_color: Mapped[list[int]] = mapped_column(ARRAY(Float))
    oklch_color: Mapped[list[float]] = mapped_column(ARRAY(Float))
    gradient_start: Mapped[list[float]] = mapped_column(ARRAY(Float))
    gradient_end: Mapped[list[float]] = mapped_column(ARRAY(Float))
    overlay: Mapped[str | None] = mapped_column(Enum(OverlayEnum), default=OverlayEnum.Unknown)
