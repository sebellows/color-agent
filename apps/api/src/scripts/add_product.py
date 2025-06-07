import sys
from pathlib import Path


sys.path.append(str(Path(__file__).parent.parent))

import asyncio
from uuid import UUID

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
from api.domain.analogous import (
    AnalogousCreate,
    AnalogousResponse,
    AnalogousService,
    AnalogousUpdate,
    provide_analogous_service,
)
from api.domain.locale import (
    LocaleCreate,
    LocaleResponse,
    LocaleService,
    LocaleUpdate,
    provide_locales_service,
)
from api.domain.product import (
    ProductCreate,
    ProductResponse,
    ProductSchema,
    ProductService,
    ProductUpdate,
    provide_products_service,
)
from api.domain.product_line import (
    ProductLineCreate,
    ProductLineResponse,
    ProductLineService,
    ProductLineUpdate,
    provide_product_lines_service,
)
from api.domain.product_swatch import (
    ProductSwatchCreate,
    ProductSwatchResponse,
    ProductSwatchService,
    ProductSwatchUpdate,
    provide_product_swatches_service,
)
from api.domain.product_variant import (
    ProductVariantCreate,
    ProductVariantResponse,
    ProductVariantService,
    ProductVariantUpdate,
    provide_product_variants_service,
)
from api.domain.tag import TagCreate, TagResponse, TagService, TagUpdate, provide_tags_service
from api.domain.vendor import (
    VendorCreate,
    # VendorResponse,
    VendorSchema,
    VendorUpdate,
    Vendors,
    provide_vendors_service,
)


# provider=providers["vendor"](session),
# name=vendor_data["vendor_name"],
# url=vendor_data["vendor_url"],
# slug=vendor_data["slug"],
# platform=vendor_data["platform"],
# description=vendor_data["description"],
# pdp_slug=vendor_data["pdp_slug"],
# plp_slug=vendor_data["plp_slug"],

vendor_json = {
    "vendor_name": "Games Workshop",
    "vendor_url": "https://www.warhammer.com",
    "slug": "games_workshop",
    "platform": "Algolia",
    "description": "%3Cp%3E%3Cb%3E%3Ca%20href%3D%22https%3A//warhammer.com%22%3EGames%20Workshop%3C/a%3E%3C/b%3E%2C%20founded%20in%20the%20UK%20in%201975%2C%20is%20the%20company%20behind%20popular%20table-top%20games%20like%20%3Ci%3EWarhammer%2040%2C000%3C/i%3E%20and%20%3Ci%3EAge%20of%20Sigmar%3C/i%3E.%20They%20market%20their%20own%20retail%20line%20of%20acrylic%20paints%20under%20their%20subsidiary%20Citadel%20Miniatures%20%28labelled%20simply%20as%20%22Citadel%22%29.%3C/p%3E",  # noqa: E501
    "pdp_slug": "shop",
    "plp_slug": "plp",
}

product_line_json = {
    "description": "",
    "marketing_name": "Citadel Paints",
    "product_line_name": "Citadel",
    "product_line_type": "Mixed",
    "slug": "citadel",
    "vendor_slug": "",
}

product_json = {
    "analogous": [],
    "color_range": ["Silver"],
    "iscc_nbs_category": "Blackish Green",
    "name": "Leadbelcher",
    "product_type": ["Acrylic", "Metallic"],
    "slug": "leadbelcher",
    "swatch": {
        "gradient_end": [0.229, 0.0175, 237.72],
        "gradient_start": [0.61, 0.0175, 237.72],
        "hex_color": "#7b868e",
        "oklch_color": [0.61, 0.0175, 237.72],
        "overlay": "Chrome",
        "rgb_color": [123, 134, 142],
    },
    "tags": [],
}

variants_json = [
    {
        "application_method": "Primer",
        "country_code": "US",
        "currency_code": "USD",
        "currency_symbol": "$",
        "discontinued": False,
        "display_name": "Leadbelcher",
        "image_url": "/app/resources/catalog/product/920x950/99209999051_sprayLeadbelcher.svg",
        "language_code": "en",
        "marketing_name": "Leadbelcher",
        "opacity": "Opaque",
        "packaging": "SprayCan",
        "price": 2400,
        "product_line": "Citadel",
        "product_url": "https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020",
        "sku": "prod4540241-13209999111",
        "vendor_color_range": ["Silver"],
        "vendor_product_id": "5ba77422-91cb-46dd-98d1-c108588cf6b6",
        "vendor_product_type": ["Spray"],
        "viscosity": "Low",
        "volume_ml": 295.735,
        "volume_oz": 10.0,
    },
    {
        "application_method": None,
        "country_code": "US",
        "currency_code": "USD",
        "currency_symbol": "$",
        "discontinued": False,
        "display_name": "Leadbelcher",
        "image_url": "/app/resources/catalog/product/920x950/99189950028_baseLeadbelcher.svg",
        "language_code": "en",
        "marketing_name": "Leadbelcher",
        "opacity": "Opaque",
        "packaging": "Pot",
        "price": 455,
        "product_line": "Citadel",
        "product_url": "https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020",
        "sku": "prod4210283-99189950235",
        "vendor_color_range": ["Silver"],
        "vendor_product_id": "7e65291e-5930-41aa-b1a6-e16e069b80f3",
        "vendor_product_type": ["Base"],
        "viscosity": "MediumHigh",
        "volume_ml": 18.0,
        "volume_oz": 0.609,
    },
    {
        "application_method": "Air",
        "country_code": "US",
        "currency_code": "USD",
        "currency_symbol": "$",
        "discontinued": False,
        "display_name": "Leadbelcher",
        "image_url": "/app/resources/catalog/product/920x950/99189958068_airLeadbelcher.svg",
        "language_code": "en",
        "marketing_name": "Leadbelcher",
        "opacity": "SemiOpaque",
        "packaging": "Pot",
        "price": 780,
        "product_line": "Citadel",
        "product_url": "https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020",
        "sku": "prod4190214-99189958146",
        "vendor_color_range": ["Silver"],
        "vendor_product_id": "70947164-52f3-4a2b-9651-4d4c2d5bafbf",
        "vendor_product_type": ["Air"],
        "viscosity": "Low",
        "volume_ml": 18.0,
        "volume_oz": 0.609,
    },
]


async def add_vendor(
    vendor_service: Vendors,
    data: VendorCreate,
) -> VendorSchema:
    """Add a new vendor to the database."""
    vendor = await vendor_service.create(data)
    return vendor_service.to_schema(vendor, schema_type=VendorSchema)


async def update_vendor(
    vendor_service: Vendors,
    data: VendorUpdate,
) -> VendorSchema:
    """Update a vendor in the database."""
    # print(f"Updating vendor with data: {data.__dict__}")
    vendor = await vendor_service.upsert(data)
    return vendor_service.to_schema(vendor, schema_type=VendorSchema)


async def add_product_line(
    product_line_service: ProductLineService,
    data: ProductLineCreate,
) -> ProductLineResponse:
    """Add a new product line to the database."""
    product_line = await product_line_service.create(data)
    return product_line_service.to_schema(product_line, schema_type=ProductLineResponse)


async def update_product_line(
    product_line_service: ProductLineService,
    data: ProductLineUpdate,
) -> ProductLineResponse:
    """Update product line in the database."""
    product_line = await product_line_service.upsert(data)
    return product_line_service.to_schema(product_line, schema_type=ProductLineResponse)


async def add_product(
    product_service: ProductService,
    data: ProductCreate,
) -> ProductSchema:
    """Add a new product to the database."""
    product = await product_service.create(data)
    return product_service.to_schema(product, schema_type=ProductSchema)


async def update_product(
    product_service: ProductService,
    data: ProductCreate | ProductUpdate,
    # product_id: UUID | None = None,
) -> ProductResponse:
    """Update product in the database."""
    product, created = await product_service.get_or_upsert(**data.__dict__)
    print("**update_product: ", created, data, product)
    return product_service.to_schema(product, schema_type=ProductResponse)


async def add_product_swatch(
    product_swatches_service: ProductSwatchService,
    data: ProductSwatchCreate,
) -> ProductSwatchResponse:
    """Add a new product swatch to the database."""
    product_swatch = await product_swatches_service.create(data)
    return product_swatches_service.to_schema(product_swatch, schema_type=ProductSwatchResponse)


async def update_product_swatch(
    product_swatches_service: ProductSwatchService,
    data: ProductSwatchCreate | ProductSwatchUpdate,
) -> ProductSwatchResponse:
    """Update product swatch in the database."""
    product_swatch = await product_swatches_service.upsert(data)
    return product_swatches_service.to_schema(product_swatch, schema_type=ProductSwatchResponse)


async def add_product_variant(
    product_variants_service: ProductVariantService,
    data: ProductVariantCreate,
) -> ProductVariantResponse:
    """Add a new product variant to the database."""
    product_variant = await product_variants_service.create(data)
    return product_variants_service.to_schema(product_variant, schema_type=ProductVariantResponse)


async def update_product_variant(
    product_variants_service: ProductVariantService,
    data: ProductVariantCreate | ProductVariantUpdate,
) -> ProductVariantResponse:
    """Update product variant in the database."""
    product_variant = await product_variants_service.upsert(data)
    return product_variants_service.to_schema(product_variant, schema_type=ProductVariantResponse)


async def add_analogous(
    analogous_service: AnalogousService,
    data: AnalogousCreate,
) -> AnalogousResponse:
    """Add a new analogous tag to the database."""
    analogous = await analogous_service.create(data)
    return analogous_service.to_schema(analogous, schema_type=AnalogousResponse)


async def update_analogous(
    analogous_service: AnalogousService,
    data: AnalogousUpdate,
) -> AnalogousResponse:
    """Update analogous tag in the database."""
    analogous = await analogous_service.upsert(data)
    return analogous_service.to_schema(analogous, schema_type=AnalogousResponse)


async def add_tag(
    tags_service: TagService,
    data: TagCreate,
) -> TagResponse:
    """Add a new tag to the database."""
    tag = await tags_service.create(data)
    return tags_service.to_schema(tag, schema_type=TagResponse)


async def update_tag(
    tags_service: TagService,
    data: TagUpdate,
) -> TagResponse:
    """Update tag in the database."""
    tag = await tags_service.upsert(data)
    return tags_service.to_schema(tag, schema_type=TagResponse)


async def add_locale(
    locales_service: LocaleService,
    data: LocaleCreate,
) -> LocaleResponse:
    """Add a new locale to the database."""
    locale = await locales_service.create(data)
    return locales_service.to_schema(locale, schema_type=LocaleResponse)


async def update_locale(
    locales_service: LocaleService,
    data: LocaleUpdate,
) -> LocaleResponse:
    """Update locale in the database."""
    locale = await locales_service.upsert(data)
    return locales_service.to_schema(locale, schema_type=LocaleResponse)


async def create_gw():
    db = DB.instance()

    async with db.session_factory() as session:
        try:
            session.begin()

            await db.create_all()

            vendor_id: UUID | None = None
            product_line_id: UUID | None = None
            product: ProductSchema | None = None

            async for vendor_service in provide_vendors_service(session):
                vendor_data = VendorUpdate(
                    name=vendor_json["vendor_name"],
                    url=vendor_json["vendor_url"],
                    slug=vendor_json["slug"],
                    platform=vendor_json["platform"],
                    description=vendor_json["description"],
                    pdp_slug=vendor_json["pdp_slug"],
                    plp_slug=vendor_json["plp_slug"],
                )
                vendor = await update_vendor(vendor_service, vendor_data)
                vendor_id = vendor.id

            if vendor_id is not None:
                async for product_line_service in provide_product_lines_service(session):
                    product_line_type = ProductLineTypeEnum.__members__.get(
                        product_line_json.get("product_line_type", "Mixed"), ProductLineTypeEnum.Mixed
                    )
                    product_line_data = ProductLineCreate(
                        **{
                            "description": product_line_json.get("description", ""),
                            "marketing_name": product_line_json["marketing_name"],
                            "name": product_line_json["product_line_name"],
                            "slug": product_line_json["slug"],
                            "vendor_slug": product_line_json.get(
                                "vendor_slug", ""
                            ),  # Assuming vendor slug is the same as vendor's slug
                            "product_line_type": product_line_type,
                            "vendor_id": vendor_id,
                        }
                    )
                    # product_line_data = ProductLineUpdate(
                    #     **product_line_json, vendor_id=vendor_id, product_line_type=product_line_type
                    # )
                    product_line = await add_product_line(product_line_service, product_line_data)
                    # print("Product Line Update: ", product_line)
                    product_line_id = product_line.id

                if product_line_id is not None:
                    async for product_service in provide_products_service(session):
                        product_type: list[ProductTypeEnum] = [
                            ProductTypeEnum.__members__.get(pt if pt else "Acrylic", ProductTypeEnum.Acrylic)
                            for pt in product_json.get("product_type", [])
                        ]
                        color_range: list[ColorRangeEnum] = [
                            ColorRangeEnum.__members__.get(cr if cr else "White", ColorRangeEnum.White)
                            for cr in product_json.get("color_range", [])
                        ]
                        product_tags = product_json.get("tags", [])
                        product_analogous = product_json.get("analogous", [])

                        if len(product_analogous):
                            async for analogous_service in provide_analogous_service(session):
                                for analogous_name in product_analogous:
                                    analogous_data = AnalogousUpdate(name=analogous_name)
                                    await update_analogous(analogous_service, analogous_data)
                                #     print("Analogous Response: ", analogous)
                                # print("Analogous Update: ", product_analogous)

                        if len(product_tags):
                            async for tags_service in provide_tags_service(session):
                                for tag in product_tags:
                                    tag_data = TagUpdate(name=tag)
                                    tag = await update_tag(tags_service, tag_data)
                                    # print("Tags Response: ", tag)
                                # print("Tags Update: ", product_tags)

                        # print("Product JSON: ", product_json, color_range, product_type)
                        product_name: str = product_json["name"]

                        product_update = ProductCreate(
                            name=product_name,
                            slug=product_json.get("slug", slugify(product_name)),
                            iscc_nbs_category=product_json["iscc_nbs_category"],
                            description=product_json.get("description", ""),
                            product_type=product_type,
                            color_range=color_range,
                            product_line_id=product_line_id,
                            tags=product_json.get("tags", []),
                            analogous=product_json.get("analogous", []),
                            # tags=product_json.get("tags", []),
                            # analogous=product_json.get("analogous", []),
                        )
                        product = await add_product(product_service, product_update)
                        # product_id = product.id

                    if product is not None:
                        async for product_swatches_service in provide_product_swatches_service(session):
                            swatch_data = product_json.get("swatch", {})
                            # print("Overlay Members: ", swatch_data["overlay"], OverlayEnum.__members__.keys())
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
                            await update_product_swatch(product_swatches_service, product_swatch_data)
                            # print("Product Swatch Update: ", product_swatch)

                        locale: LocaleResponse | None = None
                        # locale_id: UUID | None = None

                        async for product_variants_service in provide_product_variants_service(session):
                            for variant_data in variants_json:
                                if locale is None:
                                    lang = variant_data.get("language_code", "en")
                                    country = variant_data.get("country_code", "US")
                                    locale_data = LocaleUpdate(
                                        language_code=lang,
                                        country_code=country,
                                        currency_code=variant_data.get("currency_code", "USD"),
                                        currency_symbol=variant_data.get("currency_symbol", "$"),
                                        slug=f"{lang}_{country}",
                                    )
                                    # print("LocaleUpdate: ", locale_data)
                                    async for locale_service in provide_locales_service(session):
                                        locale = await update_locale(locale_service, locale_data)
                                        # print("Locale Added: ", locale)
                                        # locale_id = locale.id
                                # print("Product ID: ", product_id, "Locale ID: ", locale_id)

                                if locale:
                                    product_variant_data = ProductVariantCreate(
                                        locale_id=locale.id,
                                        product_id=product.id,
                                        # country_code=variant_data.get("country_code", "US"),
                                        # currency_code=variant_data.get("currency_code", "USD"),
                                        # currency_symbol=variant_data.get("currency_symbol", "$"),
                                        discontinued=variant_data.get("discontinued", False),
                                        display_name=variant_data.get("display_name", product.name),
                                        image_url=variant_data["image_url"],
                                        # language_code=variant_data.get("language_code", "en"),
                                        price=variant_data["price"],
                                        # product_line=variant_data.get("product_line", None),
                                        product_url=variant_data["product_url"],
                                        sku=variant_data["sku"],
                                        vendor_color_ranges=variant_data.get("vendor_color_range", []),
                                        vendor_product_id=variant_data.get("vendor_product_id", None),
                                        vendor_product_types=variant_data.get("vendor_product_type", []),
                                        volume_ml=variant_data.get("volume_ml", None),
                                        volume_oz=variant_data.get("volume_oz", None),
                                        marketing_name=variant_data.get("marketing_name", product.name),
                                        application_method=ApplicationMethodEnum.__members__.get(
                                            variant_data.get("application_method", "Unknown"),
                                            ApplicationMethodEnum.Unknown,
                                        ),
                                        opacity=OpacityEnum.__members__.get(
                                            variant_data.get("opacity", "Unknown"), OpacityEnum.Unknown
                                        ),
                                        packaging=PackagingTypeEnum.__members__.get(
                                            variant_data.get("packaging", "Unknown"), PackagingTypeEnum.Unknown
                                        ),
                                        viscosity=ViscosityEnum.__members__.get(
                                            variant_data.get("viscosity", "Unknown"), ViscosityEnum.Unknown
                                        ),
                                    )
                                    await update_product_variant(product_variants_service, product_variant_data)

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


if __name__ == "__main__":
    asyncio.run(create_gw())
