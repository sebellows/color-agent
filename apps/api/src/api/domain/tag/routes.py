from uuid import UUID

from advanced_alchemy.filters import SearchFilter
from advanced_alchemy.service import OffsetPagination
from domain.dependencies import Services
from domain.filters import PaginatedResponse
from fastapi import APIRouter, Query
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from typing_extensions import Annotated

from .models import Tag
from .schemas import (
    TagCreate,
    TagFilters,
    TagResponse,
    TagUpdate,
)


tag_router = APIRouter(tags=["Tag"])


@tag_router.post("/tags", response_model=TagResponse, status_code=HTTP_201_CREATED)
async def create_tag(data: TagCreate, container: Services):
    """Create a new tag"""
    tag = await container.provide_tags.create(data)
    return container.provide_tags.to_schema(tag)


@tag_router.get("/tags/{tag_id}", response_model=TagResponse, status_code=HTTP_200_OK)
async def get_tag(tag_id: UUID, container: Services):
    """Get a tag by ID"""
    tag = await container.provide_tags.get(tag_id)
    return container.provide_tags.to_schema(tag)


@tag_router.get("/tags", response_model=OffsetPagination[TagResponse], status_code=HTTP_200_OK)
async def list_tags(
    filter_query: Annotated[TagFilters, Query()],
    limit_offset: PaginatedResponse,
    container: Services,
):
    """List all tags"""
    filters = []
    if filter_query.name:
        filters.append(SearchFilter("name", filter_query.name, ignore_case=True))
    if filter_query.slug:
        filters.append(SearchFilter("slug", filter_query.slug, ignore_case=True))
    if filter_query.id:
        filters.append(Tag.id == filter_query.id)
    if filter_query.type:
        filters.append(SearchFilter("type", filter_query.type, ignore_case=True))

    results, total = await container.provide_tags.list_and_count(*filters, limit_offset)

    return container.provide_tags.to_schema(results, total, filters=[limit_offset])


@tag_router.patch("/tags/{tag_id}", response_model=TagResponse, status_code=HTTP_200_OK)
async def update_tag(
    container: Services,
    data: TagUpdate,
    tag_id: UUID,
):
    """Update a tag"""
    tag = await container.provide_tags.update(data, item_id=tag_id)
    return container.provide_tags.to_schema(tag)


@tag_router.delete("/tags/{tag_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_tag(tag_id: int, container: Services):
    """Delete a tag"""
    _ = await container.provide_tags.delete(tag_id)
    return None
