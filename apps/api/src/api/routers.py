from domain.analogous import analogous_router
from domain.locale import locale_router
from domain.product_line import product_line_router
from domain.product_swatch import product_swatch_router
from domain.product_variant import product_variant_router
from domain.tag import tag_router
from domain.vendor import vendor_router


# Include all routers
domain_routers = [
    analogous_router,
    locale_router,
    product_line_router,
    product_swatch_router,
    product_variant_router,
    tag_router,
    vendor_router,
]
