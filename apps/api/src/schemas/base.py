from collections.abc import Sequence
from typing import Generic, TypeVar, TYPE_CHECKING
from typing_extensions import TypeAlias
from pydantic import BaseModel, ConfigDict, conint

__all__ = [
    "Page",
    "PageResponse",
    "FilterParams",
]

T = TypeVar("T")

if TYPE_CHECKING:
    # GreaterEqualZero: TypeAlias = int
    Page: TypeAlias = int
else:
    # GreaterEqualZero: TypeAlias = conint(ge=0)
    Page: TypeAlias = conint(ge=1)


class PageResponse(BaseModel, Generic[T]):
    """Paginated response wrapper"""

    items: Sequence[T]
    total: int
    page: int
    size: int
    pages: int


class FilterParams(BaseModel):
    """Base filter parameters"""

    model_config = ConfigDict(extra="allow")

    skip: int | None = 0
    limit: int | None = 100
    sort_by: str | None = None
    sort_desc: bool | None = False
