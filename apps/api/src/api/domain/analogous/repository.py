from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import Analogous


class AnalogousRepository(
    SQLAlchemyAsyncSlugRepository[Analogous], SQLAlchemyAsyncRepository[Analogous]
):
    """Repository for Analogous tag model."""

    model_type = Analogous
