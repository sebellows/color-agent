from uuid import UUID

from domain.dependencies import Services
from fastapi import APIRouter
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .models import Analogous
from .schemas import (
    AnalogousCreate,
    AnalogousResponse,
    AnalogousUpdate,
)


# from .service import AnalogousTags


analogous_router = APIRouter(
    tags=["Analogous"],
)


@analogous_router.post(
    "/analogous",
    response_model=AnalogousResponse,
    status_code=HTTP_201_CREATED,
)
async def create_analogous(
    data: AnalogousCreate,
    container: Services,
):
    """Create a new analogous color"""
    analogous = await container.provide_analogous.create(data)
    return container.provide_analogous.to_schema(analogous)


@analogous_router.get("/analogous/{analogous_id}", response_model=AnalogousResponse, status_code=HTTP_200_OK)
async def get_analogous(
    analogous_id: UUID,
    container: Services,
):
    """Get an analogous color by ID"""
    analogous = await container.provide_analogous.get(AnalogousResponse.id == analogous_id)
    return container.provide_analogous.to_schema(analogous)


@analogous_router.get("/analogous", response_model=list[AnalogousResponse])
async def list_analogous(
    container: Services,
    tag_name: str | None = None,
):
    """List all analogous colors"""
    analogous = await container.provide_analogous.list(Analogous.name.ilike(f"%{tag_name}%"))
    return container.provide_analogous.to_schema(analogous)


@analogous_router.put("/analogous/{analogous_id}", response_model=AnalogousResponse, status_code=HTTP_200_OK)
async def update_analogous(
    analogous_id: UUID,
    data: AnalogousUpdate,
    container: Services,
):
    """Update an analogous color"""
    analogous = await container.provide_analogous.update(data, item_id=analogous_id)
    return container.provide_analogous.to_schema(analogous)


@analogous_router.delete("/analogous/{analogous_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_analogous(
    analogous_id: UUID,
    container: Services,
):
    """Delete an analogous color"""
    _ = await container.provide_analogous.delete(AnalogousResponse.id == analogous_id)

    return None
