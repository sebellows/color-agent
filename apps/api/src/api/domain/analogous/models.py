from typing import TYPE_CHECKING, List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.models import Entity
from api.domain.associations import product_analogous_association


if TYPE_CHECKING:
    from product.models import Product


class Analogous(Entity):
    __tablename__ = "analogous"

    name: Mapped[str] = mapped_column(String(100), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_analogous_association, back_populates="analogous", viewonly=True
    )

    def __repr__(self):
        return f"{self.__class__.__name__}({self.name!r})"
