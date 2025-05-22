from datetime import datetime, timezone
from uuid import UUID
from uuid_utils import uuid7
from sqlalchemy.orm import declared_attr, mapped_column, Mapped

from apps.api.src.types.datetime import DateTimeUTC


class UUIDMixin:
    """UUID Mixin for models."""

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid7)


class TimestampMixin:
    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTimeUTC,
            default=datetime.now(timezone.utc),
            server_default=f"{datetime.now(timezone.utc)}",
        )

    @declared_attr
    def updated_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTimeUTC,
            nullable=True,
            onupdate=datetime.now(timezone.utc),
            server_default=f"{datetime.now(timezone.utc)}",
        )


class SoftDeleteMixin:
    @declared_attr
    def deleted_at(cls) -> Mapped[datetime | None]:
        return mapped_column(
            DateTimeUTC, nullable=True, onupdate=datetime.now(timezone.utc)
        )

    @declared_attr
    def is_deleted(cls) -> Mapped[bool | None]:
        return mapped_column(index=True, nullable=True)


class CrudTimestampMixin(TimestampMixin, SoftDeleteMixin):
    pass
