from enum import Enum, EnumType
from typing import Any, TypeVar

from advanced_alchemy.base import ModelProtocol
from advanced_alchemy.repository.typing import ModelT
from advanced_alchemy.service.typing import ModelDictT, is_dict, is_pydantic_model, is_schema
from pydantic import BaseModel


T = TypeVar("T", bound=ModelProtocol)


EnumT = TypeVar("EnumT", bound=EnumType)


def enum_has(enum_class, value: str) -> bool:
    """
    Check if the enum class has a member with the given value.
    """
    return isinstance(enum_class, EnumType) and value in enum_class._value2member_map_


def get_enum_value(enum_class: EnumT, name: str | None, default: str | None = None) -> EnumT:
    """Get a valid enum member from a string value."""

    if not isinstance(enum_class, Enum):
        raise TypeError(f"Expected an Enum class, got {type(enum_class)}")

    if name and enum_has(enum_class, name):
        return getattr(enum_class, name)

    if default and enum_has(enum_class, default):
        return getattr(enum_class, default)

    raise ValueError(f"Value '{name}' is not a valid member of {enum_class.__name__} and no default provided")


def get_enum_values(enum_class: EnumT, datalist: list[str], default: str | None = None) -> list[EnumT]:
    """Get a valid enum member from a string value."""

    if not isinstance(enum_class, Enum):
        raise TypeError(f"Expected an Enum class, got {type(enum_class)}")

    if len(datalist) == 0 and (isinstance(default, str)):
        if enum_has(enum_class, default):
            return [getattr(enum_class, default)]
        else:
            raise ValueError(f"Default value '{default}' is not a valid member of {enum_class.__name__}")

    values = set(item.value for item in enum_class)
    items = [item for item in datalist if item in values]
    return [enum_class[item] for item in items if enum_has(enum_class, item)]


def from_dict(
    data: ModelDictT,
) -> dict[str, Any]:
    """Convert a dictionary to a model instance."""
    if is_dict(data):
        return data
    if is_pydantic_model(data):
        return data.model_dump()
    if is_schema(data):
        return data.model_dump()

    raise TypeError(f"Expected a dict or a Pydantic model, got {type(data)}")
