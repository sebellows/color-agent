from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .repository import ProductSwatchRepository


def provide_product_swatch_repository(
    db: AsyncSession = Depends(get_db),
) -> ProductSwatchRepository:
    """Dependency to provide ProductSwatchRepository instance."""
    return ProductSwatchRepository(session=db)
