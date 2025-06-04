import sys
from pathlib import Path


sys.path.append(str(Path(__file__).parent.parent))

import asyncio
from uuid import UUID

from api.core.database import DB
from api.core.enums import ColorRangeEnum, OverlayEnum, ProductLineTypeEnum, ProductTypeEnum
from api.domain.product import ProductCreate, ProductResponse, ProductService, ProductUpdate, provide_products_service
from api.domain.product_line import (
    ProductLineCreate,
    ProductLineResponse,
    ProductLineService,
    ProductLineUpdate,
    provide_product_lines_service,
)
from api.domain.vendor import (
    VendorCreate,
    VendorResponse,
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
    "product_line_name": "Citadel",
    "marketing_name": "Citadel Paints",
    "slug": "citadel",
    "vendor_slug": "",
    "product_line_type": "Mixed",
    "description": "",
}

product_json = {
    "name": "Leadbelcher",
    "slug": "leadbelcher",
    "swatch": {
        "hex_color": "#7b868e",
        "rgb_color": [123, 134, 142],
        "oklch_color": [0.61, 0.0175, 237.72],
        "gradient_start": [0.61, 0.0175, 237.72],
        "gradient_end": [0.229, 0.0175, 237.72],
        "overlay": "chrome",
    },
    "product_type": ["Acrylic", "Metallic"],
    "tags": [],
    "color_range": ["Silver"],
    "analogous": [],
    "iscc_nbs_category": "Blackish Green",
}

variants_json = [
    {
        "display_name": "Leadbelcher",
        "marketing_name": "Leadbelcher",
        "sku": "prod4540241-13209999111",
        "vendor_color_range": ["Silver"],
        "vendor_product_type": ["Spray"],
        "opacity": "opaque",
        "viscosity": "low",
        "discontinued": False,
        "image_url": "/app/resources/catalog/product/920x950/99209999051_sprayLeadbelcher.svg",
        "packaging": "Spray Can",
        "volume_ml": 295.735,
        "volume_oz": 10.0,
        "price": 2400,
        "currency_code": "USD",
        "currency_symbol": "$",
        "country_code": "US",
        "product_url": "https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020",
        "language_code": "en",
        "product_line": "Citadel",
        "application_method": "Primer",
        "vendor_product_id": "5ba77422-91cb-46dd-98d1-c108588cf6b6",
    },
    {
        "display_name": "Leadbelcher",
        "marketing_name": "Leadbelcher",
        "sku": "prod4210283-99189950235",
        "vendor_color_range": ["Silver"],
        "vendor_product_type": ["Base"],
        "opacity": "opaque",
        "viscosity": "medium-to-high",
        "discontinued": False,
        "image_url": "/app/resources/catalog/product/920x950/99189950028_baseLeadbelcher.svg",
        "packaging": "Pot",
        "volume_ml": 18.0,
        "volume_oz": 0.609,
        "price": 455,
        "currency_code": "USD",
        "currency_symbol": "$",
        "country_code": "US",
        "product_url": "https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020",
        "language_code": "en",
        "product_line": "Citadel",
        "application_method": None,
        "vendor_product_id": "7e65291e-5930-41aa-b1a6-e16e069b80f3",
    },
    {
        "display_name": "Leadbelcher",
        "marketing_name": "Leadbelcher",
        "sku": "prod4190214-99189958146",
        "vendor_color_range": ["Silver"],
        "vendor_product_type": ["Air"],
        "opacity": "semi-opaque",
        "viscosity": "low",
        "discontinued": False,
        "image_url": "/app/resources/catalog/product/920x950/99189958068_airLeadbelcher.svg",
        "packaging": "Pot",
        "volume_ml": 18.0,
        "volume_oz": 0.609,
        "price": 780,
        "currency_code": "USD",
        "currency_symbol": "$",
        "country_code": "US",
        "product_url": "https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020",
        "language_code": "en",
        "product_line": "Citadel",
        "application_method": "Air",
        "vendor_product_id": "70947164-52f3-4a2b-9651-4d4c2d5bafbf",
    },
]


async def add_vendor(
    vendor_service: Vendors,
    data: VendorCreate,
) -> VendorResponse:
    """Add a new vendor to the database."""
    vendor = await vendor_service.create(data)
    return vendor_service.to_schema(vendor, schema_type=VendorResponse)


async def update_vendor(
    vendor_service: Vendors,
    data: VendorUpdate,
) -> VendorResponse:
    """Update a vendor in the database."""
    vendor = await vendor_service.update(data)
    return vendor_service.to_schema(vendor, schema_type=VendorResponse)


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
    product_line = await product_line_service.update(data)
    return product_line_service.to_schema(product_line, schema_type=ProductLineResponse)


async def add_product(
    product_service: ProductService,
    data: ProductCreate,
) -> ProductResponse:
    """Add a new product to the database."""
    product = await product_service.create(data)
    return product_service.to_schema(product, schema_type=ProductResponse)


async def update_product(
    product_service: ProductService,
    data: ProductUpdate,
) -> ProductResponse:
    """Update product in the database."""
    product = await product_service.update(data)
    return product_service.to_schema(product, schema_type=ProductResponse)


async def create_gw():
    db = DB.instance()

    async with db.session_factory() as session:
        try:
            session.begin()

            await db.create_all()

            vendor_id: UUID | None = None
            product_line_id: UUID | None = None
            # product_id: UUID | None = None

            async for vendor_service in provide_vendors_service(session):
                vendor_data = VendorUpdate(**vendor_json)
                vendor = await update_vendor(vendor_service, vendor_data)
                print("Vendor Update: ", vendor)
                vendor_id = vendor.id

            async for product_line_service in provide_product_lines_service(session):
                product_line_data = ProductLineUpdate(
                    **product_line_json, vendor_id=vendor_id, product_line_type=ProductLineTypeEnum.Mixed
                )
                product_line = await update_product_line(product_line_service, product_line_data)
                print("Product Line Update: ", product_line)
                product_line_id = product_line.id

            async for product_service in provide_products_service(session):
                product_type = [ProductTypeEnum[pt] for pt in product_json["product_type"]]
                color_range = [ColorRangeEnum[pt] for pt in product_json["color_range"]]
                product_data = ProductUpdate(
                    **product_json,
                    product_line_id=product_line_id,
                    product_type=product_type,
                    color_range=color_range,
                    tags=product_json.get("tags", []),
                    analogous=product_json.get("analogous", []),
                )
                product = await update_product(product_service, product_data)
                print("Product Data: ", product)
                # product_id = product.id

            session.commit()
        except Exception as e:
            print(f"Error during vendor creation: {e}")
            await session.rollback()
            await db.engine.dispose()
            raise
        finally:
            await session.close()
            await db.engine.dispose()
            print("Vendor created successfully!")


if __name__ == "__main__":
    asyncio.run(create_gw())
