from advanced_alchemy.extensions.fastapi import filters
from fastapi import Depends, Query
from typing_extensions import Annotated


def provide_limit_offset_pagination(
    offset: int = Query(ge=0, default=0),
    limit: int = Query(ge=1, default=10, le=50),
) -> filters.LimitOffset:
    return filters.LimitOffset(limit, offset)


PaginatedResponse = Annotated[filters.LimitOffset, Depends(provide_limit_offset_pagination)]
