from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import ColorRange


class ColorRangeRepository(
    SQLAlchemyAsyncSlugRepository[ColorRange], SQLAlchemyAsyncRepository[ColorRange]
):
    """Repository for Color Range category model."""

    model_type = ColorRange
