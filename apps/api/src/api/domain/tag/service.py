from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Tag
from .repository import TagRepository


class TagService(SQLAlchemyAsyncRepositoryService[Tag, TagRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = TagRepository


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_tags_service(db_session: DatabaseSession) -> AsyncGenerator[TagService, None]:
    """This provides the default Tags repository."""
    async with TagService.new(session=db_session) as service:
        yield service


Tags = Annotated[TagService, Depends(provide_tags_service)]
