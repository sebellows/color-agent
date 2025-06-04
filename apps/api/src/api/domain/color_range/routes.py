from fastapi import APIRouter, Depends
from starlette.status import HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_201_CREATED

from .dependencies import provide_color_range_repository
from .models import ColorRange
from .repository import ColorRangeRepository
from .schemas import (
    ColorRange as ColorRangeSchema,
    ColorRangeCreate,
    ColorRangeUpdate,
)

router = APIRouter(
    prefix="/color-range",
    tags=["color_ranges"],
)


@router.post(
    "",
    response_model=ColorRangeSchema,
    status_code=HTTP_201_CREATED,
)
async def create_color_range(
    color_range_in: ColorRangeCreate,
    repository: ColorRangeRepository = Depends(provide_color_range_repository),
):
    """Create a new color range"""
    model = ColorRange(**color_range_in.model_dump())
    color_range = await repository.add(model)
    return ColorRangeSchema.model_validate(color_range)


@router.get("/{color_range_id}", response_model=ColorRangeSchema)
async def get_color_range(
    color_range_id: int,
    repository: ColorRangeRepository = Depends(provide_color_range_repository),
):
    """Get a color range by ID"""
    return await repository.get(ColorRangeSchema.id == color_range_id)


@router.get("s/", response_model=list[ColorRangeSchema], status_code=HTTP_200_OK)
async def list_color_ranges(
    repository: ColorRangeRepository = Depends(provide_color_range_repository),
):
    """List all color ranges"""
    return await repository.list()


@router.put(
    "/{color_range_id}", response_model=ColorRangeSchema, status_code=HTTP_200_OK
)
async def update_color_range(
    color_range_id: int,
    color_range_in: ColorRangeUpdate,
    repository: ColorRangeRepository = Depends(provide_color_range_repository),
):
    """Update a color range"""
    return await repository.get_and_update(
        filters=[ColorRangeSchema.id == color_range_id],
        data=color_range_in.model_dump(exclude_unset=True),
    )


@router.delete("/{color_range_id}", status_code=HTTP_204_NO_CONTENT)
async def delete_color_range(
    color_range_id: int,
    repository: ColorRangeRepository = Depends(provide_color_range_repository),
):
    """Delete a color range"""
    await repository.delete(ColorRangeSchema.id == color_range_id)
    return None
