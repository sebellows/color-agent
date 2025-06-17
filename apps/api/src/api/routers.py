from domain.analogous.routes import analogous_router
from domain.locale.routes import locale_router
from domain.product_line.routes import product_line_router
from domain.product_swatch.routes import product_swatch_router
from domain.product_variant.routes import product_variant_router
from domain.tag.routes import tag_router
from domain.vendor.routes import vendor_router
from fastapi import APIRouter


__all__ = ["router"]


# Include all routers
def include_routers():
    _router = APIRouter(
        prefix="/api",
        responses={404: {"description": "Page not found"}},
    )

    """Function to include all routers."""
    routers = [
        analogous_router,
        locale_router,
        product_line_router,
        product_swatch_router,
        product_variant_router,
        tag_router,
        vendor_router,
    ]
    for r in routers:
        _router.include_router(r)
    return _router


router = include_routers()
