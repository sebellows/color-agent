from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Vendor
from .repository import VendorRepository


class VendorService(SQLAlchemyAsyncRepositoryService[Vendor, VendorRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = VendorRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_vendors_service(db_session: DatabaseSession) -> AsyncGenerator[VendorService, None]:
    """This provides the default Authors repository."""
    async with VendorService.new(session=db_session) as service:
        yield service


Vendors = Annotated[VendorService, Depends(provide_vendors_service)]
