-- Auto-generated SQL statements for importing data

BEGIN;


-- Insert vendor: Games Workshop
INSERT INTO vendors (
    vendor_name, vendor_url, slug, platform, description, pdp_slug, plp_slug
) VALUES (
    'Games Workshop', 'https://www.warhammer.com', 'games_workshop', 'Algolia', '%3Cp%3E%3Cb%3E%3Ca%20href%3D%22https%3A//warhammer.com%22%3EGames%20Workshop%3C/a%3E%3C/b%3E%2C%20founded%20in%20the%20UK%20in%201975%2C%20is%20the%20company%20behind%20popular%20table-top%20games%20like%20%3Ci%3EWarhammer%2040%2C000%3C/i%3E%20and%20%3Ci%3EAge%20of%20Sigmar%3C/i%3E.%20They%20market%20their%20own%20retail%20line%20of%20acrylic%20paints%20under%20their%20subsidiary%20Citadel%20Miniatures%20%28labelled%20simply%20as%20%22Citadel%22%29.%3C/p%3E', 'shop', 'plp'
) ON CONFLICT (slug) DO UPDATE SET
    vendor_name = EXCLUDED.vendor_name,
    vendor_url = EXCLUDED.vendor_url,
    platform = EXCLUDED.platform,
    description = EXCLUDED.description,
    pdp_slug = EXCLUDED.pdp_slug,
    plp_slug = EXCLUDED.plp_slug
RETURNING id;


-- Insert product line: Citadel
INSERT INTO product_lines (
    product_line_name, marketing_name, slug, vendor_slug, product_line_type, description, vendor_id
) VALUES (
    'Citadel', 'Citadel Paints', 'citadel', '', 'Mixed', '',
    (SELECT id FROM vendors WHERE slug = 'games_workshop')
) ON CONFLICT (slug) DO UPDATE SET
    product_line_name = EXCLUDED.product_line_name,
    marketing_name = EXCLUDED.marketing_name,
    vendor_slug = EXCLUDED.vendor_slug,
    product_line_type = EXCLUDED.product_line_type,
    description = EXCLUDED.description,
    vendor_id = EXCLUDED.vendor_id
RETURNING id;


-- Insert product: Leadbelcher
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        'Leadbelcher', ARRAY['Acrylic', 'Metallic'], NULL, ARRAY['Silver'], NULL, 'Blackish Green',
        (SELECT id FROM product_lines WHERE slug = 'citadel')
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
    '#7b868e', ARRAY[123, 134, 142], ARRAY[0.61, 0.0175, 237.72], ARRAY[0.61, 0.0175, 237.72], ARRAY[0.229, 0.0175, 237.72], 'chrome',
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;


-- Insert variant: Leadbelcher
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Leadbelcher', 'Leadbelcher', 'prod4540241-13209999111', ARRAY['Silver'], ARRAY['Spray'], 'opaque', 'low', FALSE, '/app/resources/catalog/product/920x950/99209999051_sprayLeadbelcher.svg', 'Spray Can', 295.735, 10.0, 2400, 'USD', '$', 'US', 'https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020', 'en', 'Citadel', 'Primer', '5ba77422-91cb-46dd-98d1-c108588cf6b6',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Leadbelcher'
     AND pl.slug = 'citadel')
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


-- Insert variant: Leadbelcher
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Leadbelcher', 'Leadbelcher', 'prod4210283-99189950235', ARRAY['Silver'], ARRAY['Base'], 'opaque', 'medium-to-high', FALSE, '/app/resources/catalog/product/920x950/99189950028_baseLeadbelcher.svg', 'Pot', 18.0, 0.609, 455, 'USD', '$', 'US', 'https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020', 'en', 'Citadel', NULL, '7e65291e-5930-41aa-b1a6-e16e069b80f3',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Leadbelcher'
     AND pl.slug = 'citadel')
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


-- Insert variant: Leadbelcher
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Leadbelcher', 'Leadbelcher', 'prod4190214-99189958146', ARRAY['Silver'], ARRAY['Air'], 'semi-opaque', 'low', FALSE, '/app/resources/catalog/product/920x950/99189958068_airLeadbelcher.svg', 'Pot', 18.0, 0.609, 780, 'USD', '$', 'US', 'https://www.warhammer.com/en-US/shop/Leadbelcher-Spray-US-2020', 'en', 'Citadel', 'Air', '70947164-52f3-4a2b-9651-4d4c2d5bafbf',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Leadbelcher'
     AND pl.slug = 'citadel')
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


-- Insert product: Wraithbone
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        'Wraithbone', ARRAY['Acrylic', 'Primer'], NULL, ARRAY['Green'], ARRAY['Yellow Green'], 'Pale Yellow Green',
        (SELECT id FROM product_lines WHERE slug = 'citadel')
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
    '#dbd1b2', ARRAY[219, 209, 178], ARRAY[0.8607, 0.0429, 92.23], ARRAY[0.8607, 0.0429, 92.23], ARRAY[0.8607, 0.0429, 92.23], NULL,
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;


-- Insert variant: Wraithbone
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Wraithbone', 'Wraithbone', 'prod4540239-13209999105', ARRAY['Bone'], ARRAY['Spray'], 'opaque', 'low', FALSE, '/app/resources/catalog/product/920x950/99209999059_sprayWraithBone.svg', 'Spray Can', 295.735, 10.0, 2400, 'USD', '$', 'US', 'https://www.warhammer.com/en-US/shop/Wraithbone-Spray-US-2020', 'en', 'Citadel', 'Primer', '1d0f1240-cabc-48b5-ac7b-7388b38f0541',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Wraithbone'
     AND pl.slug = 'citadel')
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


-- Insert variant: Wraithbone
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Wraithbone', 'Wraithbone', 'prod4190166-99189950259', ARRAY['Bone'], ARRAY['Base'], 'opaque', 'medium-to-high', FALSE, '/app/resources/catalog/product/920x950/99189950173_baseWraithBone.svg', 'Pot', 18.0, 0.609, 455, 'USD', '$', 'US', 'https://www.warhammer.com/en-US/shop/Wraithbone-Spray-US-2020', 'en', 'Citadel', NULL, '3d6d8832-f9c9-4092-aecd-77dba3ddb94e',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Wraithbone'
     AND pl.slug = 'citadel')
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


-- Insert product: Grey Seer
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        'Grey Seer', ARRAY['Acrylic', 'Primer'], NULL, ARRAY['Blue', 'Grey'], NULL, 'Pale Blue',
        (SELECT id FROM product_lines WHERE slug = 'citadel')
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
    '#a2a5a7', ARRAY[162, 165, 167], ARRAY[0.7201, 0.0045, 236.52], ARRAY[0.7201, 0.0045, 236.52], ARRAY[0.7201, 0.0045, 236.52], NULL,
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;


-- Insert variant: Grey Seer
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Grey Seer', 'Grey Seer', 'prod4540238-13209999106', ARRAY['Grey'], ARRAY['Spray'], 'opaque', 'low', FALSE, '/app/resources/catalog/product/920x950/99209999060_sprayGreySeer.svg', 'Spray Can', 295.735, 10.0, 2400, 'USD', '$', 'US', 'https://www.warhammer.com/en-US/shop/Grey-Seer-Spray-US-2020', 'en', 'Citadel', 'Primer', '0612cf8a-05b9-4e7c-b935-4e403a890dec',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Grey Seer'
     AND pl.slug = 'citadel')
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


-- Insert variant: Grey Seer
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Grey Seer', 'Grey Seer', 'prod4190167-99189950260', ARRAY['Grey'], ARRAY['Base'], 'opaque', 'medium-to-high', FALSE, '/app/resources/catalog/product/920x950/99189950174_baseGreySeer.svg', 'Pot', 18.0, 0.609, 455, 'USD', '$', 'US', 'https://www.warhammer.com/en-US/shop/Grey-Seer-Spray-US-2020', 'en', 'Citadel', NULL, 'afed8b1f-4f25-416b-b9fd-0845e75771aa',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Grey Seer'
     AND pl.slug = 'citadel')
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


-- Insert vendor: The Army Painter
INSERT INTO vendors (
    vendor_name, vendor_url, slug, platform, description, pdp_slug, plp_slug
) VALUES (
    'The Army Painter', 'https://thearmypainter.com', 'army_painter', 'Shopify', '%3Cp%3E%3Cb%3E%3Ca%20href%3D%22https%3A//thearmypainter.com%22%3EThe%20Army%20Painter%3C/a%3E%3C/b%3E%20is%20a%20producer%20of%20hobby-related%20products%20that%20was%20founded%20in%20Denmark%20in%202007.%3C/p%3E', 'products', 'collections'
) ON CONFLICT (slug) DO UPDATE SET
    vendor_name = EXCLUDED.vendor_name,
    vendor_url = EXCLUDED.vendor_url,
    platform = EXCLUDED.platform,
    description = EXCLUDED.description,
    pdp_slug = EXCLUDED.pdp_slug,
    plp_slug = EXCLUDED.plp_slug
RETURNING id;


-- Insert product line: Warpaints Fanatic
INSERT INTO product_lines (
    product_line_name, marketing_name, slug, vendor_slug, product_line_type, description, vendor_id
) VALUES (
    'Warpaints Fanatic', 'Warpaints Fanatic', 'warpaints_fanatic', 'warpaints-fanatic', 'Mixed', 'The Warpaints Fanatic line uses a practical color naming system, based on ISCC NBS color designations, and a flexible triad system for making it easier to create harmonious and smooth color transitions.',
    (SELECT id FROM vendors WHERE slug = 'army_painter')
) ON CONFLICT (slug) DO UPDATE SET
    product_line_name = EXCLUDED.product_line_name,
    marketing_name = EXCLUDED.marketing_name,
    vendor_slug = EXCLUDED.vendor_slug,
    product_line_type = EXCLUDED.product_line_type,
    description = EXCLUDED.description,
    vendor_id = EXCLUDED.vendor_id
RETURNING id;


-- Insert product: Matt Black
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        'Matt Black', ARRAY['Acrylic'], NULL, ARRAY['Black'], ARRAY['Ebony'], 'Black',
        (SELECT id FROM product_lines WHERE slug = 'warpaints_fanatic')
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
    '#040302', ARRAY[4, 3, 2], ARRAY[0.0986, 0.0063, 72.53], ARRAY[0.0986, 0.0063, 72.53], ARRAY[0.0986, 0.0063, 72.53], NULL,
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;


-- Insert variant: Matt Black
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Matt Black', 'Warpaints Fanatic: Matt Black', 'WP3001P', ARRAY['White/Grey/Black'], ARRAY['Acrylics'], 'semi-opaque', 'medium', NULL, 'https://cdn.shopify.com/s/files/1/0636/1232/1970/files/WP3001-MattBlack-Acrylics-1copy_7ebcd050-502a-4194-a54d-d1153f90bd7c.jpg?v=1712751313', 'Dropper Bottle', 18.0, 0.609, 425, 'USD', '$', 'US', 'https://us.thearmypainter.com/products/warpaints-fanatic-matt-black', 'en', 'Warpaints Fanatic', NULL, '7891271778482',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Matt Black'
     AND pl.slug = 'warpaints_fanatic')
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


-- Insert variant: Matt Black
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Matt Black', 'Warpaints Air: Matt Black', 'AW1101P', ARRAY['White/Grey/Black'], NULL, 'opaque', 'low', NULL, 'https://cdn.shopify.com/s/files/1/0636/1232/1970/files/AW1101-MattBlack-Imgnr.1copy_159e043e-8b9a-465c-927b-c749fd454e74.jpg?v=1708412836', 'Dropper Bottle', 18.0, 0.609, 375, 'USD', '$', 'US', 'https://us.thearmypainter.com/products/warpaints-air-matt-black', 'en', 'Warpaints Air', 'Air', '7891258900658',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Matt Black'
     AND pl.slug = 'warpaints_fanatic')
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


-- Insert product: Deep Grey
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        'Deep Grey', ARRAY['Acrylic'], NULL, ARRAY['Grey'], NULL, 'Dark Bluish Gray',
        (SELECT id FROM product_lines WHERE slug = 'warpaints_fanatic')
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
    '#595e65', ARRAY[89, 94, 101], ARRAY[0.48, 0.0129, 256.74], ARRAY[0.48, 0.0129, 256.74], ARRAY[0.48, 0.0129, 256.74], NULL,
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;


-- Insert variant: Deep Grey
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Deep Grey', 'Warpaints Fanatic: Deep Grey', 'WP3002P', ARRAY['White/Grey/Black'], ARRAY['Acrylics'], 'semi-opaque', 'medium', NULL, 'https://cdn.shopify.com/s/files/1/0636/1232/1970/files/WP3002-DeepGrey-Acrylics-1copy_77dd3c3d-8b8c-45c6-a8b0-e93a0e90b952.jpg?v=1712751313', 'Dropper Bottle', 18.0, 0.609, 425, 'USD', '$', 'US', 'https://us.thearmypainter.com/products/warpaints-fanatic-deep-grey', 'en', 'Warpaints Fanatic', NULL, '7891277545650',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Deep Grey'
     AND pl.slug = 'warpaints_fanatic')
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


-- Insert product line: Speedpaint
INSERT INTO product_lines (
    product_line_name, marketing_name, slug, vendor_slug, product_line_type, description, vendor_id
) VALUES (
    'Speedpaint', 'Speedpaint 2.0', 'speedpaint', 'speedpaint', 'Contrast', 'The all-in-one Speedpaint is a true one-coat painting solution offering rich shading, vibrant saturation, and an easy highlight simultaneously. Simply apply one coat of Speedpaint directly over a primed miniature and you are done!',
    (SELECT id FROM vendors WHERE slug = 'army_painter')
) ON CONFLICT (slug) DO UPDATE SET
    product_line_name = EXCLUDED.product_line_name,
    marketing_name = EXCLUDED.marketing_name,
    vendor_slug = EXCLUDED.vendor_slug,
    product_line_type = EXCLUDED.product_line_type,
    description = EXCLUDED.description,
    vendor_id = EXCLUDED.vendor_id
RETURNING id;


-- Insert product: Goddess Glow
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        'Goddess Glow', ARRAY['Contrast', 'Flesh'], NULL, ARRAY['Brown', 'Red'], ARRAY['Indian Red', 'Rose Taupe'], 'Grayish Red',
        (SELECT id FROM product_lines WHERE slug = 'speedpaint')
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
    '#995650', ARRAY[153, 86, 80], ARRAY[0.5296, 0.0899, 25.95], ARRAY[0.5492, 0.0536, 31.56], ARRAY[0.4583, 0.0746, 22.65], NULL,
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;


-- Insert variant: Goddess Glow
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Goddess Glow', 'Speedpaint: Goddess Glow', 'WP2038P', ARRAY['Skin Tone'], NULL, 'semi-transparent', 'low', NULL, 'https://cdn.shopify.com/s/files/1/0636/1232/1970/files/WP2038-GoddessGlow-img1_73e39958-ea97-45f9-9644-281d8b5da06b.jpg?v=1708413637', 'Dropper Bottle', 18.0, 0.609, 499, 'USD', '$', 'US', 'https://us.thearmypainter.com/products/speedpaint-goddess-glow', NULL, 'Speedpaint', NULL, '7891279347890',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Goddess Glow'
     AND pl.slug = 'speedpaint')
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


-- Insert product: Bony Matter
WITH product_insert AS (
    INSERT INTO products (
        name, product_type, tags, color_range, analogous, iscc_nbs_category, product_line_id
    ) VALUES (
        'Bony Matter', ARRAY['Contrast'], NULL, ARRAY['Brown'], NULL, 'Light Grayish Brown',
        (SELECT id FROM product_lines WHERE slug = 'speedpaint')
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
    '#a18b73', ARRAY[161, 139, 115], ARRAY[0.6503, 0.0434, 69.39], ARRAY[0.686, 0.0634, 67.26], ARRAY[0.615, 0.062, 59.37], NULL,
    (SELECT id FROM product_insert)
) ON CONFLICT (product_id) DO UPDATE SET
    hex_color = EXCLUDED.hex_color,
    rgb_color = EXCLUDED.rgb_color,
    oklch_color = EXCLUDED.oklch_color,
    gradient_start = EXCLUDED.gradient_start,
    gradient_end = EXCLUDED.gradient_end,
    overlay = EXCLUDED.overlay;


-- Insert variant: Bony Matter
INSERT INTO product_variants (
    display_name, marketing_name, sku, vendor_color_range, vendor_product_type, 
    opacity, viscosity, discontinued, image_url, packaging, 
    volume_ml, volume_oz, price, currency_code, currency_symbol, 
    country_code, product_url, language_code, product_line, application_method, 
    vendor_product_id, product_id
) VALUES (
    'Bony Matter', 'Speedpaint: Bony Matter', 'WP2039P', ARRAY['Brown'], NULL, 'semi-transparent', 'low', NULL, 'https://cdn.shopify.com/s/files/1/0636/1232/1970/files/WP2039-BonyMatter-img1_0786c1ae-0c83-49d7-9dd2-831dde236fac.jpg?v=1708413657', 'Dropper Bottle', 18.0, 0.609, 499, 'USD', '$', 'US', 'https://us.thearmypainter.com/products/speedpaint-bony-matter', NULL, 'Speedpaint', NULL, '7891277447346',
    (SELECT p.id FROM products p
     JOIN product_lines pl ON p.product_line_id = pl.id
     WHERE p.name = 'Bony Matter'
     AND pl.slug = 'speedpaint')
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


COMMIT;
