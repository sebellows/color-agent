from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import ProductVariant
from .repository import ProductVariantRepository


def provide_product_variant_repository(
    db: AsyncSession = Depends(get_db),
) -> ProductVariantRepository:
    """Dependency to provide ProductVariantRepository instance."""
    return ProductVariantRepository(
        session=db,
        statement=select(ProductVariant).where(ProductVariant.is_deleted.is_(False)),
    )
