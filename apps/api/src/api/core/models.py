import re
from collections.abc import Hashable
from datetime import datetime, time, timezone

from advanced_alchemy.mixins import SlugKey, UniqueMixin
from advanced_alchemy.utils.text import slugify
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    MappedAsDataclass,
    declarative_mixin,
    declared_attr,
    mapped_column,
    validates,
)
from sqlalchemy.sql.elements import ColumnElement


# from ..types import DateTimeUTC


__all__ = ["Base", "SoftDeleteMixin", "UniqueSlugMixin"]


"""Regular expression for table name"""
table_name_regexp = re.compile(r"((?<=[a-z0-9])[A-Z]|(?!^)[A-Z](?=[a-z]))")


class Base(AsyncAttrs, MappedAsDataclass, DeclarativeBase):
    """Base class for all SQLAlchemy models"""

    """A set of attributes to exclude from JSON serialization."""
    __json_exclude__: set[str] | None

    def __json__(self, request):
        json_exclude = getattr(self, "__json_exclude__", set())
        return {
            key: value
            for key, value in self.__dict__.items()
            # Do not serialize 'private' attributes
            # (SQLAlchemy-internal attributes are among those, too)
            if not key.startswith("_") and key not in json_exclude
        }

    def to_dict(self):
        json_exclude = getattr(self, "__json_exclude__", set())
        class_dict = {
            key: value for key, value in self.__dict__.items() if not key.startswith("_") and key not in json_exclude
        }

        for key, value in class_dict.items():
            if isinstance(value, time) or isinstance(value, datetime):
                class_dict[key] = str(value.isoformat(" "))  # format time and make it a str

        return class_dict

    def to_repr(self, column_names: list[str] = []) -> str:
        model_name = self.__class__.__name__
        column_names.extend(["id", "created_at", "updated_at", "deleted_at", "is_deleted"])
        fields = [f"{col.name}={getattr(self, col.name)}" for col in self.__table__.columns if col.name in column_names]
        return f"{model_name}({', '.join(fields)})"


@declarative_mixin
class SoftDeleteMixin:
    __abstract__ = True

    @declared_attr
    def deleted_at(cls) -> Mapped[datetime | None]:
        return mapped_column(
            # DateTimeUTC(timezone=True),
            nullable=True,
            default=None,
            onupdate=datetime.now(timezone.utc),
        )

    @declared_attr
    def is_deleted(cls) -> Mapped[bool | None]:
        return mapped_column(index=True, nullable=True, default=False)

    @validates("deleted_at")
    def validate_tz_info(self, _: str, value: datetime) -> datetime:
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value


@declarative_mixin
class UniqueSlugMixin(SlugKey, UniqueMixin):
    """Mixin to add a unique slug column for SQLAlchemy models."""

    @classmethod
    def unique_hash(cls, name: str, slug: str | None = None) -> Hashable:
        """Generate a unique hash for deduplication."""
        return slugify(name)

    @classmethod
    def unique_filter(
        cls,
        name: str,
        slug: str | None = None,
    ) -> ColumnElement[bool]:
        """SQL filter for finding existing records."""
        return cls.slug == slugify(name)
