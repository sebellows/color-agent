from .dependencies import provide_product_swatch_repository
from .models import ProductSwatch
from .routes import (
    create_product_swatch,
    delete_product_swatch,
    get_product_swatch,
    update_product_swatch,
)
from .routes import (
    router as product_swatch_router,
)
from .schemas import (
    ProductSwatch as ProductSwatchSchema,
)
from .schemas import (
    ProductSwatchCreate,
    ProductSwatchResponse,
    ProductSwatchUpdate,
)
from .service import ProductSwatchService, provide_product_swatches_service


__all__ = [
    "ProductSwatch",
    "ProductSwatchSchema",
    "ProductSwatchCreate",
    "ProductSwatchResponse",
    "ProductSwatchService",
    "ProductSwatchUpdate",
    "get_product_swatch",
    "delete_product_swatch",
    "create_product_swatch",
    "update_product_swatch",
    "provide_product_swatch_repository",
    "provide_product_swatches_service",
    "product_swatch_router",
]
