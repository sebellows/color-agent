from typing import TypeGuard, TypeVar

from advanced_alchemy.base import ModelProtocol
from advanced_alchemy.service.typing import ModelDictT
from pydantic import BaseModel


T = TypeVar("T", bound=ModelProtocol)


def is_pydantic_model(data: ModelDictT[T]) -> TypeGuard[T]:
    """Check if the data is a Pydantic model."""
    return isinstance(data, BaseModel)
