from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .repository import ColorRangeRepository


def provide_color_range_repository(
    db: AsyncSession = Depends(get_db),
) -> ColorRangeRepository:
    """Dependency to provide ProductVariantRepository instance."""
    return ColorRangeRepository(session=db)
