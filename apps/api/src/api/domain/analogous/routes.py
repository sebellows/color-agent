from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from .dependencies import AnalogousRepository, provide_analogous_repository
from .models import Analogous
from .schemas import (
    AnalogousCreate,
    AnalogousResponse,
    AnalogousUpdate,
)


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
    repository: AnalogousRepository = Depends(provide_analogous_repository),
):
    """Create a new analogous color"""
    analogous_data = analogous_in.model_dump(exclude_unset=True)
    analogous = Analogous(**analogous_data)
    await repository.add(analogous)
    return AnalogousResponse.model_validate(analogous)


@router.get("/analogous/{analogous_id}", response_model=AnalogousResponse, status_code=HTTP_200_OK)
async def get_analogous(
    analogous_id: int,
    repository: AnalogousRepository = Depends(provide_analogous_repository),
):
    """Get an analogous color by ID"""
    return await repository.get(AnalogousResponse.id == analogous_id)


@router.get("/analogous/", response_model=list[AnalogousResponse])
async def list_analogous(
    repository: AnalogousRepository = Depends(provide_analogous_repository),
):
    """List all analogous colors"""
    return await repository.list()


@router.put("/analogous/{analogous_id}", response_model=AnalogousResponse, status_code=HTTP_200_OK)
async def update_analogous(
    analogous_id: int,
    analogous_in: AnalogousUpdate,
    repository: AnalogousRepository = Depends(provide_analogous_repository),
):
    """Update an analogous color"""
    analogous = await repository.get_and_update(
        filters=[AnalogousResponse.id == analogous_id],
        data=analogous_in.model_dump(exclude_unset=True),
    )
    return AnalogousResponse.model_validate(analogous)


@router.delete("/analogous/{analogous_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_analogous(
    analogous_id: int,
    repository: AnalogousRepository = Depends(provide_analogous_repository),
):
    """Delete an analogous color"""
    await repository.delete(AnalogousResponse.id == analogous_id)

    return None
