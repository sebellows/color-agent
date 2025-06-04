from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Product
from .repository import ProductRepository


def provide_product_repository(
    db: AsyncSession = Depends(get_db),
) -> ProductRepository:
    """Dependency to provide ProductRepository instance."""
    return ProductRepository(
        session=db,
        statement=select(Product).where(Product.is_deleted.is_(False)),
    )
