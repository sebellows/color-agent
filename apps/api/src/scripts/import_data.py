"""Script to import sample data from JSON file."""

import asyncio
import json
import logging
import sys
from pathlib import Path

from api.core.config import settings
from api.domain.locale.models import Locale
from api.models.supporting import (
    Analogous,
    ColorRange,
    ProductType,
    Tag,
    VendorColorRange,
    VendorProductType,
)
from product.models import Product
from product_line.models import ProductLine
from product_swatch.models import ProductSwatch
from product_variant.models import ProductVariant
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.future import select
from vendor.models import Vendor


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def get_or_create(session: AsyncSession, model, **kwargs):
    """Get or create a record."""
    stmt = select(model).filter_by(**kwargs)
    result = await session.execute(stmt)
    instance = result.scalars().first()
    if instance:
        return instance
    instance = model(**kwargs)
    session.add(instance)
    await session.flush()
    return instance


async def import_data(json_path):
    """Import data from JSON file."""
    logger.info(f"Importing data from {json_path}...")

    # Create engine and session
    engine = create_async_engine(settings.DATABASE_URL)
    async_session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    # Read JSON file
    with open(json_path, "r") as f:
        data = json.load(f)

    async with async_session_factory() as session:
        # Process each vendor
        for vendor_data in data:
            # Create vendor
            vendor = await get_or_create(
                session,
                Vendor,
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
                    session,
                    ProductLine,
                    vendor_id=vendor.id,
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
                        session,
                        Product,
                        product_line_id=product_line.id,
                        name=product_data["name"],  # Changed from product_name to name
                        iscc_nbs_category=product_data.get("iscc_nbs_category"),
                    )
                    logger.info(f"Processed product: {product.name}")

                    # Create product swatch
                    swatch_data = product_data.get("swatch", {})
                    if swatch_data:
                        swatch = await get_or_create(
                            session,
                            ProductSwatch,
                            product_id=product.id,
                            hex_color=swatch_data.get("hex_color", "#000000"),
                            rgb_color=swatch_data.get("rgb_color", [0, 0, 0]),
                            oklch_color=swatch_data.get("oklch_color", [0, 0, 0]),
                            gradient_start=swatch_data.get("gradient_start", [0, 0, 0]),
                            gradient_end=swatch_data.get("gradient_end", [0, 0, 0]),
                            overlay=swatch_data.get("overlay"),
                        )
                        logger.info(f"Processed swatch for product: {product.name}")

                    # Process product types
                    for type_name in product_data.get("product_type", []):
                        product_type = await get_or_create(session, ProductType, name=type_name)
                        product.product_type.append(product_type)

                    # Process color ranges
                    for color_name in product_data.get("color_range", []):
                        color_range = await get_or_create(session, ColorRange, name=color_name)
                        product.color_range.append(color_range)

                    # Process tags
                    for tag_name in product_data.get("tags", []):
                        tag = await get_or_create(session, Tag, name=tag_name)
                        product.tags.append(tag)

                    # Process analogous
                    for analogous_name in product_data.get("analogous", []):
                        analogous = await get_or_create(session, Analogous, name=analogous_name)
                        product.analogous.append(analogous)

                    # Process variants
                    for variant_data in product_data.get("variants", []):
                        # Get or create locale
                        locale = await get_or_create(
                            session,
                            Locale,
                            language_code=variant_data.get("language_code", "en"),
                            country_code=variant_data.get("country_code", "US"),
                            currency_code=variant_data.get("currency_code", "USD"),
                            currency_symbol=variant_data.get("currency_symbol", "$"),
                        )

                        # Create variant
                        variant = await get_or_create(
                            session,
                            ProductVariant,
                            product_id=product.id,
                            locale_id=locale.id,
                            display_name=variant_data.get("display_name", ""),
                            marketing_name=variant_data.get("marketing_name", ""),
                            sku=variant_data.get("sku", ""),
                            discontinued=variant_data.get("discontinued", False),
                            image_url=variant_data.get("image_url", ""),
                            packaging=variant_data.get("packaging", ""),
                            volume_ml=variant_data.get("volume_ml"),
                            volume_oz=variant_data.get("volume_oz"),
                            price=variant_data.get("price", 0),
                            product_url=variant_data.get("product_url", ""),
                            opacity=variant_data.get("opacity"),
                            viscosity=variant_data.get("viscosity"),
                            application_method=variant_data.get("application_method"),
                            vendor_product_id=variant_data.get("vendor_product_id"),
                        )
                        logger.info(f"Processed variant: {variant.display_name}")

                        # Process vendor color ranges
                        for vcr_name in variant_data.get("vendor_color_range", []):
                            vcr = await get_or_create(session, VendorColorRange, name=vcr_name)
                            variant.vendor_color_ranges.append(vcr)

                        # Process vendor product types
                        for vpt_name in variant_data.get("vendor_product_type", []):
                            vpt = await get_or_create(session, VendorProductType, name=vpt_name)
                            variant.vendor_product_types.append(vpt)

        # Commit all changes
        await session.commit()

    await engine.dispose()
    logger.info("Data import completed successfully!")


if __name__ == "__main__":
    # Allow specifying the JSON file path as a command-line argument
    if len(sys.argv) > 1:
        json_path = sys.argv[1]
    else:
        # Default path
        json_path = Path(__file__).parent.parent.parent.parent.parent / "examples" / "data-sample-01.json"

    asyncio.run(import_data(json_path))
