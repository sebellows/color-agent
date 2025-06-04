from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import Product


class ProductRepository(
    SQLAlchemyAsyncSlugRepository[Product], SQLAlchemyAsyncRepository[Product]
):
    """Repository for the Product model."""

    model_type = Product
