from datetime import datetime, timezone
from uuid import UUID
from uuid_utils import uuid7
from sqlalchemy.orm import declared_attr, mapped_column, Mapped

from ..types.datetime import DateTimeUTC


def tz_aware_datetime() -> datetime:
    """Return a timezone-aware datetime object."""
    return datetime.now(timezone.utc)


class UUIDMixin:
    """UUID Mixin for models."""

    id: Mapped[UUID] = mapped_column(
        init=False, primary_key=True, default_factory=uuid7
    )


class TimestampMixin:
    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTimeUTC,
            init=False,
            default_factory=tz_aware_datetime,
        )

    @declared_attr
    def updated_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTimeUTC,
            init=False,
            default_factory=tz_aware_datetime,
            onupdate=datetime.now(timezone.utc),
            # server_default=f"{datetime.now(timezone.utc)}",
        )


class SoftDeleteMixin:
    @declared_attr
    def deleted_at(cls) -> Mapped[datetime | None]:
        return mapped_column(
            DateTimeUTC,
            nullable=True,
            default=None,
            onupdate=datetime.now(timezone.utc),
        )

    @declared_attr
    def is_deleted(cls) -> Mapped[bool | None]:
        return mapped_column(index=True, nullable=True, default=False)


class CrudTimestampMixin(TimestampMixin, SoftDeleteMixin):
    pass
