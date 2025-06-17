# from typing import Annotated, AsyncGenerator

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService

# from domain.dependencies import DatabaseSession
# from fastapi import Depends
# from sqlalchemy import select
from .models import Analogous


class AnalogousService(SQLAlchemyAsyncRepositoryService[Analogous]):
    """Service for managing blog posts with automatic schema validation."""

    class Repo(SQLAlchemyAsyncSlugRepository[Analogous], SQLAlchemyAsyncRepository[Analogous]):
        """Repository for Analogous tag model."""

        model_type = Analogous

    repository_type = Repo


# async def provide_analogous_service(db_session: DatabaseSession) -> AsyncGenerator[AnalogousService, None]:
#     """This provides the default Analogous tags repository."""
#     async with AnalogousService.new(session=db_session, statement=select(Analogous)) as service:
#         yield service


# AnalogousTags = Annotated[AnalogousService, Depends(provide_analogous_service)]
