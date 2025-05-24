"""Logging utilities."""

import logging
from typing import Any

import structlog
from structlog.types import Processor

from src.core.config import settings


def setup_logging() -> None:
    """Set up structured logging."""
    log_level = getattr(logging, settings.logger.LOG_LEVEL)

    shared_processors: list[Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.format_exc_info,
    ]

    if settings.logger.LOG_LEVEL == "DEBUG":
        # Development configuration
        processors = shared_processors + [
            structlog.dev.ConsoleRenderer(colors=True),
        ]
    else:
        # Production configuration
        processors = shared_processors + [
            structlog.processors.dict_tracebacks,
            structlog.processors.JSONRenderer(),
        ]

    structlog.configure(
        processors=processors,
        logger_factory=structlog.PrintLoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str | None = None) -> structlog.BoundLogger:
    """Get a logger instance."""
    return structlog.get_logger(name)


def log_request_middleware() -> Any:
    """Log request middleware."""
    logger = get_logger("request")

    async def log_request(request, call_next):
        """Log request and response."""
        response = await call_next(request)

        # Don't log health check requests
        if request.url.path == "/health":
            return response

        log_dict = {
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "client_host": request.client.host if request.client else None,
        }

        logger.info("http_request", **log_dict)
        return response

    return log_request
