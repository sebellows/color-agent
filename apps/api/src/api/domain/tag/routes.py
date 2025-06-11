from fastapi import APIRouter
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .models import Tag
from .schemas import (
    TagCreate,
    TagResponse,
    TagUpdate,
)
from .service import Tags


router = APIRouter()


@router.post("/tags/", response_model=TagResponse, status_code=HTTP_201_CREATED)
async def create_tag(tag_in: TagCreate, service: Tags):
    """Create a new tag"""
    tag_data = tag_in.model_dump(exclude_unset=True)
    tag = Tag(**tag_data)
    await service.create(tag)
    return TagResponse.model_validate(tag)


@router.get("/tags/{tag_id}", response_model=TagResponse, status_code=HTTP_200_OK)
async def get_tag(tag_id: int, service: Tags):
    """Get a tag by ID"""
    return await service.get(Tag.id == tag_id)


@router.get("/tags/", response_model=list[TagResponse], status_code=HTTP_200_OK)
async def list_tags(service: Tags):
    """List all tags"""
    return await service.list()


@router.put("/tags/{tag_id}", response_model=TagResponse, status_code=HTTP_200_OK)
async def update_tag(
    tag_id: int,
    tag_in: TagUpdate,
    service: Tags,
):
    """Update a tag"""
    tag = await service.get_and_update(Tag.id == tag_id, data=tag_in.model_dump(exclude_unset=True))
    return TagResponse.model_validate(tag)


@router.delete("/tags/{tag_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_tag(tag_id: int, service: Tags):
    """Delete a tag"""
    await service.delete(Tag.id == tag_id)
    return None
