from typing import Annotated
from uuid import UUID

from api.core.enums import ProductTypeEnum
from pydantic import BaseModel, Field


# ProductType schemas
class ProductTypeBase(BaseModel):
    name: Annotated[ProductTypeEnum, Field(description="Product type name")]


class ProductTypeCreate(ProductTypeBase):
    pass


class ProductTypeUpdate(ProductTypeBase):
    pass


class ProductType(ProductTypeBase):
    id: Annotated[UUID, Field(description="Unique identifier")]

    class Config:
        from_attributes = True
