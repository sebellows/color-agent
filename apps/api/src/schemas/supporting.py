from typing import Optional, List, Annotated
from pydantic import BaseModel, Field, ConfigDict
from ..core.enums import ProductTypeEnum, ColorRangeEnum


# ProductType schemas
class ProductTypeBase(BaseModel):
    name: Annotated[ProductTypeEnum, Field(description="Product type name")]


class ProductTypeCreate(ProductTypeBase):
    pass


class ProductTypeUpdate(ProductTypeBase):
    pass


class ProductType(ProductTypeBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]


# ColorRange schemas
class ColorRangeBase(BaseModel):
    name: Annotated[ColorRangeEnum, Field(description="Color range name")]


class ColorRangeCreate(ColorRangeBase):
    pass


class ColorRangeUpdate(ColorRangeBase):
    pass


class ColorRange(ColorRangeBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]


# Tag schemas
class TagBase(BaseModel):
    name: Annotated[str, Field(description="Tag name")]


class TagCreate(TagBase):
    pass


class TagUpdate(TagBase):
    pass


class Tag(TagBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]


# Analogous schemas
class AnalogousBase(BaseModel):
    name: Annotated[str, Field(description="Analogous color name")]


class AnalogousCreate(AnalogousBase):
    pass


class AnalogousUpdate(AnalogousBase):
    pass


class Analogous(AnalogousBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]


# VendorColorRange schemas
class VendorColorRangeBase(BaseModel):
    name: Annotated[str, Field(description="Vendor color range name")]


class VendorColorRangeCreate(VendorColorRangeBase):
    pass


class VendorColorRangeUpdate(VendorColorRangeBase):
    pass


class VendorColorRange(VendorColorRangeBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]


# VendorProductType schemas
class VendorProductTypeBase(BaseModel):
    name: Annotated[str, Field(description="Vendor product type name")]


class VendorProductTypeCreate(VendorProductTypeBase):
    pass


class VendorProductTypeUpdate(VendorProductTypeBase):
    pass


class VendorProductType(VendorProductTypeBase):
    model_config = ConfigDict(from_attributes=True)

    id: Annotated[int, Field(description="Unique identifier")]
