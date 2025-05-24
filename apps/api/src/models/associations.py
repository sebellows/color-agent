from sqlalchemy import Table, Column, ForeignKey
from .base import Base

# Product to ProductType association
product_product_type = Table(
    "product_product_type",
    Base.metadata,
    Column(
        "product_id", ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "product_type_id",
        ForeignKey("product_types.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# Product to ColorRange association
product_color_range = Table(
    "product_color_range",
    Base.metadata,
    Column(
        "product_id",
        ForeignKey("products.id", ondelete="CASCADE"),
    ),
    Column(
        "color_range_id",
        ForeignKey("color_ranges.id", ondelete="CASCADE"),
    ),
)

# Product to Tag association
product_tag = Table(
    "product_tag",
    Base.metadata,
    Column(
        "product_id", ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    ),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

# Product to Analogous association
product_analogous = Table(
    "product_analogous",
    Base.metadata,
    Column(
        "product_id", ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "analogous_id", ForeignKey("analogous.id", ondelete="CASCADE"), primary_key=True
    ),
)

# ProductVariant to VendorColorRange association
variant_vendor_color_range = Table(
    "variant_vendor_color_range",
    Base.metadata,
    Column(
        "product_variant_id",
        ForeignKey("product_variants.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "vendor_color_range_id",
        ForeignKey("vendor_color_ranges.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# ProductVariant to VendorProductType association
variant_vendor_product_type = Table(
    "variant_vendor_product_type",
    Base.metadata,
    Column(
        "product_variant_id",
        ForeignKey("product_variants.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "vendor_product_type_id",
        ForeignKey("vendor_product_types.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
