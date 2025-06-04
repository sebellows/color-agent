from typing import TYPE_CHECKING, List

from advanced_alchemy.base import UUIDv7Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.core.models import UniqueSlugMixin
from api.domain.associations import product_tag_association


if TYPE_CHECKING:
    from api.domain.product.models import Product


class Tag(UUIDv7Base, UniqueSlugMixin):
    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    type: Mapped[str] = mapped_column(String(50), nullable=True, unique=False)

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=product_tag_association, back_populates="tags"
    )
