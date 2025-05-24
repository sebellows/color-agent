from uuid import uuid4
from sqlalchemy import ForeignKey, UUID, text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base
from .mixins import CrudTimestampMixin, UUIDMixin


class User(Base, UUIDMixin, CrudTimestampMixin):
    """User model."""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool | None] = mapped_column(nullable=True)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    username: Mapped[str] = mapped_column(
        default=None, max_length=30, unique=True, index=True, nullable=False
    )
    full_name: Mapped[str | None] = mapped_column(
        default=None, max_length=60, nullable=False
    )
    avatar_url: Mapped[str | None] = mapped_column(default=None, nullable=True)
    user_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
        server_default=text("gen_random_uuid()"),
    )
    tier_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("tier.id"), index=True, default=None, init=False
    )

    def __repr__(self) -> str:
        """Return string representation of the user."""
        return self.to_repr(["full_name", "username", "avatar_url", "is_active"])
