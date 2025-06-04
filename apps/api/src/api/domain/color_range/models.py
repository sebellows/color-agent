from typing import TYPE_CHECKING, List

from advanced_alchemy.base import UUIDv7Base
from advanced_alchemy.mixins import SlugKey
from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.enums import ColorRangeEnum
from api.domain.associations import product_color_range_association


if TYPE_CHECKING:
    from api.domain.product.models import Product


class ColorRange(UUIDv7Base, SlugKey):
    __tablename__ = "color_ranges"

    name: Mapped[str] = mapped_column(Enum(ColorRangeEnum), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_color_range_association, back_populates="color_ranges", lazy="selectin"
    )
