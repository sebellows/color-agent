"""Main FastAPI application module."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .api.router import api_router
from .core.config import settings
from .utils.logging import get_logger, log_request_middleware, setup_logging

# Configure logging
setup_logging()
logger = get_logger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for ColorAgent application",
    version=settings.VERSION,
    debug=settings.DEBUG,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add logging middleware
app.middleware("http")(log_request_middleware())

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str
    version: str


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    logger.info("health_check_requested")
    return HealthResponse(status="ok", version=settings.VERSION)


@app.get("/")
async def root():
    """Root endpoint."""
    logger.info("root_endpoint_accessed")
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
