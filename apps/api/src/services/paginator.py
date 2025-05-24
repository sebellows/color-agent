from collections.abc import Sequence
from math import ceil

from ..models.base import ModelT
from ..schemas.base import PageResponse


class Paginator:
    @staticmethod
    def paginate(
        result_items: Sequence[ModelT],
        total: int,
        page: int,
        items_per_page: int,
    ) -> PageResponse[ModelT]:
        total_pages = 0 if total == 0 or total is None else ceil(total / items_per_page)

        current_page = 0 if len(result_items) == 0 else min(page, total_pages)

        return PageResponse(
            items=result_items,
            page=current_page,
            items_per_page=items_per_page,
            total=total,
            pages=total_pages,
        )
