from typing import Annotated, AsyncGenerator

from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.core.database import get_db

from .models import Product
from .repository import ProductRepository


# from uuid import UUID

# from advanced_alchemy.service.typing import ModelDictT, is_dict
# from advanced_alchemy.utils.text import slugify
# from uuid_utils import uuid7
# from ..helpers import is_pydantic_model
# from ..product_swatch import ProductSwatch
# from ..product_variant import ProductVariant
# from .schemas import ProductResponse, ProductUpdate

# if TYPE_CHECKING:
#     from api.domain.tag.models import Tag


class ProductService(SQLAlchemyAsyncRepositoryService[Product, ProductRepository]):
    """Service for managing blog posts with automatic schema validation."""

    repository_type = ProductRepository

    # Override creation behavior to handle tags
    # async def create(self, data: ModelDictT[Product], **kwargs) -> Product:
    #     """Create a new post with tags, if provided."""

    #     tags_added: list[str] = []
    #     if isinstance(data, dict):
    #         data["id"] = data.get("id", uuid7())
    #         tags_added = data.pop("tags", [])
    #     data = await self.to_model(data, "create")

    #     if tags_added:
    #         data.tags.extend(
    #             [
    #                 await Tag.as_unique_async(self.repository.session, name=tag_text, slug=slugify(tag_text))
    #                 for tag_text in tags_added
    #             ],
    #         )
    #     return await super().create(data=data, **kwargs)

    # # Override update behavior to handle tags
    # async def update(
    #     self,
    #     data: ModelDictT[Product],
    #     item_id: UUID | None = None,
    #     **kwargs,
    # ) -> Product:
    #     """Update a post with tags, if provided."""
    #     tags_updated: list[str] = []
    #     if isinstance(data, dict):
    #         tags_updated.extend(data.pop("tags", None) or [])
    #         data["id"] = item_id
    #         data = await self.to_model(data, "update")
    #         existing_tags = [tag.name for tag in data.tags]
    #         tags_to_remove = [tag for tag in data.tags if tag.name not in tags_updated]
    #         tags_to_add = [tag for tag in tags_updated if tag not in existing_tags]
    #         for tag_rm in tags_to_remove:
    #             data.tags.remove(tag_rm)
    #         data.tags.extend(
    #             [
    #                 await Tag.as_unique_async(self.repository.session, name=tag_text, slug=slugify(tag_text))
    #                 for tag_text in tags_to_add
    #             ],
    #         )

    #     return await super().update(data=data, item_id=item_id, **kwargs)

    # async def to_response(
    #     self, data: ModelDictT[Product], swatch: ModelDictT[ProductSwatch],
    # variants: list[ModelDictT[ProductVariant]], operation: str | None = None
    # ) -> ProductResponse:
    #     product = await self.to_model(data, operation)
    #     swatch = await ProductSwatch.as_unique_async(self.repository.session, **swatch)

    # async def to_model(self, data: ModelDictT[Product], operation: str | None = None) -> Product:
    #     """Convert a dictionary, msgspec Struct, or Pydantic model to a Post model."""
    #     if is_pydantic_model(data) and operation in {"create", "update"} and data.slug is None:
    #         data.slug = await self.repository.get_available_slug(data.name)
    #     if (
    #         is_dict(data)
    #         and "slug" not in data
    #         and (operation == "create" or ("name" in data and operation == "update"))
    #     ):
    #         data["slug"] = await self.repository.get_available_slug(data["name"])
    #     return await super().to_model(data, operation)


DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


async def provide_products_service(db_session: DatabaseSession) -> AsyncGenerator[ProductService, None]:
    """This provides the default Product Lines service."""
    async with ProductService.new(session=db_session) as service:
        yield service


Products = Annotated[ProductService, Depends(provide_products_service)]
