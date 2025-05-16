from typing import Generic, TypeVar, List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class PageResponse(BaseModel, Generic[T]):
    """Paginated response wrapper"""

    items: List[T]
    total: int
    page: int
    size: int
    pages: int


class FilterParams(BaseModel):
    """Base filter parameters"""

    model_config = ConfigDict(extra="allow")

    skip: Optional[int] = 0
    limit: Optional[int] = 100
    sort_by: Optional[str] = None
    sort_desc: Optional[bool] = False
