from fastapi import APIRouter
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .models import Analogous
from .schemas import (
    AnalogousCreate,
    AnalogousResponse,
    AnalogousUpdate,
)
from .service import AnalogousTags


router = APIRouter(
    prefix="/analogous",
    tags=["analogous"],
)


@router.post(
    "/analogous/",
    response_model=AnalogousResponse,
    status_code=HTTP_201_CREATED,
)
async def create_analogous(
    analogous_in: AnalogousCreate,
    service: AnalogousTags,
):
    """Create a new analogous color"""
    analogous_data = analogous_in.model_dump(exclude_unset=True)
    analogous = await service.create(Analogous(**analogous_data))
    return AnalogousResponse.model_validate(analogous)


@router.get("/analogous/{analogous_id}", response_model=AnalogousResponse, status_code=HTTP_200_OK)
async def get_analogous(
    analogous_id: int,
    service: AnalogousTags,
):
    """Get an analogous color by ID"""
    return await service.get(AnalogousResponse.id == analogous_id)


@router.get("/analogous/", response_model=list[AnalogousResponse])
async def list_analogous(
    service: AnalogousTags,
):
    """List all analogous colors"""
    return await service.list()


@router.put("/analogous/{analogous_id}", response_model=AnalogousResponse, status_code=HTTP_200_OK)
async def update_analogous(
    analogous_id: int,
    analogous_in: AnalogousUpdate,
    service: AnalogousTags,
):
    """Update an analogous color"""
    analogous = await service.get_and_update(
        filters=[AnalogousResponse.id == analogous_id],
        data=analogous_in.model_dump(exclude_unset=True),
    )
    return AnalogousResponse.model_validate(analogous)


@router.delete("/analogous/{analogous_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_analogous(
    analogous_id: int,
    service: AnalogousTags,
):
    """Delete an analogous color"""
    await service.delete(AnalogousResponse.id == analogous_id)

    return None
