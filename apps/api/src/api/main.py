"""Main FastAPI application module."""

import uvicorn
from core.config import settings
from core.logger import get_logger
from core.setup import app as _app
from fastapi import APIRouter
from routers import domain_routers


logger = get_logger(__name__)

app = _app

# Include routers
api_router = APIRouter(
    prefix="/api",
    responses={404: {"description": "Page not found"}},
)


@api_router.get("/")
async def root():
    """Root endpoint."""
    logger.info("root_endpoint_accessed")
    return {"message": f"Welcome to {settings.app.APP_TITLE}"}


for router in domain_routers:
    app.include_router(router)
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
