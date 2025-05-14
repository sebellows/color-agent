"""API router module."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def api_root():
    """API root endpoint."""
    return {"message": "ColorAgent API v0.0.1"}
