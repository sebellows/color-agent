from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import ProductVariant


class ProductVariantRepository(
    SQLAlchemyAsyncSlugRepository[ProductVariant],
    SQLAlchemyAsyncRepository[ProductVariant],
):
    """Repository for the Product Variant model."""

    model_type = ProductVariant
