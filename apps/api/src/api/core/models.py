from datetime import datetime, timezone
from functools import partial
from uuid import UUID

from advanced_alchemy.base import CommonTableAttributes, orm_registry
from advanced_alchemy.mixins import SlugKey, UniqueMixin
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    MappedAsDataclass,
    declarative_mixin,
    declared_attr,
    mapped_column,
    orm_insert_sentinel,
    validates,
)
from uuid_utils.compat import uuid7

from .types import DateTimeUTC


@declarative_mixin
class WithUUIDMixin(MappedAsDataclass, init=False):
    """UUID Primary Key Field Mixin."""

    @declared_attr
    def id(cls) -> Mapped[UUID]:
        return mapped_column(primary_key=True, default=uuid7)

    @declared_attr
    def _sentinel(cls) -> Mapped[int]:
        """Sentinel value required for SQLAlchemy bulk DML with UUIDs."""
        return orm_insert_sentinel(name="sa_orm_sentinel")


class Entity(WithUUIDMixin, MappedAsDataclass, CommonTableAttributes, DeclarativeBase, AsyncAttrs, init=False):
    __abstract__ = True

    registry = orm_registry


@declarative_mixin
class WithUniqueSlugMixin(MappedAsDataclass, SlugKey, UniqueMixin, init=False):
    """Slug unique Field Model Mixin."""

    pass


@declarative_mixin
class WithTimeAuditMixin(MappedAsDataclass, init=False):
    """Date/time of instance creation."""

    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTimeUTC(timezone=True),
            nullable=False,
            insert_default=partial(datetime.now, timezone.utc),
        )

    """Date/time of instance last update."""

    @declared_attr
    def updated_at(cls) -> Mapped[datetime]:
        return mapped_column(
            DateTimeUTC(timezone=True),
            nullable=False,
            insert_default=partial(datetime.now, timezone.utc),
            onupdate=partial(datetime.now, timezone.utc),
        )

    @validates("created_at", "updated_at")
    def validate_tz_info(self, _: str, value: datetime) -> datetime:
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value


@declarative_mixin
class WithFullTimeAuditMixin(WithTimeAuditMixin, init=False):
    @declared_attr
    def deleted_at(cls) -> Mapped[datetime | None]:
        return mapped_column(
            DateTimeUTC(timezone=True),
            nullable=True,
            onupdate=partial(datetime.now, timezone.utc),
        )

    @declared_attr
    def is_deleted(cls) -> Mapped[bool | None]:
        return mapped_column(index=True, nullable=True, insert_default=False)

    # def __post_init__(self, *args: Any, **kwargs: Any) -> None:
    #     """Set default values for soft delete fields."""
    #     if isinstance(self.deleted_at, datetime) and not self.is_deleted:
    #         self.is_deleted = True
    # elif self.deleted_at is None and self.is_deleted is None:
    #     self.is_deleted = False

    @validates("deleted_at")
    def validate_tz_info(self, _: str, value: datetime) -> datetime:
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value
