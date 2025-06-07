from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import ProductSwatch
from .repository import ProductSwatchRepository


class ProductSwatchService(SQLAlchemyAsyncRepositoryService[ProductSwatch, ProductSwatchRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = ProductSwatchRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_product_swatches_service(db_session: DatabaseSession) -> AsyncGenerator[ProductSwatchService, None]:
    """This provides the default Authors repository."""
    async with ProductSwatchService.new(session=db_session) as service:
        yield service


ProductSwatchs = Annotated[ProductSwatchService, Depends(provide_product_swatches_service)]
