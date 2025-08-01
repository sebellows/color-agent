# from typing import Annotated, AsyncGenerator

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService

# from domain.dependencies import DatabaseSession
# from fastapi import Depends
from .models import Tag


class TagService(SQLAlchemyAsyncRepositoryService[Tag]):
    """Service for managing blog posts with automatic schema validation."""

    class Repo(SQLAlchemyAsyncSlugRepository[Tag], SQLAlchemyAsyncRepository[Tag]):
        """Repository for Tag model."""

        model_type = Tag

    repository_type = Repo


# async def provide_tags_service(db_session: DatabaseSession) -> AsyncGenerator[TagService, None]:
#     """This provides the default Tags repository."""
#     async with TagService.new(session=db_session) as service:
#         yield service


# Tags = Annotated[TagService, Depends(provide_tags_service)]
