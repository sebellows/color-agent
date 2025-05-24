from datetime import datetime, time
from typing import (
    TYPE_CHECKING,
    Any,
    Protocol,
    TypeVar,
    Union,
    runtime_checkable,
)
from uuid import UUID

from sqlalchemy import FromClause
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass, Mapper


@runtime_checkable
class ModelProtocol(Protocol):
    """
    The base SQLAlchemy model protocol.

    Attributes:
        __table__: The table associated with the model.
        __mapper__: The mapper for the model.
        __name__: The name of the model.
    """

    if TYPE_CHECKING:
        __table__: FromClause
        __mapper__: Mapper[Any]
        __name__: str

    """A set of attributes to exclude from JSON serialization."""
    __json_exclude__: set[str] = set()

    def to_dict(self) -> dict[str, Any]:
        """
        Convert model to dictionary.

        - Any attributes starting with "_" or in the "__json_exclude__" set
            will be excluded from the dictionary.
        - Attributes of type `time` or `datetime` will be converted to strings
            in ISO format.
        """
        ...

    def to_repr(self, column_names: list[str] = []):
        """Convert model to string representation."""
        ...


"""Type variable for SQLAlchemy models."""
ModelT = TypeVar("ModelT", bound=ModelProtocol)

# """Type variable for primary key of SQLAlchemy models."""
PrimaryKeyT = Union[str, int, tuple, dict, UUID]


class Base(AsyncAttrs, MappedAsDataclass, DeclarativeBase):
    """Base class for all SQLAlchemy models"""

    def to_dict(self):
        json_exclude = getattr(self, "__json_exclude__", set())
        class_dict = {
            key: value
            for key, value in self.__dict__.items()
            if not key.startswith("_") and key not in json_exclude
        }

        for key, value in class_dict.items():
            if isinstance(value, time) or isinstance(value, datetime):
                class_dict[key] = str(
                    value.isoformat(" ")
                )  # format time and make it a str

        return class_dict

    def to_repr(self, column_names: list[str] = []):
        model_name = self.__class__.__name__
        column_names.extend(
            ["id", "created_at", "updated_at", "deleted_at", "is_deleted"]
        )
        fields = [
            f"{col.name}={getattr(self, col.name)}"
            for col in self.__table__.columns
            if col.name in column_names
        ]
        return f"{model_name}({', '.join(fields)})"
