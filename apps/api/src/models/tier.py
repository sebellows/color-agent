from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .mixins import UUIDMixin


class Tier(Base, UUIDMixin):
    __tablename__ = "tiers"

    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    def __repr__(self) -> str:
        return self.to_repr(["name"])
