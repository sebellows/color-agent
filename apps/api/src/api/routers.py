from api.domain.analogous import analogous_router
from api.domain.color_range import color_range_router
from api.domain.locale import locale_router
from api.domain.product_line import product_line_router
from api.domain.product_swatch import product_swatch_router
from api.domain.product_type import product_type_router
from api.domain.product_variant import product_variant_router
from api.domain.tag import tag_router
from api.domain.vendor import vendor_router


# Include all routers
domain_routers = [
    analogous_router,
    color_range_router,
    locale_router,
    product_line_router,
    product_swatch_router,
    product_type_router,
    product_variant_router,
    tag_router,
    vendor_router,
]
