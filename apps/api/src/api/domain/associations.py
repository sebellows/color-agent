from advanced_alchemy.base import orm_registry
from sqlalchemy import Column, ForeignKey, Table


# Product to Tag association
product_tag_association = Table(
    "product_tag_association",
    orm_registry.metadata,
    Column("product_id", ForeignKey("products.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)

# Product to Analogous association
product_analogous_association = Table(
    "product_analogous_association",
    orm_registry.metadata,
    Column("product_id", ForeignKey("products.id"), primary_key=True),
    Column("analogous_id", ForeignKey("analogous.id"), primary_key=True),
)
