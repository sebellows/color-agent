from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .repository import ProductTypeRepository


def provide_product_type_repository(
    db: AsyncSession = Depends(get_db),
) -> ProductTypeRepository:
    """Dependency to provide ProductTypeRepository instance."""
    return ProductTypeRepository(session=db)
