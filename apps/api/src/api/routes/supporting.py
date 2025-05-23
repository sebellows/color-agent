from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ...core.database import get_db
from ...models import (
    ProductType,
    ColorRange,
    Tag,
    Analogous,
    VendorColorRange,
    VendorProductType,
)
from ...schemas import (
    # ProductType schemas
    ProductType as ProductTypeSchema,
    ProductTypeCreate,
    ProductTypeUpdate,
    # ColorRange schemas
    ColorRange as ColorRangeSchema,
    ColorRangeCreate,
    ColorRangeUpdate,
    # Tag schemas
    Tag as TagSchema,
    TagCreate,
    TagUpdate,
    # Analogous schemas
    Analogous as AnalogousSchema,
    AnalogousCreate,
    AnalogousUpdate,
    # VendorColorRange schemas
    VendorColorRange as VendorColorRangeSchema,
    VendorColorRangeCreate,
    VendorColorRangeUpdate,
    # VendorProductType schemas
    VendorProductType as VendorProductTypeSchema,
    VendorProductTypeCreate,
    VendorProductTypeUpdate,
)

router = APIRouter()


# ProductType routes
@router.post(
    "/product-types/",
    response_model=ProductTypeSchema,
    status_code=HTTPException.HTTP_201_CREATED,
)
async def create_product_type(
    product_type_in: ProductTypeCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new product type"""
    product_type = ProductType(**product_type_in.model_dump())
    db.add(product_type)
    await db.commit()
    await db.refresh(product_type)
    return product_type


@router.get("/product-types/{product_type_id}", response_model=ProductTypeSchema)
async def get_product_type(product_type_id: int, db: AsyncSession = Depends(get_db)):
    """Get a product type by ID"""
    result = await db.execute(
        select(ProductType).filter(ProductType.id == product_type_id)
    )
    product_type = result.scalars().first()
    if not product_type:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Product type with ID {product_type_id} not found",
        )
    return product_type


@router.get("/product-types/", response_model=list[ProductTypeSchema])
async def list_product_types(db: AsyncSession = Depends(get_db)):
    """List all product types"""
    result = await db.execute(select(ProductType))
    product_types = result.scalars().all()
    return product_types


@router.put("/product-types/{product_type_id}", response_model=ProductTypeSchema)
async def update_product_type(
    product_type_id: int,
    product_type_in: ProductTypeUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a product type"""
    result = await db.execute(
        select(ProductType).filter(ProductType.id == product_type_id)
    )
    product_type = result.scalars().first()
    if not product_type:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Product type with ID {product_type_id} not found",
        )

    update_data = product_type_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product_type, key, value)

    await db.commit()
    await db.refresh(product_type)
    return product_type


@router.delete(
    "/product-types/{product_type_id}", status_code=HTTPException.HTTP_204_NO_CONTENT
)
async def delete_product_type(product_type_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a product type"""
    result = await db.execute(
        select(ProductType).filter(ProductType.id == product_type_id)
    )
    product_type = result.scalars().first()
    if not product_type:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Product type with ID {product_type_id} not found",
        )

    await db.delete(product_type)
    await db.commit()
    return None


# ColorRange routes
@router.post(
    "/color-ranges/",
    response_model=ColorRangeSchema,
    status_code=HTTPException.HTTP_201_CREATED,
)
async def create_color_range(
    color_range_in: ColorRangeCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new color range"""
    color_range = ColorRange(**color_range_in.model_dump())
    db.add(color_range)
    await db.commit()
    await db.refresh(color_range)
    return color_range


@router.get("/color-ranges/{color_range_id}", response_model=ColorRangeSchema)
async def get_color_range(color_range_id: int, db: AsyncSession = Depends(get_db)):
    """Get a color range by ID"""
    result = await db.execute(
        select(ColorRange).filter(ColorRange.id == color_range_id)
    )
    color_range = result.scalars().first()
    if not color_range:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Color range with ID {color_range_id} not found",
        )
    return color_range


@router.get("/color-ranges/", response_model=list[ColorRangeSchema])
async def list_color_ranges(db: AsyncSession = Depends(get_db)):
    """List all color ranges"""
    result = await db.execute(select(ColorRange))
    color_ranges = result.scalars().all()
    return color_ranges


@router.put("/color-ranges/{color_range_id}", response_model=ColorRangeSchema)
async def update_color_range(
    color_range_id: int,
    color_range_in: ColorRangeUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a color range"""
    result = await db.execute(
        select(ColorRange).filter(ColorRange.id == color_range_id)
    )
    color_range = result.scalars().first()
    if not color_range:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Color range with ID {color_range_id} not found",
        )

    update_data = color_range_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(color_range, key, value)

    await db.commit()
    await db.refresh(color_range)
    return color_range


@router.delete(
    "/color-ranges/{color_range_id}", status_code=HTTPException.HTTP_204_NO_CONTENT
)
async def delete_color_range(color_range_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a color range"""
    result = await db.execute(
        select(ColorRange).filter(ColorRange.id == color_range_id)
    )
    color_range = result.scalars().first()
    if not color_range:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Color range with ID {color_range_id} not found",
        )

    await db.delete(color_range)
    await db.commit()
    return None


# Tag routes
@router.post(
    "/tags/", response_model=TagSchema, status_code=HTTPException.HTTP_201_CREATED
)
async def create_tag(tag_in: TagCreate, db: AsyncSession = Depends(get_db)):
    """Create a new tag"""
    tag = Tag(**tag_in.model_dump())
    db.add(tag)
    await db.commit()
    await db.refresh(tag)
    return tag


@router.get("/tags/{tag_id}", response_model=TagSchema)
async def get_tag(tag_id: int, db: AsyncSession = Depends(get_db)):
    """Get a tag by ID"""
    result = await db.execute(select(Tag).filter(Tag.id == tag_id))
    tag = result.scalars().first()
    if not tag:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {tag_id} not found",
        )
    return tag


@router.get("/tags/", response_model=list[TagSchema])
async def list_tags(db: AsyncSession = Depends(get_db)):
    """List all tags"""
    result = await db.execute(select(Tag))
    tags = result.scalars().all()
    return tags


@router.put("/tags/{tag_id}", response_model=TagSchema)
async def update_tag(
    tag_id: int, tag_in: TagUpdate, db: AsyncSession = Depends(get_db)
):
    """Update a tag"""
    result = await db.execute(select(Tag).filter(Tag.id == tag_id))
    tag = result.scalars().first()
    if not tag:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {tag_id} not found",
        )

    update_data = tag_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(tag, key, value)

    await db.commit()
    await db.refresh(tag)
    return tag


@router.delete("/tags/{tag_id}", status_code=HTTPException.HTTP_204_NO_CONTENT)
async def delete_tag(tag_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a tag"""
    result = await db.execute(select(Tag).filter(Tag.id == tag_id))
    tag = result.scalars().first()
    if not tag:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {tag_id} not found",
        )

    await db.delete(tag)
    await db.commit()
    return None


# Analogous routes
@router.post(
    "/analogous/",
    response_model=AnalogousSchema,
    status_code=HTTPException.HTTP_201_CREATED,
)
async def create_analogous(
    analogous_in: AnalogousCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new analogous color"""
    analogous = Analogous(**analogous_in.model_dump())
    db.add(analogous)
    await db.commit()
    await db.refresh(analogous)
    return analogous


@router.get("/analogous/{analogous_id}", response_model=AnalogousSchema)
async def get_analogous(analogous_id: int, db: AsyncSession = Depends(get_db)):
    """Get an analogous color by ID"""
    result = await db.execute(select(Analogous).filter(Analogous.id == analogous_id))
    analogous = result.scalars().first()
    if not analogous:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Analogous color with ID {analogous_id} not found",
        )
    return analogous


@router.get("/analogous/", response_model=list[AnalogousSchema])
async def list_analogous(db: AsyncSession = Depends(get_db)):
    """List all analogous colors"""
    result = await db.execute(select(Analogous))
    analogous_colors = result.scalars().all()
    return analogous_colors


@router.put("/analogous/{analogous_id}", response_model=AnalogousSchema)
async def update_analogous(
    analogous_id: int, analogous_in: AnalogousUpdate, db: AsyncSession = Depends(get_db)
):
    """Update an analogous color"""
    result = await db.execute(select(Analogous).filter(Analogous.id == analogous_id))
    analogous = result.scalars().first()
    if not analogous:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Analogous color with ID {analogous_id} not found",
        )

    update_data = analogous_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(analogous, key, value)

    await db.commit()
    await db.refresh(analogous)
    return analogous


@router.delete(
    "/analogous/{analogous_id}", status_code=HTTPException.HTTP_204_NO_CONTENT
)
async def delete_analogous(analogous_id: int, db: AsyncSession = Depends(get_db)):
    """Delete an analogous color"""
    result = await db.execute(select(Analogous).filter(Analogous.id == analogous_id))
    analogous = result.scalars().first()
    if not analogous:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Analogous color with ID {analogous_id} not found",
        )

    await db.delete(analogous)
    await db.commit()
    return None


# VendorColorRange routes
@router.post(
    "/vendor-color-ranges/",
    response_model=VendorColorRangeSchema,
    status_code=HTTPException.HTTP_201_CREATED,
)
async def create_vendor_color_range(
    vendor_color_range_in: VendorColorRangeCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new vendor color range"""
    vendor_color_range = VendorColorRange(**vendor_color_range_in.model_dump())
    db.add(vendor_color_range)
    await db.commit()
    await db.refresh(vendor_color_range)
    return vendor_color_range


@router.get(
    "/vendor-color-ranges/{vendor_color_range_id}",
    response_model=VendorColorRangeSchema,
)
async def get_vendor_color_range(
    vendor_color_range_id: int, db: AsyncSession = Depends(get_db)
):
    """Get a vendor color range by ID"""
    result = await db.execute(
        select(VendorColorRange).filter(VendorColorRange.id == vendor_color_range_id)
    )
    vendor_color_range = result.scalars().first()
    if not vendor_color_range:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Vendor color range with ID {vendor_color_range_id} not found",
        )
    return vendor_color_range


@router.get("/vendor-color-ranges/", response_model=list[VendorColorRangeSchema])
async def list_vendor_color_ranges(db: AsyncSession = Depends(get_db)):
    """List all vendor color ranges"""
    result = await db.execute(select(VendorColorRange))
    vendor_color_ranges = result.scalars().all()
    return vendor_color_ranges


@router.put(
    "/vendor-color-ranges/{vendor_color_range_id}",
    response_model=VendorColorRangeSchema,
)
async def update_vendor_color_range(
    vendor_color_range_id: int,
    vendor_color_range_in: VendorColorRangeUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a vendor color range"""
    result = await db.execute(
        select(VendorColorRange).filter(VendorColorRange.id == vendor_color_range_id)
    )
    vendor_color_range = result.scalars().first()
    if not vendor_color_range:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Vendor color range with ID {vendor_color_range_id} not found",
        )

    update_data = vendor_color_range_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vendor_color_range, key, value)

    await db.commit()
    await db.refresh(vendor_color_range)
    return vendor_color_range


@router.delete(
    "/vendor-color-ranges/{vendor_color_range_id}",
    status_code=HTTPException.HTTP_204_NO_CONTENT,
)
async def delete_vendor_color_range(
    vendor_color_range_id: int, db: AsyncSession = Depends(get_db)
):
    """Delete a vendor color range"""
    result = await db.execute(
        select(VendorColorRange).filter(VendorColorRange.id == vendor_color_range_id)
    )
    vendor_color_range = result.scalars().first()
    if not vendor_color_range:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Vendor color range with ID {vendor_color_range_id} not found",
        )

    await db.delete(vendor_color_range)
    await db.commit()
    return None


# VendorProductType routes
@router.post(
    "/vendor-product-types/",
    response_model=VendorProductTypeSchema,
    status_code=HTTPException.HTTP_201_CREATED,
)
async def create_vendor_product_type(
    vendor_product_type_in: VendorProductTypeCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new vendor product type"""
    vendor_product_type = VendorProductType(**vendor_product_type_in.model_dump())
    db.add(vendor_product_type)
    await db.commit()
    await db.refresh(vendor_product_type)
    return vendor_product_type


@router.get(
    "/vendor-product-types/{vendor_product_type_id}",
    response_model=VendorProductTypeSchema,
)
async def get_vendor_product_type(
    vendor_product_type_id: int, db: AsyncSession = Depends(get_db)
):
    """Get a vendor product type by ID"""
    result = await db.execute(
        select(VendorProductType).filter(VendorProductType.id == vendor_product_type_id)
    )
    vendor_product_type = result.scalars().first()
    if not vendor_product_type:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Vendor product type with ID {vendor_product_type_id} not found",
        )
    return vendor_product_type


@router.get("/vendor-product-types/", response_model=list[VendorProductTypeSchema])
async def list_vendor_product_types(db: AsyncSession = Depends(get_db)):
    """List all vendor product types"""
    result = await db.execute(select(VendorProductType))
    vendor_product_types = result.scalars().all()
    return vendor_product_types


@router.put(
    "/vendor-product-types/{vendor_product_type_id}",
    response_model=VendorProductTypeSchema,
)
async def update_vendor_product_type(
    vendor_product_type_id: int,
    vendor_product_type_in: VendorProductTypeUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a vendor product type"""
    result = await db.execute(
        select(VendorProductType).filter(VendorProductType.id == vendor_product_type_id)
    )
    vendor_product_type = result.scalars().first()
    if not vendor_product_type:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Vendor product type with ID {vendor_product_type_id} not found",
        )

    update_data = vendor_product_type_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vendor_product_type, key, value)

    await db.commit()
    await db.refresh(vendor_product_type)
    return vendor_product_type


@router.delete(
    "/vendor-product-types/{vendor_product_type_id}",
    status_code=HTTPException.HTTP_204_NO_CONTENT,
)
async def delete_vendor_product_type(
    vendor_product_type_id: int, db: AsyncSession = Depends(get_db)
):
    """Delete a vendor product type"""
    result = await db.execute(
        select(VendorProductType).filter(VendorProductType.id == vendor_product_type_id)
    )
    vendor_product_type = result.scalars().first()
    if not vendor_product_type:
        raise HTTPException(
            status_code=HTTPException.HTTP_404_NOT_FOUND,
            detail=f"Vendor product type with ID {vendor_product_type_id} not found",
        )

    await db.delete(vendor_product_type)
    await db.commit()
    return None
