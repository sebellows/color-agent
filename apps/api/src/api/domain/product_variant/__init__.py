from .dependencies import provide_product_variant_repository
from .models import ProductVariant

# from .repository import ProductVariantRepository
from .routes import (
    create_product_variant,
    delete_product_variant,
    get_product_variant,
    update_product_variant,
)
from .routes import (
    router as product_variant_router,
)
from .schemas import (
    ProductVariant as ProductVariantSchema,
)
from .schemas import (
    ProductVariantCreate,
    ProductVariantDelete,
    ProductVariantResponse,
    ProductVariantUpdate,
)
from .service import ProductVariantService, provide_product_variants_service


__all__ = [
    "ProductVariant",
    "ProductVariantSchema",
    "ProductVariantCreate",
    "ProductVariantDelete",
    "ProductVariantResponse",
    "ProductVariantService",
    "ProductVariantUpdate",
    "create_product_variant",
    "delete_product_variant",
    "get_product_variant",
    "update_product_variant",
    "product_variant_router",
    "provide_product_variant_repository",
    "provide_product_variants_service",
]
