from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import ProductSwatch


class ProductSwatchRepository(
    SQLAlchemyAsyncSlugRepository[ProductSwatch],
    SQLAlchemyAsyncRepository[ProductSwatch],
):
    """Repository for the Product Swatch model."""

    model_type = ProductSwatch
