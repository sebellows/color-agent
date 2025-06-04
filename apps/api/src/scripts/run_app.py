"""Script to run the FastAPI application."""

import logging

import uvicorn


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_app():
    """Run the FastAPI application."""
    logger.info("Starting FastAPI application...")
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )


if __name__ == "__main__":
    run_app()
