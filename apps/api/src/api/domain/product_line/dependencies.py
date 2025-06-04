from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import ProductLine
from .repository import ProductLineRepository


def provide_product_line_repository(
    db: AsyncSession = Depends(get_db),
) -> ProductLineRepository:
    """Dependency to provide ProductLineRepository instance."""
    return ProductLineRepository(
        session=db,
        statement=select(ProductLine).where(ProductLine.is_deleted.is_(False)),
    )
