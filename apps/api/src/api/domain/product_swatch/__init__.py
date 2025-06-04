from .dependencies import provide_product_swatch_repository
from .models import ProductSwatch
from .routes import (
    get_product_swatch,
    delete_product_swatch,
    create_product_swatch,
    update_product_swatch,
    router as product_swatch_router,
)
from .schemas import (
    ProductSwatch as ProductSwatchSchema,
    ProductSwatchCreate,
    ProductSwatchUpdate,
)

__all__ = [
    "ProductSwatch",
    "ProductSwatchSchema",
    "ProductSwatchCreate",
    "ProductSwatchUpdate",
    "get_product_swatch",
    "delete_product_swatch",
    "create_product_swatch",
    "update_product_swatch",
    "provide_product_swatch_repository",
    "product_swatch_router",
]
