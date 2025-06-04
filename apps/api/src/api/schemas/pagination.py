from collections.abc import Sequence
from dataclasses import dataclass, field
from typing import Generic, TypeVar

from advanced_alchemy.filters import LimitOffset
from advanced_alchemy.repository import SQLAlchemyAsyncRepository


# from pydantic import BaseModel

T = TypeVar("T")


@dataclass
class PaginatedResponse(Generic[T]):
    """Container for data returned using limit/offset pagination."""

    page: int  # current page number, starting from 1
    limit: int  # rows per page
    total: int = field(default=0)  # total number of rows/items in the dataset
    offset: int = field(default=0)  # number of rows to skip before returning results
    next: int | None = field(init=False, default=None)  # next page number, if available
    previous: int | None = field(init=False, default=None)  # previous page number, if available
    items: Sequence[T] = field(default_factory=list)

    def __post_init__(self):
        self.next = self.page + 1 if self.page * self.limit < self.total else None
        self.previous = self.page - 1 if self.page > 1 else None


async def get_paginated_list[T](
    repository: SQLAlchemyAsyncRepository,
    page: int = 1,
    limit: int = 100,
    *filters,
    **kwargs,
):
    offset = (page - 1) * limit if page > 0 else 0

    results, total = await repository.list_and_count(LimitOffset(offset=offset, limit=limit), *filters, **kwargs)

    return PaginatedResponse[T](
        items=results,
        page=page,
        total=total,
        limit=limit,
        offset=offset,
    )


# class FilterParams(BaseModel):
#     """Base filter parameters"""

#     skip: int | None = 0
#     limit: int | None = 100
#     sort_by: str | None = None
#     sort_desc: bool | None = False

#     class Config:
#         extra = "allow"
