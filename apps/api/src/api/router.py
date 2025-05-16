from fastapi import APIRouter
from .routes import (
    vendor,
    product_line,
    product,
    product_swatch,
    product_variant,
    locale,
    supporting,
)

api_router = APIRouter()

# Include all routers
api_router.include_router(vendor.router, prefix="/vendors", tags=["vendors"])
api_router.include_router(
    product_line.router, prefix="/product-lines", tags=["product-lines"]
)
api_router.include_router(product.router, prefix="/products", tags=["products"])
api_router.include_router(
    product_swatch.router, prefix="/product-swatches", tags=["product-swatches"]
)
api_router.include_router(
    product_variant.router, prefix="/product-variants", tags=["product-variants"]
)
api_router.include_router(locale.router, prefix="/locales", tags=["locales"])
api_router.include_router(supporting.router, prefix="/supporting", tags=["supporting"])
