import json
import sys
from pathlib import Path
from typing import Any, TypeVar
from uuid import UUID


sys.path.append(str(Path(__file__).parent.parent))

import asyncio

from advanced_alchemy.base import ModelProtocol
from advanced_alchemy.utils.text import slugify
from api.core.database import DB
from api.core.logger import get_logger, settings, setup_logging
from api.domain.analogous import (
    Analogous,
)
from api.domain.locale import provide_locales_service
from api.domain.product import (
    provide_products_service,
)
from api.domain.product_line import (
    ProductLineCreate,
    provide_product_lines_service,
)
from api.domain.product_swatch import (
    ProductSwatchCreate,
    provide_product_swatches_service,
)
from api.domain.product_variant import (
    ProductVariantCreate,
    provide_product_variants_service,
)
from api.domain.tag import Tag
from api.domain.vendor import (
    VendorCreate,
    provide_vendors_service,
)
from api.domain.enums import ProductLineTypeEnum
from sqlalchemy.ext.asyncio import AsyncSession


setup_logging(json_logs=settings.logger.LOG_JSON_FORMAT, log_level=settings.logger.LOG_LEVEL)
logger = get_logger(__name__)


T = TypeVar("T", bound=ModelProtocol)


async def import_vendor(session: AsyncSession, data: dict[str, Any]):
    locale_id: UUID | None = None

    async for vendor_service in provide_vendors_service(session):
        vendor_data = VendorCreate(
            name=data["vendor_name"],
            url=data["vendor_url"],
            slug=data["slug"],
            platform=data["platform"],
            description=data["description"],
            pdp_slug=data["pdp_slug"],
            plp_slug=data["plp_slug"],
        )
        vendor = await vendor_service.create(data=vendor_data)

        async for product_line_service in provide_product_lines_service(session):
            for product_line_item in data.get("product_lines", []):
                product_line_type = ProductLineTypeEnum.__members__.get(
                    product_line_item.get("product_line_type", "Mixed"), ProductLineTypeEnum.Mixed
                )
                product_line_name = product_line_item["product_line_name"]

                product_line_model = ProductLineCreate(
                    **{
                        "description": product_line_item.get("description", ""),
                        "marketing_name": product_line_item.get("marketing_name", product_line_name),
                        "name": product_line_name,
                        "slug": product_line_item.get("slug", slugify(product_line_name)),
                        "vendor_slug": product_line_item.get("vendor_slug", None),
                        "product_line_type": product_line_type,
                        "vendor_id": vendor.id,
                    }
                )
                product_line = await product_line_service.create(data=product_line_model)

                if not product_line:
                    raise ValueError(f"Failed to create or retrieve product line: {product_line_name}")

                async for product_service in provide_products_service(session):
                    for product_item in product_line_item.get("products", []):
                        product_name = product_item["name"]
                        enum_fields = product_service.get_valid_enum_fields(product_item)

                        product_model = await product_service.to_model(
                            {
                                "name": product_name,
                                "description": product_item.get("description", ""),
                                "iscc_nbs_category": product_item["iscc_nbs_category"],
                                "product_line_id": product_line.id,
                                "slug": slugify(product_name),
                                **enum_fields,
                            }
                        )

                        product_tags = product_item.get("tags", [])
                        if len(product_tags):
                            product_model.tags.extend(
                                [
                                    await Tag.as_unique_async(
                                        session,
                                        name=tag_item,
                                        slug=slugify(tag_item),
                                    )
                                    for tag_item in product_tags
                                ]
                            )

                        analogous_tags = product_item.get("analogous", [])
                        if len(analogous_tags) > 0:
                            product_model.analogous.extend(
                                [
                                    await Analogous.as_unique_async(
                                        session,
                                        name=tag_item,
                                        slug=slugify(tag_item),
                                    )
                                    for tag_item in analogous_tags
                                ]
                            )

                        product = await product_service.create(data=product_model)

                        async for swatch_service in provide_product_swatches_service(session):
                            if isinstance(product_swatch := product_item.get("swatch", None), dict):
                                swatch_data = ProductSwatchCreate(
                                    product_id=product.id,
                                    **product_swatch,
                                )
                                await swatch_service.create(data=swatch_data)

                        async for variant_service in provide_product_variants_service(session):
                            for variant_item in product_item.get("variants", []):
                                if locale_id is None:
                                    async for locale_service in provide_locales_service(session):
                                        current_locale = await locale_service.get_one(
                                            language_code=variant_item.get("language_code", "en"),
                                            country_code=variant_item.get("country_code", "US"),
                                        )
                                        if current_locale:
                                            locale_id = current_locale.id
                                if locale_id is None:
                                    raise ValueError(
                                        "Locale ID is not set. Ensure that locales are created before variants."
                                    )
                                variant_service.set_valid_enum_fields(variant_item)
                                variant = ProductVariantCreate(
                                    **variant_item,
                                    product_id=product.id,
                                    locale_id=locale_id,
                                )
                                await variant_service.create(data=variant)


async def import_data(data):
    db = DB.instance()

    async with db.session_factory() as session:
        try:
            session.begin()

            # await db.drop_all()
            await db.create_all()

            async for locale_service in provide_locales_service(session):
                locales = await locale_service.create_all()
                print(f"Locales created: {len(locales)}")

            print("Starting vendor creation...", type(data))

            if isinstance(data, list):
                for vendor_data in data:
                    print("Processing data...", vendor_data.get("vendor_name", "Unknown Vendor"))
                    await import_vendor(session, vendor_data)
            elif isinstance(data, dict):
                print("Processing data...", data.get("vendor_name", "Unknown Vendor"))
                await import_vendor(session, data)
            else:
                raise ValueError("Data must be a dictionary or a list of dictionaries.")
            print("Data import completed successfully.")

            await session.commit()
        except Exception as e:
            print(f"Error during vendor creation: {e}")
            await session.rollback()
            await db.engine.dispose()
            raise
        finally:
            await session.close()
            await db.engine.dispose()


async def setup_and_import():
    """Set up database and import data."""
    # Allow specifying the JSON file path as a command-line argument
    if len(sys.argv) > 1:
        json_path = sys.argv[1]
    else:
        json_path = f"{Path(__file__).parent.parent.parent.parent.parent}/vendor-data/"

    """Import data from JSON file."""
    # logger.info(f"Importing data from {json_path}.")

    paths = Path(json_path).glob("*.json")
    vendors = []

    for path in paths:
        if not path.is_file():
            print(f"Skipping non-file path: {path}")
            continue

        print(f"Importing data from {path}...")
        if not path.exists():
            print(f"File not found: {path}")
            continue

        # Read JSON file
        with open(path, "r") as file:
            data = json.load(file)

            if data:
                vendors.append(data)

    if len(vendors):
        await import_data(vendors)


if __name__ == "__main__":
    asyncio.run(setup_and_import())
