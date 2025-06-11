from typing import Annotated, AsyncGenerator

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends

from api.domain.dependencies import DatabaseSession

from .models import Analogous


class AnalogousService(SQLAlchemyAsyncRepositoryService[Analogous]):
    """Service for managing blog posts with automatic schema validation."""

    class AnalogousRepository(SQLAlchemyAsyncSlugRepository[Analogous], SQLAlchemyAsyncRepository[Analogous]):
        """Repository for Analogous tag model."""

        model_type = Analogous

    repository_type = AnalogousRepository


async def provide_analogous_service(db_session: DatabaseSession) -> AsyncGenerator[AnalogousService, None]:
    """This provides the default Authors repository."""
    async with AnalogousService.new(session=db_session) as service:
        yield service


AnalogousTags = Annotated[AnalogousService, Depends(provide_analogous_service)]
