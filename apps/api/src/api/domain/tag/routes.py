from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_201_CREATED

from .dependencies import provide_tag_repository
from .models import Tag
from .repository import TagRepository
from .schemas import (
    TagSchema,
    TagCreate,
    TagUpdate,
)

router = APIRouter()


@router.post("/tags/", response_model=TagSchema, status_code=HTTP_201_CREATED)
async def create_tag(
    tag_in: TagCreate, repository: TagRepository = Depends(provide_tag_repository)
):
    """Create a new tag"""
    tag_data = tag_in.model_dump(exclude_unset=True)
    tag = Tag(**tag_data)
    await repository.add(tag)
    return TagSchema.model_validate(tag)


@router.get("/tags/{tag_id}", response_model=TagSchema, status_code=HTTP_200_OK)
async def get_tag(
    tag_id: int, repository: TagRepository = Depends(provide_tag_repository)
):
    """Get a tag by ID"""
    return await repository.get(Tag.id == tag_id)


@router.get("/tags/", response_model=list[TagSchema], status_code=HTTP_200_OK)
async def list_tags(repository: TagRepository = Depends(provide_tag_repository)):
    """List all tags"""
    return await repository.list()


@router.put("/tags/{tag_id}", response_model=TagSchema, status_code=HTTP_200_OK)
async def update_tag(
    tag_id: int,
    tag_in: TagUpdate,
    repository: TagRepository = Depends(provide_tag_repository),
):
    """Update a tag"""
    tag = await repository.get_and_update(
        Tag.id == tag_id, data=tag_in.model_dump(exclude_unset=True)
    )
    return TagSchema.model_validate(tag)


@router.delete("/tags/{tag_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: int, repository: TagRepository = Depends(provide_tag_repository)
):
    """Delete a tag"""
    await repository.delete(Tag.id == tag_id)
    return None
