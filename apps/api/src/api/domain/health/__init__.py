from core.config import settings
from core.logger import get_logger
from fastapi import APIRouter
from pydantic import BaseModel
from starlette.status import HTTP_200_OK


__all__ = ["health_router", "health_check"]

logger = get_logger(__name__)

health_router = APIRouter(
    tags=["Health"],
)


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str
    name: str
    version: str


@health_router.get("/health", response_model=HealthResponse, status_code=HTTP_200_OK)
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    logger.info("health_check_requested")
    return HealthResponse(status="ok", name=settings.app.APP_NAME, version=settings.app.APP_VERSION)
