from collections.abc import Sequence
from typing import (
    TYPE_CHECKING,
    Generic,
    TypeVar,
    Union,
)

from pydantic import BaseModel, StrictInt, StrictStr, conint
from typing_extensions import TypeAlias


"""Type variable for SQLAlchemy models."""
SchemaT = TypeVar("SchemaT")

__all__ = [
    "Page",
    "PageResponse",
    "FilterParams",
]

if TYPE_CHECKING:
    Page: TypeAlias = int
else:
    Page: TypeAlias = conint(ge=1)


class PageResponse(BaseModel, Generic[SchemaT]):
    """Paginated response wrapper"""

    items: Sequence[SchemaT]
    total: int
    page: int
    items_per_page: int
    pages: int

    @property
    def has_next(self) -> bool:
        """Check if there is a next page"""
        return self.page < self.pages

    @property
    def has_prev(self) -> bool:
        """Check if there is a previous page"""
        return self.page > 1


class CursorReference(BaseModel):
    column: str
    value: Union[StrictStr, StrictInt]


class CursorResponse(BaseModel, Generic[SchemaT]):
    """
    The result of a cursor paginated query.

    PARAMS:
    -------
    items_per_page: The maximum number of items in a page.
    total_items: The total items in all the pages.
    has_next_page: True if there is a next page.
    has_previous_page: True if there is a previous page.
    start_cursor: The cursor pointing to the first item in the page,
        if at least one item is returned.
    end_cursor: The cursor pointing to the last item in the page,
        if at least one item is returned.
    """

    items: Sequence[SchemaT]
    total: int
    page: int
    items_per_page: int
    pages: int

    start_cursor: CursorReference | None = None
    end_cursor: CursorReference | None = None

    @property
    def has_next(self) -> bool:
        """Check if there is a next page"""
        return self.page < self.pages

    @property
    def has_prev(self) -> bool:
        """Check if there is a previous page"""
        return self.page > 1


class FilterParams(BaseModel):
    """Base filter parameters"""

    skip: int | None = 0
    limit: int | None = 100
    sort_by: str | None = None
    sort_desc: bool | None = False

    class Config:
        """Pydantic configuration"""

        extra = "allow"
