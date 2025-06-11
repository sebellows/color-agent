from typing import Annotated, AsyncGenerator, TypedDict
from uuid import UUID

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from advanced_alchemy.service.typing import ModelDictT
from advanced_alchemy.utils.text import slugify
from fastapi import Depends
from sqlalchemy import select

from api.domain.analogous.models import Analogous
from api.domain.dependencies import DatabaseSession
from api.domain.enums import ColorRangeEnum, ProductTypeEnum
from api.domain.helpers import enum_has
from api.domain.tag.models import Tag

from .models import Product


class ProductCategoryFields(TypedDict):
    """TypedDict for Product category fields."""

    product_type: list[ProductTypeEnum]
    color_range: list[ColorRangeEnum]


class ProductService(SQLAlchemyAsyncRepositoryService[Product]):
    """Service for managing blog posts with automatic schema validation."""

    class ProductRepository(SQLAlchemyAsyncSlugRepository[Product], SQLAlchemyAsyncRepository[Product]):
        """Repository for the Product model."""

        model_type = Product

    repository_type = ProductRepository

    async def create_product(
        self,
        data: "ModelDictT[Product]",
        **kwargs,
    ) -> Product:
        """Create a new product with validated enum fields."""

        tags: list[str] = []
        analogous_tags: list[str] = []
        # swatch: ModelDictT["ProductSwatch"] = {}
        # variants: list[ModelDictT["ProductVariant"]] = []

        if isinstance(data, dict):
            self.set_valid_enum_fields(data)
            data["slug"] = slugify(data.get("name", ""))
            tags = data.pop("tags", [])
            analogous_tags = data.pop("analogous", [])
            # swatch = data.pop("swatch", {})
            # variants = data.pop("variants", [])

        model = await self.to_model(data, "create")

        if tags:
            model.tags.extend(
                [await Tag.as_unique_async(self.repository.session, name=tag, slug=slugify(tag)) for tag in tags]
            )

        if analogous_tags:
            model.analogous.extend(
                [
                    await Analogous.as_unique_async(
                        self.repository.session,
                        name=tag,
                        slug=slugify(tag),
                    )
                    for tag in analogous_tags
                ]
            )

        # if swatch:
        #     if isinstance(swatch, dict):
        #         swatch["product_id"] = model.id

        #     swatch = await swatch_service.create(swatch)
        #     model.swatch = swatch

        # if variants:
        #     for variant in variants:
        #         if isinstance(variant, dict):
        #             variant["product_id"] = model.id
        #             variant["locale_id"] = locale_service.current_locale.id

        #     new_variants = await variant_service.create_many(variants, auto_commit=True)
        #     model.variants.extend(new_variants)

        return await super().create(model, **kwargs)

    async def update_product(
        self,
        data: "ModelDictT[Product]",
        item_id: UUID,
        **kwargs,
    ) -> Product:
        """Update existing product."""

        tags: list[str] = []
        analogous_tags: list[str] = []
        # swatch: ModelDictT["ProductSwatch"] = {}
        # variants: list[ModelDictT["ProductVariant"]] = []

        if isinstance(data, dict):
            self.set_valid_enum_fields(data)
            data["slug"] = slugify(data.get("name", ""))
            tags = data.pop("tags", [])
            analogous_tags = data.pop("analogous", [])
            # swatch = data.pop("swatch", {})
            # variants = data.pop("variants", [])

        model = await self.to_model(data, "update")

        if tags:
            model.tags.extend(
                [await Tag.as_unique_async(self.repository.session, name=tag, slug=slugify(tag)) for tag in tags]
            )

        if analogous_tags:
            model.analogous.extend(
                [
                    await Analogous.as_unique_async(
                        self.repository.session,
                        name=tag,
                        slug=slugify(tag),
                    )
                    for tag in analogous_tags
                ]
            )

        # if swatch:
        #     if isinstance(swatch, dict):
        #         swatch["product_id"] = model.id

        #     swatch = await swatch_service.update(swatch)
        #     model.swatch = swatch

        # if variants:
        #     await variant_service.update_many(variants, auto_commit=True)
        #     model_variants = await variant_service.list_of_product_variants(
        #         product_id=model.id,
        #         locale_id=locale_service.current_locale.id,
        #     )
        #     model.variants = list(model_variants)

        return await super().update(model, item_id=item_id, **kwargs)

    def set_valid_enum_fields(self, data: "ModelDictT[Product]") -> None:
        """Add categories to a product."""
        if not isinstance(data, dict):
            return None

        product_types = data.get("product_type", [])
        color_ranges = data.get("color_range", [])

        data["product_type"] = [ProductTypeEnum[pt] for pt in product_types if enum_has(ProductTypeEnum, pt)]
        if not len(data["product_type"]):
            data["product_type"] = [ProductTypeEnum.Acrylic]
        data["color_range"] = [ColorRangeEnum[cr] for cr in color_ranges if enum_has(ColorRangeEnum, cr)]
        if not len(data["color_range"]):
            print("No valid color range provided")
            raise ValueError(
                "At least one color range must be provided. Valid options are: "
                f"{', '.join([cr.value for cr in ColorRangeEnum])}"
            )

    def get_valid_enum_fields(self, data: "ModelDictT[Product]") -> ProductCategoryFields:
        """Add categories to a product."""
        if not isinstance(data, dict):
            raise TypeError("Data must be a dictionary.")

        product_types = data.get("product_type", [])
        color_ranges = data.get("color_range", [])

        product_type = [ProductTypeEnum[pt] for pt in product_types if enum_has(ProductTypeEnum, pt)]
        if not len(product_type):
            product_type = [ProductTypeEnum.Acrylic]
        color_range = [ColorRangeEnum[cr] for cr in color_ranges if enum_has(ColorRangeEnum, cr)]
        if not len(color_range):
            print("No valid color range provided")
            raise ValueError(
                "At least one color range must be provided. Valid options are: "
                f"{', '.join([cr.value for cr in ColorRangeEnum])}"
            )

        return {
            "product_type": product_type,
            "color_range": color_range,
        }


async def provide_products_service(db_session: DatabaseSession) -> AsyncGenerator[ProductService, None]:
    """This provides the default Product Lines service."""
    async with ProductService.new(
        session=db_session, statement=select(Product).where(Product.is_deleted.is_(False))
    ) as service:
        yield service


Products = Annotated[ProductService, Depends(provide_products_service)]
