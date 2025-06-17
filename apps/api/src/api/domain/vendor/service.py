# from typing import Annotated, AsyncGenerator

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService

# from domain.dependencies import DatabaseSession
# from fastapi import Depends
# from sqlalchemy import select
from .models import Vendor


class VendorService(SQLAlchemyAsyncRepositoryService[Vendor]):
    """Service for managing blog posts with automatic schema validation."""

    class Repo(SQLAlchemyAsyncSlugRepository[Vendor], SQLAlchemyAsyncRepository[Vendor]):
        """Repository for Vendor model."""

        model_type = Vendor

    repository_type = Repo


# async def provide_vendors_service(db_session: DatabaseSession) -> AsyncGenerator[VendorService, None]:
#     """This provides the default Authors repository."""
#     async with VendorService.new(
#         session=db_session, statement=select(Vendor).where(Vendor.is_deleted.is_(False))
#     ) as service:
#         yield service


# Vendors = Annotated[VendorService, Depends(provide_vendors_service)]
