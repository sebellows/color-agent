"""Main FastAPI application module."""

import uvicorn
from core.config import settings
from core.logger import get_logger, setup_logging  # , log_request_middleware
from core.setup import app as _app

# from fastapi.middleware.cors import CORSMiddleware
from routers import router


setup_logging(
    json_logs=settings.logger.LOG_JSON_FORMAT,
    log_level=settings.logger.LOG_LEVEL,
)

logger = get_logger(__name__)

app = _app

app.include_router(router)

# Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
#     allow_headers=[
#         "Content-Type",
#         "Set-Cookie",
#         "Access-Control-Allow-Headers",
#         "Access-Control-Allow-Origin",
#         "Authorization",
#     ],
# )

# Add logging middleware
# app.middleware("http")(log_request_middleware())


@router.get("/")
async def root():
    """Root endpoint."""
    logger.info("root_endpoint_accessed")
    return {"message": f"Welcome to {settings.app.APP_TITLE}"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
