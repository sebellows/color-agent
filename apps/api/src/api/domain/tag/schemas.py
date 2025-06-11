from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field


class TagBase(BaseModel):
    name: Annotated[str, Field(description="Tag name")]
    type: Annotated[str | None, Field(description="Tag type, e.g., 'color', 'finish', etc.", default=None)]

    class Config:
        from_attributes = True


class TagCreate(TagBase):
    slug: Annotated[str, Field(description="Unique identifier slug", examples=["special_effect", "terrain"])]


class TagUpdate(TagBase):
    pass


class TagDelete(BaseModel):
    pass


class TagRead(TagBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique identifier slug", examples=["special_effect", "terrain"])]


class TagResponse(TagBase):
    id: Annotated[UUID, Field(description="Unique identifier")]
    slug: Annotated[str, Field(description="Unique identifier slug", examples=["special_effect", "terrain"])]
