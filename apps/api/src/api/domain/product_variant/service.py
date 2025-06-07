from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import ProductVariant
from .repository import ProductVariantRepository


class ProductVariantService(SQLAlchemyAsyncRepositoryService[ProductVariant, ProductVariantRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = ProductVariantRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_product_variants_service(db_session: DatabaseSession) -> AsyncGenerator[ProductVariantService, None]:
    """This provides the default Product Variant repository."""
    async with ProductVariantService.new(session=db_session) as service:
        yield service


ProductVariants = Annotated[ProductVariantService, Depends(provide_product_variants_service)]
