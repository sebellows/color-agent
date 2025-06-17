# from typing import Annotated, AsyncGenerator

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService

# from domain.dependencies import DatabaseSession
# from fastapi import Depends
# from sqlalchemy import select
from .models import ProductLine


class ProductLineService(SQLAlchemyAsyncRepositoryService[ProductLine]):
    """Service for managing Product Lines with automatic schema validation."""

    class Repo(SQLAlchemyAsyncSlugRepository[ProductLine], SQLAlchemyAsyncRepository[ProductLine]):
        """Repository for Product Line model."""

        model_type = ProductLine

    repository_type = Repo


# async def provide_product_lines_service(db_session: DatabaseSession) -> AsyncGenerator[ProductLineService, None]:
#     """This provides the default Product Lines service."""
#     async with ProductLineService.new(
#         session=db_session, statement=select(ProductLine).where(ProductLine.is_deleted.is_(False))
#     ) as service:
#         yield service


# ProductLines = Annotated[ProductLineService, Depends(provide_product_lines_service)]
