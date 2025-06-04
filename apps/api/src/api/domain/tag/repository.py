from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import Tag


class TagRepository(SQLAlchemyAsyncSlugRepository[Tag], SQLAlchemyAsyncRepository[Tag]):
    """Repository for Tag model."""

    model_type = Tag
