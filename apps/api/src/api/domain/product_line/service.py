from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import ProductLine
from .repository import ProductLineRepository


class ProductLineService(SQLAlchemyAsyncRepositoryService[ProductLine, ProductLineRepository]):
    """Service for managing Product Lines with automatic schema validation."""

    repository_type = ProductLineRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_product_lines_service(db_session: DatabaseSession) -> AsyncGenerator[ProductLineService, None]:
    """This provides the default Product Lines service."""
    async with ProductLineService.new(session=db_session) as service:
        yield service


ProductLines = Annotated[ProductLineService, Depends(provide_product_lines_service)]
