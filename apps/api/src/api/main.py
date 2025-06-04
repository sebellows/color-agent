"""Main FastAPI application module."""

from fastapi import APIRouter

from api.core.config import settings
from api.core.logger import get_logger
from api.core.setup import create_app
from api.routers import domain_routers


# Configure logging
# setup_logging(json_logs=settings.logger.LOG_JSON_FORMAT, log_level=settings.logger.LOG_LEVEL)
# setup_logging()
# logger = get_logger(__name__)

# Create FastAPI application
# app = FastAPI(
#     title=settings.app.APP_TITLE,
#     description=settings.app.APP_DESCRIPTION,
#     version=settings.app.APP_VERSION,
#     debug=settings.db.DB_ECHO_LOG,
# )

# Include routers
api = APIRouter(
    prefix="/api",
    responses={404: {"description": "Page not found"}},
)

for router in domain_routers:
    api.include_router(router)

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

# # Add logging middleware
# app.middleware("http")(log_request_middleware())

app, alchemy = create_app(
    settings=settings,
    router=api,
    create_tables_on_start=True,  # Set to True if you want to create tables on startup
)
# app.include_router(api)

logger = get_logger(__name__)


@app.get("/")
async def root():
    """Root endpoint."""
    logger.info("root_endpoint_accessed")
    return {"message": f"Welcome to {settings.app.APP_TITLE}"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
