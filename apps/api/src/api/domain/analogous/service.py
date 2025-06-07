from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Analogous
from .repository import AnalogousRepository


class AnalogousService(SQLAlchemyAsyncRepositoryService[Analogous, AnalogousRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = AnalogousRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_analogous_service(db_session: DatabaseSession) -> AsyncGenerator[AnalogousService, None]:
    """This provides the default Authors repository."""
    async with AnalogousService.new(session=db_session) as service:
        yield service


Analogous = Annotated[AnalogousService, Depends(provide_analogous_service)]
