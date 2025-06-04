from .dependencies import provide_product_repository
from .models import Product

# from .repository import ProductRepository
from .routes import (
    create_product,
    delete_product,
    get_product,
    list_products,
    update_product,
)
from .routes import (
    router as product_router,
)
from .schemas import (
    Product as ProductSchema,
)
from .schemas import (
    ProductCreate,
    ProductFilterParams,
    ProductResponse,
    ProductUpdate,
)
from .service import ProductService, provide_products_service


__all__ = [
    "Product",
    "ProductCreate",
    "ProductResponse",
    "ProductSchema",
    "ProductService",
    "ProductUpdate",
    "ProductFilterParams",
    "product_router",
    "create_product",
    "get_product",
    "delete_product",
    "list_products",
    "update_product",
    "provide_product_repository",
    "provide_products_service",
]
