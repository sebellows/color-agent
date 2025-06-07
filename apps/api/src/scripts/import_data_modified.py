"""Script to import sample data from JSON file."""

import sys
from pathlib import Path


sys.path.append(str(Path(__file__).parent.parent))


import asyncio
import json
import sys
from pathlib import Path

from advanced_alchemy.repository import SQLAlchemyAsyncRepository
from api.core.database import DB
from api.core.enums import ApplicationMethodEnum, OpacityEnum, PackagingTypeEnum, ViscosityEnum
from api.core.logger import get_logger, settings, setup_logging
from api.domain.analogous import provide_analogous_repository
from api.domain.locale import provide_locale_repository
from api.domain.product import provide_product_repository
from api.domain.product_line import provide_product_line_repository
from api.domain.product_swatch import provide_product_swatch_repository
from api.domain.product_variant import provide_product_variant_repository
from api.domain.tag import provide_tag_repository
from api.domain.vendor import provide_vendor_repository
from api.utils.string import slugify


setup_logging(json_logs=settings.logger.LOG_JSON_FORMAT, log_level=settings.logger.LOG_LEVEL)
logger = get_logger(__name__)


providers = {
    "analogous": provide_analogous_repository,
    "locale": provide_locale_repository,
    "product_line": provide_product_line_repository,
    "product": provide_product_repository,
    "product_swatch": provide_product_swatch_repository,
    "product_variant": provide_product_variant_repository,
    "tag": provide_tag_repository,
    "vendor": provide_vendor_repository,
}


async def get_or_create(provider: SQLAlchemyAsyncRepository, **kwargs):
    """Get or create a record."""
    instance, created = await provider.get_or_upsert(**kwargs)

    if created:
        logger.info(f"Created new instance: {instance}")
    else:
        logger.info(f"Found existing instance: {instance}")

    return instance


async def import_data(json_path):
    """Import data from JSON file."""
    logger.info(f"Importing data from {json_path}.")

    # Read JSON file
    with open(json_path, "r") as f:
        data = json.load(f)

    db = DB.instance()

    async with db.session_factory() as session:
        try:
            session.begin()
            # yield session
            # await db.drop_all()
            await db.create_all()

            # Process each vendor
            for vendor_data in data:
                # Create vendor
                vendor = await get_or_create(
                    provider=providers["vendor"](session),
                    name=vendor_data["vendor_name"],
                    url=vendor_data["vendor_url"],
                    slug=vendor_data["slug"],
                    platform=vendor_data["platform"],
                    description=vendor_data["description"],
                    pdp_slug=vendor_data["pdp_slug"],
                    plp_slug=vendor_data["plp_slug"],
                )
                logger.info(f"Processed vendor: {vendor.name}")

                # Process product lines
                for product_line_data in vendor_data.get("product_lines", []):
                    product_line = await get_or_create(
                        provider=providers["product_line"](session),
                        # vendor_id=vendor.id,
                        name=product_line_data["product_line_name"],
                        marketing_name=product_line_data["marketing_name"],
                        slug=product_line_data["slug"],
                        vendor_slug=product_line_data["vendor_slug"],
                        product_line_type=product_line_data["product_line_type"],
                        description=product_line_data.get("description", ""),
                    )
                    logger.info(f"Processed product line: {product_line.name}")

                    # Process products
                    for product_data in product_line_data.get("products", []):
                        # Create product - using 'name' instead of 'product_name'
                        product = await get_or_create(
                            provider=providers["product"](session),
                            name=product_data["name"],  # Changed from product_name to name
                            iscc_nbs_category=product_data.get("iscc_nbs_category"),
                            slug=product_data.get("slug", slugify(product_data["name"])),
                        )
                        logger.info(f"Processed product: {product.name}")

                        # Create product swatch
                        swatch_data = product_data.get("swatch", {})
                        if swatch_data:
                            await get_or_create(
                                provider=providers["product_swatch"](session),
                                hex_color=swatch_data.get("hex_color", "#000000"),
                                rgb_color=swatch_data.get("rgb_color", [0, 0, 0]),
                                oklch_color=swatch_data.get("oklch_color", [0, 0, 0]),
                                gradient_start=swatch_data.get("gradient_start", [0, 0, 0]),
                                gradient_end=swatch_data.get("gradient_end", [0, 0, 0]),
                                overlay=swatch_data.get("overlay"),
                            )
                            logger.info(f"Processed swatch for product: {product.name}")

                        # Process product types
                        # for type_name in product_data.get("product_type", []):
                        #     product_type = await get_or_create(
                        #         provider=providers["product_type"](session), name=type_name, slug=slugify(type_name)
                        #     )
                        #     product.product_type.append(product_type)

                        # Process color ranges
                        # for color_name in product_data.get("color_range", []):
                        #     color_range = await get_or_create(
                        #         provider=providers["color_range"](session), name=color_name, slug=slugify(color_name)
                        #     )
                        #     product.color_range.append(color_range)

                        # Process tags
                        for tag_name in product_data.get("tags", []):
                            tag = await get_or_create(
                                provider=providers["tag"](session), name=tag_name, slug=slugify(tag_name)
                            )
                            product.tags.append(tag)

                        # Process analogous
                        for analogous_name in product_data.get("analogous", []):
                            analogous = await get_or_create(
                                provider=providers["analogous"](session), name=analogous_name
                            )
                            product.analogous.append(analogous)

                        # Process variants
                        for variant_data in product_data.get("variants", []):
                            # Get or create locale
                            language_code = variant_data.get("language_code", "en")
                            country_code = variant_data.get("country_code", "US")
                            await get_or_create(
                                provider=providers["locale"](session),
                                language_code=language_code,
                                country_code=country_code,
                                currency_code=variant_data.get("currency_code", "USD"),
                                currency_symbol=variant_data.get("currency_symbol", "$"),
                                slug=f"{language_code}-{country_code}",
                            )

                            packaging_val = variant_data.get("packaging", "Bottle")
                            packaging = PackagingTypeEnum.__members__.get(packaging_val, PackagingTypeEnum.Bottle)
                            opacity = OpacityEnum.__members__.get(variant_data.get("opacity"), OpacityEnum.Opaque)
                            viscosity = ViscosityEnum.__members__.get(
                                variant_data.get("viscosity"), ViscosityEnum.Medium
                            )
                            application_method = ApplicationMethodEnum.__members__.get(
                                variant_data.get("application_method"), None
                            )
                            # Create variant
                            variant = await get_or_create(
                                provider=providers["product_variant"](session),
                                # product_id=product.id,
                                # locale_id=locale.id,
                                display_name=variant_data.get("display_name", ""),
                                marketing_name=variant_data.get("marketing_name", ""),
                                sku=variant_data.get("sku", ""),
                                discontinued=variant_data.get("discontinued", False),
                                image_url=variant_data.get("image_url", ""),
                                packaging=packaging,
                                volume_ml=variant_data.get("volume_ml"),
                                volume_oz=variant_data.get("volume_oz"),
                                price=variant_data.get("price", 0),
                                product_url=variant_data.get("product_url", ""),
                                opacity=opacity,
                                viscosity=viscosity,
                                application_method=application_method,
                                vendor_product_id=variant_data.get("vendor_product_id"),
                                vendor_color_ranges=variant_data.get("vendor_color_ranges", []),
                                vendor_product_types=variant_data.get("vendor_product_types", []),
                            )

                            logger.info(f"Processed variant: {variant.display_name}")

            # yield session

            # Commit all changes
            await session.commit()
        except Exception as e:
            logger.error(f"Error during data import: {e}")
            await session.rollback()
            await db.engine.dispose()
            raise
        finally:
            await session.close()
            await db.engine.dispose()
            logger.info("Data import completed successfully!")


async def setup_and_import():
    """Set up database and import data."""
    # Allow specifying the JSON file path as a command-line argument
    if len(sys.argv) > 1:
        json_path = sys.argv[1]
    else:
        json_path = Path(__file__).parent.parent.parent.parent.parent / "examples" / "data-sample-01.json"
    await import_data(json_path)
    # print(f"Importing data from {json_path}...")


if __name__ == "__main__":
    asyncio.run(setup_and_import())
