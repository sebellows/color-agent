from typing import TYPE_CHECKING, List

from advanced_alchemy.base import UUIDv7Base
from advanced_alchemy.mixins import SlugKey
from sqlalchemy import Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.enums import ProductTypeEnum
from api.domain.associations import product_product_type_association


if TYPE_CHECKING:
    from api.domain.product.models import Product


class ProductType(UUIDv7Base, SlugKey):
    __tablename__ = "product_types"

    name: Mapped[str] = mapped_column(Enum(ProductTypeEnum), unique=True)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_product_type_association, back_populates="product_types"
    )
