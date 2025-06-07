from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field


class TagBase(BaseModel):
    name: Annotated[str, Field(description="Tag name")]

    class Config:
        from_attributes = True


class TagCreate(TagBase):
    pass


class TagUpdate(TagBase):
    pass


class TagDelete(BaseModel):
    pass


class TagResponse(TagBase):
    id: Annotated[UUID, Field(description="Unique identifier")]


class TagSchema(TagBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
