from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Locale
from .repository import LocaleRepository


class LocaleService(SQLAlchemyAsyncRepositoryService[Locale, LocaleRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = LocaleRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_locales_service(db_session: DatabaseSession) -> AsyncGenerator[LocaleService, None]:
    """This provides the default Authors repository."""
    async with LocaleService.new(session=db_session) as service:
        yield service


Locales = Annotated[LocaleService, Depends(provide_locales_service)]
