from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Product
from .repository import ProductRepository


class ProductService(SQLAlchemyAsyncRepositoryService[Product, ProductRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = ProductRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_products_service(db_session: DatabaseSession) -> AsyncGenerator[ProductService, None]:
    """This provides the default Product Lines service."""
    async with ProductService.new(session=db_session) as service:
        yield service


Products = Annotated[ProductService, Depends(provide_products_service)]
