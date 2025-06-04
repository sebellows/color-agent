from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)

from .models import Vendor


class VendorRepository(
    SQLAlchemyAsyncSlugRepository[Vendor], SQLAlchemyAsyncRepository[Vendor]
):
    """Repository for Vendor model."""

    model_type = Vendor
