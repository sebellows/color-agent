from advanced_alchemy.base import UUIDv7Base
from sqlalchemy.orm import Mapped, mapped_column


class Tier(UUIDv7Base):
    __tablename__ = "tiers"

    name: Mapped[str] = mapped_column(nullable=False, unique=True)
