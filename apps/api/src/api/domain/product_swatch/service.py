# from typing import Annotated, AsyncGenerator

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from advanced_alchemy.service.typing import ModelDictT

# from domain.dependencies import DatabaseSession
from domain.helpers import as_dict

# from fastapi import Depends
from utils.color.formatters import format_color

from .models import ProductSwatch
from .schemas import ProductSwatchResponse


class ProductSwatchService(SQLAlchemyAsyncRepositoryService[ProductSwatch]):
    """Service for managing blog posts with automatic schema validation."""

    class Repo(
        SQLAlchemyAsyncSlugRepository[ProductSwatch],
        SQLAlchemyAsyncRepository[ProductSwatch],
    ):
        """Repository for the Product Swatch model."""

        model_type = ProductSwatch

    repository_type = Repo

    async def to_valid_response(self, data: "ModelDictT[ProductSwatch]") -> ProductSwatchResponse:
        """Convert a list of float values to a valid CSS string."""
        swatch = as_dict(data)
        swatch["rgb_color"] = format_color(swatch["rgb_color"], "rgb")
        swatch["oklch_color"] = format_color(swatch["oklch_color"], "oklch")
        swatch["gradient_start"] = format_color(swatch["gradient_start"], "oklch")
        swatch["gradient_end"] = format_color(swatch["gradient_end"], "oklch")
        return ProductSwatchResponse.model_validate(swatch)


# async def provide_product_swatches_service(db_session: DatabaseSession) -> AsyncGenerator[ProductSwatchService, None]:
#     """This provides the default Product Swatches repository."""
#     async with ProductSwatchService.new(session=db_session) as service:
#         yield service


# ProductSwatches = Annotated[ProductSwatchService, Depends(provide_product_swatches_service)]
