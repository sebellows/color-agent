from typing import Annotated
from uuid import UUID

from domain.enums import ProductLineTypeEnum
from pydantic import BaseModel, Field
from schemas.mixins import (
    SoftDeletionSchema,
    TimestampSchema,
)


class ProductLineBase(BaseModel):
    name: Annotated[str, Field(description="Product line name")]
    marketing_name: Annotated[str, Field(description="Marketing name for the product line")]
    vendor_slug: Annotated[str | None, Field(description="Vendor-specific slug used on their platform", default=None)]
    product_line_type: Annotated[
        ProductLineTypeEnum | None,
        Field(description="Type of product line", examples=["Effect", "Mixed"]),
    ]
    description: Annotated[str | None, Field(description="Product line description", default=None)]

    class Config:
        from_attributes = True
        # Use enum values instead of names for serialization
        # (for `product_line_type`)
        use_enum_values = True


class ProductLineCreate(ProductLineBase):
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]
    slug: Annotated[
        str | None,
        Field(description="Unique identifier slug", examples=["warpaints_fanatic", "game_color"]),
    ]


class ProductLineUpdate(BaseModel):
    product_line_type: Annotated[
        ProductLineTypeEnum | None,
        Field(description="Type of product line", examples=["Effect", "Mixed"], default=None),
    ]
    description: Annotated[str | None, Field(description="Product line description", default=None)]

    class Config:
        from_attributes = True
        use_enum_values = True


class ProductLineDelete(BaseModel, SoftDeletionSchema):
    """Product Line delete schema"""

    pass


class ProductLineRead(ProductLineBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]
    slug: Annotated[
        str | None,
        Field(description="Unique identifier slug", examples=["warpaints_fanatic", "game_color"]),
    ]


class ProductLineResponse(ProductLineBase, TimestampSchema, SoftDeletionSchema):
    id: Annotated[UUID, Field(description="Unique identifier")]
    vendor_id: Annotated[UUID, Field(description="ID of the vendor")]
    slug: Annotated[
        str | None,
        Field(description="Unique identifier slug", examples=["warpaints_fanatic", "game_color"]),
    ]


class ProductLineFilters(BaseModel):
    name: Annotated[str | None, Field(description="Filter by name", default=None)]
    product_line_type: Annotated[ProductLineTypeEnum | None, Field(description="Filter by type", default=None)]
    slug: Annotated[
        str | None, Field(description="Filter by slug", examples=["warpaints_fanatic", "game_color"], default=None)
    ]
    vendor_id: Annotated[UUID | None, Field(description="Filter by vendor ID", default=None)]
