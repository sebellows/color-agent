#!/usr/bin/env python
"""
Script to generate SQL statements from JSON data.
"""

import json
import sys
from pathlib import Path


def sanitize_string(s):
    """Sanitize a string for SQL."""
    if s is None:
        return "NULL"
    # Convert to string first to handle non-string types
    s_str = str(s)
    return f"'{s_str.replace("'", "''")}'"


def sanitize_array(arr):
    """Sanitize an array for SQL."""
    if arr is None or len(arr) == 0:
        return "NULL"
    # Handle arrays of different types
    sanitized = []
    for item in arr:
        if isinstance(item, (int, float)):
            sanitized.append(str(item))
        else:
            sanitized.append(sanitize_string(item))
    return f"ARRAY[{', '.join(sanitized)}]"


def sanitize_value(value):
    """Sanitize a value for SQL based on its type."""
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        return sanitize_array(value)
    if isinstance(value, dict):
        return sanitize_string(json.dumps(value))
    return sanitize_string(str(value))


def generate_vendor_sql(vendor):
    """Generate SQL for a vendor."""
    fields = [
        "vendor_name",
        "vendor_url",
        "slug",
        "platform",
        "description",
        "pdp_slug",
        "plp_slug",
    ]
    values = [sanitize_value(vendor.get(field)) for field in fields]

    sql = f"""
-- Insert vendor: {vendor["vendor_name"]}
INSERT INTO vendors (
    vendor_name, vendor_url, slug, platform, description, pdp_slug, plp_slug
) VALUES (
    {", ".join(values)}
) ON CONFLICT (slug) DO UPDATE SET
    vendor_name = EXCLUDED.vendor_name,
    vendor_url = EXCLUDED.vendor_url,
    platform = EXCLUDED.platform,
    description = EXCLUDED.description,
    pdp_slug = EXCLUDED.pdp_slug,
    plp_slug = EXCLUDED.plp_slug
RETURNING id;
"""
    return sql


def generate_product_line_sql(product_line, vendor_slug):
    """Generate SQL for a product line."""
    fields = [
        "product_line_name",
        "marketing_name",
        "slug",
        "vendor_slug",
        "product_line_type",
        "description",
    ]
    values = [sanitize_value(product_line.get(field)) for field in fields]

    sql = f"""
-- Insert product line: {product_line["product_line_name"]}
INSERT INTO product_lines (
    product_line_name, marketing_name, slug, vendor_slug, product_line_type, description, vendor_id
) VALUES (
    {", ".join(values)},
    (SELECT id FROM vendors WHERE slug = {sanitize_value(vendor_slug)})
) ON CONFLICT (slug) DO UPDATE SET
    product_line_name = EXCLUDED.product_line_name,
    marketing_name = EXCLUDED.marketing_name,
    vendor_slug = EXCLUDED.vendor_slug,
    product_line_type = EXCLUDED.product_line_type,
    description = EXCLUDED.description,
    vendor_id = EXCLUDED.vendor_id
RETURNING id;
"""
    return sql


def generate_product_sql(product, product_line_slug):
    """Generate SQL for a product."""
    fields = [
        "name",
        "product_type",
        "tags",
        "color_range",
        "analogous",
        "iscc_nbs_category",
    ]
    values = [sanitize_value(product.get(field)) for field in fields]

    # Handle swatch separately
    swatch = product.get("swatch", {})
    swatch_fields = [
        "hex_color",
        "rgb_color",
        "oklch_color",
        "gradient_start",
        "gradient_end",
        "overlay",
    ]
    swatch_values = [sanitize_value(swatch.get(field)) for field in swatch_fields]

    sql = f"""
-- Insert product: {product["name"]}
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        {", ".join(values)},
        (SELECT id FROM product_lines WHERE slug = {sanitize_value(product_line_slug)})
    ) ON CONFLICT (name, product_line_id) DO UPDATE SET
        product_type = EXCLUDED.product_type,
        tags = EXCLUDED.tags,
        color_range = EXCLUDED.color_range,
        analogous = EXCLUDED.analogous,
        iscc_nbs_category = EXCLUDED.iscc_nbs_category
    RETURNING id
)
INSERT INTO product_swatches (
    hex_color, rgb_color, oklch_color, gradient_start, gradient_end, overlay, product_id
) VALUES (
    {", ".join(swatch_values)},
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;
"""
    return sql


def generate_variant_sql(variant, product_name, product_line_slug):
    """Generate SQL for a product variant."""
    fields = [
        "display_name",
        "marketing_name",
        "sku",
        "vendor_color_range",
        "vendor_product_type",
        "opacity",
        "viscosity",
        "discontinued",
        "image_url",
        "packaging",
        "volume_ml",
        "volume_oz",
        "price",
        "currency_code",
        "currency_symbol",
        "country_code",
        "product_url",
        "language_code",
        "product_line",
        "application_method",
        "vendor_product_id",
    ]
    values = [sanitize_value(variant.get(field)) for field in fields]

    sql = f"""
-- Insert variant: {variant["display_name"]}
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    {", ".join(values)},
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = {sanitize_value(product_name)}
     AND pl.slug = {sanitize_value(product_line_slug)})
) ON CONFLICT (sku) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    marketing_name = EXCLUDED.marketing_name,
    vendor_color_range = EXCLUDED.vendor_color_range,
    vendor_product_type = EXCLUDED.vendor_product_type,
    opacity = EXCLUDED.opacity,
    viscosity = EXCLUDED.viscosity,
    discontinued = EXCLUDED.discontinued,
    image_url = EXCLUDED.image_url,
    packaging = EXCLUDED.packaging,
    volume_ml = EXCLUDED.volume_ml,
    volume_oz = EXCLUDED.volume_oz,
    price = EXCLUDED.price,
    currency_code = EXCLUDED.currency_code,
    currency_symbol = EXCLUDED.currency_symbol,
    country_code = EXCLUDED.country_code,
    product_url = EXCLUDED.product_url,
    language_code = EXCLUDED.language_code,
    product_line = EXCLUDED.product_line,
    application_method = EXCLUDED.application_method,
    vendor_product_id = EXCLUDED.vendor_product_id;
"""
    return sql


def process_json_data(json_data):
    """Process JSON data and generate SQL statements."""
    sql_statements = []

    for vendor in json_data:
        # Generate vendor SQL
        sql_statements.append(generate_vendor_sql(vendor))

        # Process product lines
        for product_line in vendor.get("product_lines", []):
            sql_statements.append(
                generate_product_line_sql(product_line, vendor["slug"])
            )

            # Process products
            for product in product_line.get("products", []):
                sql_statements.append(
                    generate_product_sql(product, product_line["slug"])
                )

                # Process variants
                for variant in product.get("variants", []):
                    sql_statements.append(
                        generate_variant_sql(
                            variant, product["name"], product_line["slug"]
                        )
                    )

    return sql_statements


def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python generate_sql.py <json_file>")
        sys.exit(1)

    json_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "import_data.sql"

    try:
        with open(json_file, "r") as f:
            json_data = json.load(f)

        sql_statements = process_json_data(json_data)

        with open(output_file, "w") as f:
            f.write("-- Auto-generated SQL statements for importing data\n\n")
            f.write("BEGIN;\n\n")
            f.write("\n".join(sql_statements))
            f.write("\n\nCOMMIT;\n")

        print(f"SQL statements generated successfully and saved to {output_file}")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
