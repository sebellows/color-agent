from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .product_line import ProductLine


class Vendor(Base):
    __tablename__ = "vendors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    platform: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    pdp_slug: Mapped[str] = mapped_column(String(100))
    plp_slug: Mapped[str] = mapped_column(String(100))

    # Relationships
    product_lines: Mapped[List["ProductLine"]] = relationship(
        "ProductLine", back_populates="vendor", cascade="all, delete-orphan"
    )
