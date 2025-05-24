from typing import Any
from functools import partial
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession

from ...core.database import get_db

from ...models import ColorRange, ProductType, Tag, Analogous


# Helper functions
async def _get_or_create_association(
    Model: Any, name: str, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Model).filter(Model.name == name))
    model = result.scalars().first()

    if not model:
        model = Model(name=name, products=[])
        db.add(model)
        await db.commit()
        await db.refresh(model)
    return model


get_or_create_color_range = partial(_get_or_create_association, Model=ColorRange)

get_or_create_product_type = partial(_get_or_create_association, Model=ProductType)

get_or_create_tag = partial(_get_or_create_association, Model=Tag)

get_or_create_analogous = partial(_get_or_create_association, Model=Analogous)


# (name: str, db: AsyncSession = Depends(get_db)):
#     result = await db.execute(select(ColorRange).filter(ColorRange.name == name))
#     color_range = result.scalars().first()

#     if not color_range:
#         color_range = ColorRange(name=name, products=[])
#         db.add(color_range)
#         await db.commit()
#         await db.refresh(color_range)
#     return color_range


# async def get_or_create_product_type(db: AsyncSession, name: str):
#     result = await db.execute(select(ProductType).filter(ProductType.name == name))
#     product_type = result.scalars().first()

#     if not product_type:
#         product_type = ProductType(name=name, products=[])
#         db.add(product_type)
#         await db.commit()
#         await db.refresh(product_type)
#     return product_type


# async def get_or_create_tag(db: AsyncSession, name: str):
#     result = await db.execute(select(Tag).filter(Tag.name == name))
#     tag = result.scalars().first()

#     if not tag:
#         tag = Tag(name=name, products=[])
#         db.add(tag)
#         await db.commit()
#         await db.refresh(tag)
#     return tag


# async def get_or_create_analogous(db: AsyncSession, value: str):
#     analogous = db.query(Analogous).filter(Analogous.value == value).first()
#     if not analogous:
#         analogous = Analogous(value=value)
#         db.add(analogous)
#         db.commit()
#         db.refresh(analogous)
#     return analogous
