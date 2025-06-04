from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import ProductType


class ProductTypeRepository(
    SQLAlchemyAsyncSlugRepository[ProductType], SQLAlchemyAsyncRepository[ProductType]
):
    """Repository for Product Type category model."""

    model_type = ProductType
