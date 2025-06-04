from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import ProductLine


class ProductLineRepository(
    SQLAlchemyAsyncSlugRepository[ProductLine], SQLAlchemyAsyncRepository[ProductLine]
):
    """Repository for Product Line model."""

    model_type = ProductLine
