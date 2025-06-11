from typing import Annotated, AsyncGenerator, TypedDict
from uuid import UUID

from advanced_alchemy.repository import (
    SQLAlchemyAsyncRepository,
    SQLAlchemyAsyncSlugRepository,
)
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from fastapi import Depends
from sqlalchemy import select

from api.domain.dependencies import DatabaseSession
from api.domain.enums import ApplicationMethodEnum, OpacityEnum, PackagingTypeEnum, ViscosityEnum
from api.domain.helpers import enum_has, is_pydantic_model
from api.types import Unknown

from .models import ProductVariant


class ProductVariantEnumFields(TypedDict):
    """TypedDict for ProductVariant enum fields."""

    application_method: ApplicationMethodEnum
    opacity: OpacityEnum
    packaging_type: PackagingTypeEnum
    viscosity: ViscosityEnum


class ProductVariantService(SQLAlchemyAsyncRepositoryService[ProductVariant]):
    """Service for managing blog posts with automatic schema validation."""

    class ProductVariantRepository(
        SQLAlchemyAsyncSlugRepository[ProductVariant],
        SQLAlchemyAsyncRepository[ProductVariant],
    ):
        """Repository for the Product Variant model."""

        model_type = ProductVariant

    repository_type = ProductVariantRepository

    def set_valid_enum_fields(self, data) -> None:
        """Add categories to a product."""
        data = data if isinstance(data, dict) else data.to_dict() if is_pydantic_model(data) else Unknown

        if not isinstance(data, dict):
            data = {}

        application_method = data.pop("application_method", None)
        opacity = data.pop("opacity", None)
        packaging_type = data.pop("packaging_type", None)
        viscosity = data.pop("viscosity", None)

        # enum_fields: ProductVariantEnumFields = {
        data["application_method"] = (
            ApplicationMethodEnum[application_method]
            if enum_has(ApplicationMethodEnum, application_method)
            else ApplicationMethodEnum.Unknown
        )
        data["opacity"] = OpacityEnum[opacity] if enum_has(OpacityEnum, opacity) else OpacityEnum.Unknown
        data["packaging_type"] = (
            PackagingTypeEnum[packaging_type]
            if enum_has(PackagingTypeEnum, packaging_type)
            else PackagingTypeEnum.Unknown
        )
        data["viscosity"] = ViscosityEnum[viscosity] if enum_has(ViscosityEnum, viscosity) else ViscosityEnum.Unknown

    async def list_of_product_variants(
        self,
        product_id: UUID,
        locale_id: UUID,
        **kwargs,
    ):
        """List all product variants for a given product and locale."""
        return await self.list(
            statement=select(
                ProductVariant,
            ).where(
                ProductVariant.product_id == product_id,
                ProductVariant.locale_id == locale_id,
            ),
            **kwargs,
        )


async def provide_product_variants_service(db_session: DatabaseSession) -> AsyncGenerator[ProductVariantService, None]:
    """This provides the default Product Variant repository."""
    async with ProductVariantService.new(
        session=db_session, statement=select(ProductVariant).where(ProductVariant.is_deleted.is_(False))
    ) as service:
        yield service


ProductVariants = Annotated[ProductVariantService, Depends(provide_product_variants_service)]
