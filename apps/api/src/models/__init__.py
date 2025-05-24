from .base import Base
from .supporting import (
    ProductType,
    ColorRange,
    Tag,
    Analogous,
    VendorColorRange,
    VendorProductType,
)
from .locale import Locale
from .vendor import Vendor
from .product_line import ProductLine
from .product import Product
from .product_swatch import ProductSwatch
from .product_variant import ProductVariant

# Import associations after all models
from .associations import (
    product_product_type,
    product_color_range,
    product_tag,
    product_analogous,
    variant_vendor_color_range,
    variant_vendor_product_type,
)

__all__ = [
    "Base",
    "ProductType",
    "ColorRange",
    "Tag",
    "Analogous",
    "VendorColorRange",
    "VendorProductType",
    "Locale",
    "Vendor",
    "ProductLine",
    "Product",
    "ProductSwatch",
    "ProductVariant",
    # Associations
    "product_product_type",
    "product_color_range",
    "product_tag",
    "product_analogous",
    "variant_vendor_color_range",
    "variant_vendor_product_type",
]
