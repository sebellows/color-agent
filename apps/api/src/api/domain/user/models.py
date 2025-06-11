from pydantic import EmailStr
from sqlalchemy import UUID, ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column
from uuid_utils import uuid7

from api.core.models import Entity, WithFullTimeAuditMixin


class User(Entity, WithFullTimeAuditMixin):
    """User model."""

    __tablename__ = "users"

    email: Mapped[EmailStr] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool | None] = mapped_column(nullable=True)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    username: Mapped[str] = mapped_column(default=None, max_length=30, unique=True, index=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(default=None, max_length=60, nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(default=None, nullable=True)
    user_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid7,
    )
    # tier_id: Mapped[UUID | None] = mapped_column(ForeignKey("tier.id"), index=True, default=None, init=False)
