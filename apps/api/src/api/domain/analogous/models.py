from typing import TYPE_CHECKING, List

from advanced_alchemy.base import UUIDv7Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.domain.associations import product_analogous_association


if TYPE_CHECKING:
    from product.models import Product


class Analogous(UUIDv7Base):
    __tablename__ = "analogous"

    name: Mapped[str] = mapped_column(String(100), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_analogous_association, back_populates="analogous", lazy="selectin"
    )
