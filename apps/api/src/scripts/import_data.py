import json
import sys
from pathlib import Path
from typing import Any, TypeVar


sys.path.append(str(Path(__file__).parent.parent))

import asyncio

from advanced_alchemy.base import ModelProtocol
from advanced_alchemy.service import SQLAlchemyAsyncRepositoryService
from advanced_alchemy.service.typing import ModelDTOT
from advanced_alchemy.utils.text import slugify
from api.core.database import DB
from api.core.enums import (
    ApplicationMethodEnum,
    ColorRangeEnum,
    OpacityEnum,
    OverlayEnum,
    PackagingTypeEnum,
    ProductLineTypeEnum,
    ProductTypeEnum,
    ViscosityEnum,
)
from api.core.logger import get_logger, settings, setup_logging
from api.domain.analogous import (
    AnalogousResponse,
    AnalogousUpdate,
    provide_analogous_service,
)
from api.domain.locale import (
    LocaleResponse,
    LocaleUpdate,
    provide_locales_service,
)
from api.domain.product import (
    ProductCreate,
    ProductResponse,
    provide_products_service,
)
from api.domain.product_line import (
    ProductLineCreate,
    ProductLineResponse,
    provide_product_lines_service,
)
from api.domain.product_swatch import (
    ProductSwatchCreate,
    ProductSwatchResponse,
    provide_product_swatches_service,
)
from api.domain.product_variant import (
    ProductVariantCreate,
    ProductVariantResponse,
    provide_product_variants_service,
)
from api.domain.tag import TagResponse, TagUpdate, provide_tags_service
from api.domain.vendor import (
    VendorSchema,
    VendorUpdate,
    provide_vendors_service,
)


setup_logging(json_logs=settings.logger.LOG_JSON_FORMAT, log_level=settings.logger.LOG_LEVEL)
logger = get_logger(__name__)


T = TypeVar("T", bound=ModelProtocol)


async def get_or_create(service: SQLAlchemyAsyncRepositoryService, data: Any, schema_type: type["ModelDTOT"]):
    """Get or create a record."""
    model, _created = await service.get_or_upsert(**data.__dict__)

    # locale = await locales_service.upsert(data)
    # return locales_service.to_schema(locale, schema_type=LocaleResponse)
    # if created:
    #     logger.info(f"Created new model instance: {model}")
    # else:
    #     logger.info(f"Found existing model instance: {model}")

    return service.to_schema(model, schema_type=schema_type)


async def import_data(data):
    db = DB.instance()

    async with db.session_factory() as session:
        try:
            session.begin()
            print("Processing data...", data.get("vendor_name", "Unknown Vendor"))

            # await db.drop_all()
            await db.create_all()

            async for vendor_service in provide_vendors_service(session):
                vendor_data = VendorUpdate(
                    name=data["vendor_name"],
                    url=data["vendor_url"],
                    slug=data["slug"],
                    platform=data["platform"],
                    description=data["description"],
                    pdp_slug=data["pdp_slug"],
                    plp_slug=data["plp_slug"],
                )
                vendor = await get_or_create(vendor_service, data=vendor_data, schema_type=VendorSchema)

                async for product_line_service in provide_product_lines_service(session):
                    for product_line_item in data.get("product_lines", []):
                        product_line_data: dict[str, Any] = product_line_item.get("product_line", {})
                        product_line_type = ProductLineTypeEnum.__members__.get(
                            product_line_data.get("product_line_type", "Mixed"), ProductLineTypeEnum.Mixed
                        )
                        product_line_model = ProductLineCreate(
                            **{
                                "description": product_line_data.get("description", ""),
                                "marketing_name": product_line_data["marketing_name"],
                                "name": product_line_data["product_line_name"],
                                "slug": product_line_data["slug"],
                                "vendor_slug": product_line_data.get(
                                    "vendor_slug", ""
                                ),  # Assuming vendor slug is the same as vendor's slug
                                "product_line_type": product_line_type,
                                "vendor_id": vendor.id,
                            }
                        )
                        product_line = await get_or_create(
                            product_line_service, data=product_line_model, schema_type=ProductLineResponse
                        )
                        # print("Product Line Update: ", product_line)

                        if product_line:
                            async for product_service in provide_products_service(session):
                                for product_item in product_line.get("products", []):
                                    product_type: list[ProductTypeEnum] = [
                                        ProductTypeEnum.__members__.get(
                                            pt if pt else "Acrylic", ProductTypeEnum.Acrylic
                                        )
                                        for pt in product_item.get("product_type", [])
                                    ]
                                    color_range: list[ColorRangeEnum] = [
                                        ColorRangeEnum.__members__.get(cr if cr else "White", ColorRangeEnum.White)
                                        for cr in product_item.get("color_range", [])
                                    ]
                                    product_tags = product_item.get("tags", [])
                                    product_analogous = product_item.get("analogous", [])

                                    if len(product_analogous):
                                        async for analogous_service in provide_analogous_service(session):
                                            for analogous_name in product_analogous:
                                                analogous_data = AnalogousUpdate(name=analogous_name)
                                                await get_or_create(
                                                    analogous_service,
                                                    data=analogous_data,
                                                    schema_type=AnalogousResponse,
                                                )
                                            #     print("Analogous Response: ", analogous)
                                            # print("Analogous Update: ", product_analogous)

                                    if len(product_tags):
                                        async for tags_service in provide_tags_service(session):
                                            for tag in product_tags:
                                                tag_data = TagUpdate(name=tag)
                                                tag = await get_or_create(
                                                    tags_service, data=tag_data, schema_type=TagResponse
                                                )
                                                # print("Tags Response: ", tag)
                                            # print("Tags Update: ", product_tags)

                                    # print("Product JSON: ", product_json, color_range, product_type)
                                    product_name: str = product_item["name"]

                                    product_update = ProductCreate(
                                        name=product_name,
                                        slug=product_item.get("slug", slugify(product_name)),
                                        iscc_nbs_category=product_item["iscc_nbs_category"],
                                        description=product_item.get("description", ""),
                                        product_type=product_type,
                                        color_range=color_range,
                                        product_line_id=product_line.id,
                                        tags=product_item.get("tags", []),
                                        analogous=product_item.get("analogous", []),
                                    )

                                    product = await get_or_create(
                                        product_service, data=product_update, schema_type=ProductResponse
                                    )

                                    if product:
                                        async for product_swatches_service in provide_product_swatches_service(session):
                                            swatch_data = product_item.get("swatch", {})
                                            overlay = OverlayEnum.__members__.get(
                                                swatch_data.get("overlay", "Unknown"), OverlayEnum.Unknown
                                            )
                                            product_swatch_data = ProductSwatchCreate(
                                                product_id=product.id,
                                                hex_color=swatch_data.get("hex_color", "#000000"),
                                                rgb_color=swatch_data.get("rgb_color", [0, 0, 0]),
                                                oklch_color=swatch_data.get("oklch_color", [0.0, 0.0, 0.0]),
                                                gradient_start=swatch_data.get("gradient_start", [0.0, 0.0, 0.0]),
                                                gradient_end=swatch_data.get("gradient_end", [0.0, 0.0, 0.0]),
                                                overlay=overlay,
                                            )
                                            await get_or_create(
                                                product_swatches_service,
                                                data=product_swatch_data,
                                                schema_type=ProductSwatchResponse,
                                            )
                                            # print("Product Swatch Update: ", product_swatch)

                                        locale: LocaleResponse | None = None

                                        async for product_variants_service in provide_product_variants_service(session):
                                            for variant_item in product_item.get("variants", []):
                                                if locale is None:
                                                    lang = variant_item.get("language_code", "en")
                                                    country = variant_item.get("country_code", "US")
                                                    locale_data = LocaleUpdate(
                                                        language_code=lang,
                                                        country_code=country,
                                                        currency_code=variant_item.get("currency_code", "USD"),
                                                        currency_symbol=variant_item.get("currency_symbol", "$"),
                                                        slug=f"{lang}_{country}",
                                                    )
                                                    # print("LocaleUpdate: ", locale_data)
                                                    async for locale_service in provide_locales_service(session):
                                                        locale = await get_or_create(
                                                            locale_service, data=locale_data, schema_type=LocaleResponse
                                                        )
                                                        # print("Locale Added: ", locale)
                                                # print("Product ID: ", product_id, "Locale ID: ", locale_id)

                                                if locale:
                                                    product_variant_data = ProductVariantCreate(
                                                        locale_id=locale.id,
                                                        product_id=product.id,
                                                        # country_code=variant_data.get("country_code", "US"),
                                                        # currency_code=variant_data.get("currency_code", "USD"),
                                                        # currency_symbol=variant_data.get("currency_symbol", "$"),
                                                        discontinued=variant_item.get("discontinued", False),
                                                        display_name=variant_item.get("display_name", product.name),
                                                        image_url=variant_item["image_url"],
                                                        # language_code=variant_data.get("language_code", "en"),
                                                        price=variant_item["price"],
                                                        # product_line=variant_data.get("product_line", None),
                                                        product_url=variant_item["product_url"],
                                                        sku=variant_item["sku"],
                                                        vendor_color_ranges=variant_item.get("vendor_color_range", []),
                                                        vendor_product_id=variant_item.get("vendor_product_id", None),
                                                        vendor_product_types=variant_item.get(
                                                            "vendor_product_type", []
                                                        ),
                                                        volume_ml=variant_item.get("volume_ml", None),
                                                        volume_oz=variant_item.get("volume_oz", None),
                                                        marketing_name=variant_item.get("marketing_name", product.name),
                                                        application_method=ApplicationMethodEnum.__members__.get(
                                                            variant_item.get("application_method", "Unknown"),
                                                            ApplicationMethodEnum.Unknown,
                                                        ),
                                                        opacity=OpacityEnum.__members__.get(
                                                            variant_item.get("opacity", "Unknown"),
                                                            OpacityEnum.Unknown,
                                                        ),
                                                        packaging=PackagingTypeEnum.__members__.get(
                                                            variant_item.get("packaging", "Unknown"),
                                                            PackagingTypeEnum.Unknown,
                                                        ),
                                                        viscosity=ViscosityEnum.__members__.get(
                                                            variant_item.get("viscosity", "Unknown"),
                                                            ViscosityEnum.Unknown,
                                                        ),
                                                    )
                                                    await get_or_create(
                                                        product_variants_service,
                                                        data=product_variant_data,
                                                        schema_type=ProductVariantResponse,
                                                    )

            await session.commit()
        except Exception as e:
            print(f"Error during vendor creation: {e}")
            await session.rollback()
            await db.engine.dispose()
            raise
        finally:
            await session.close()
            await db.engine.dispose()
            print("FINALLY??!")


async def setup_and_import():
    """Set up database and import data."""
    # Allow specifying the JSON file path as a command-line argument
    if len(sys.argv) > 1:
        json_path = sys.argv[1]
    else:
        json_path = Path(__file__).parent.parent.parent.parent.parent / "vendor-data" / "gamesworkshop.json"

    """Import data from JSON file."""
    # logger.info(f"Importing data from {json_path}.")

    # Read JSON file
    with open(json_path, "r") as f:
        data = json.load(f)

        if data:
            await import_data(data)
    # print(f"Importing data from {json_path}...")


if __name__ == "__main__":
    asyncio.run(setup_and_import())
