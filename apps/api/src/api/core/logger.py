import json
import logging
from typing import Any

import structlog
from structlog.types import EventDict, Processor

from .config import settings


__all__ = [
    "setup_logging",
    "get_logger",
    "log_request_middleware",
    "FastAPIStructLogger",
]

json_formatter = logging.Formatter(
    json.dumps(
        {
            "time": "%(asctime)s.%(msecs)03d",
            "level": "%(level)-6s",
            "funcName": "%(funcName)s()",
            "line": "%(pathname)s:%(lineno)d",
            "request_id": "%(request_id)s",
            "message": "%(message)s",
            "exception": "%(exception)s",
        },
    ),
    datefmt="%Y-%m-%dT%H:%M:%S",
)

# handler = logging.StreamHandler()
# handler.setFormatter(json_formatter)


def drop_color_message_key(_, __, event_dict: EventDict) -> EventDict:
    """
    Uvicorn logs the message a second time in the extra `color_message`, but we don't
    need it. This processor drops the key from the event dict if it exists.
    """
    event_dict.pop("color_message", None)
    return event_dict


def setup_logging(json_logs: bool = False, log_level: str = "INFO"):
    timestamper = structlog.processors.TimeStamper(fmt="iso")

    shared_processors: list[Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.stdlib.ExtraAdder(),
        drop_color_message_key,
        timestamper,
        structlog.processors.StackInfoRenderer(),
    ]

    if json_logs:
        # Format the exception only for JSON logs, as we want to pretty-print them when
        # using the ConsoleRenderer
        shared_processors.append(structlog.processors.format_exc_info)

    structlog.configure(
        processors=shared_processors
        + [
            # Prepare event dict for `ProcessorFormatter`.
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    log_renderer: structlog.types.Processor
    if json_logs:
        log_renderer = structlog.processors.JSONRenderer()
    else:
        log_renderer = structlog.dev.ConsoleRenderer()

    formatter = structlog.stdlib.ProcessorFormatter(
        # These run ONLY on `logging` entries that do NOT originate within
        # structlog.
        foreign_pre_chain=shared_processors,
        # These run on ALL entries after the pre_chain is done.
        processors=[
            # Remove _record & _from_structlog.
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            log_renderer,
        ],
    )

    handler = logging.StreamHandler()
    # Use OUR `ProcessorFormatter` to format all `logging` entries.
    handler.setFormatter(formatter)
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(log_level.upper())

    for _log in ["uvicorn", "uvicorn.error"]:
        # Clear the log handlers for uvicorn loggers, and enable propagation
        # so the messages are caught by the root logger and formatted correctly
        # by structlog
        logging.getLogger(_log).handlers.clear()
        logging.getLogger(_log).propagate = True

    # Since we re-create the access logs ourselves, to add all information
    # in the structured log (see the `logging_middleware` in main.py), we clear
    # the handlers and prevent the logs to propagate to a logger higher up in the
    # hierarchy (effectively rendering them silent).
    logging.getLogger("uvicorn.access").handlers.clear()
    logging.getLogger("uvicorn.access").propagate = False


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


class FastAPIStructLogger:
    def __init__(self):
        self.logger = structlog.stdlib.get_logger(settings.logger.LOGGER_NAME)

    @staticmethod
    def bind(**new_values: Any):
        structlog.contextvars.bind_contextvars(**new_values)

    @staticmethod
    def unbind(*keys: str):
        structlog.contextvars.unbind_contextvars(*keys)

    def debug(self, event: str | None = None, *args: Any, **kw: Any):
        self.logger.debug(event, *args, **kw)

    def info(self, event: str | None = None, *args: Any, **kw: Any):
        self.logger.info(event, *args, **kw)

    def warning(self, event: str | None = None, *args: Any, **kw: Any):
        self.logger.warning(event, *args, **kw)

    warn = warning

    def error(self, event: str | None = None, *args: Any, **kw: Any):
        self.logger.error(event, *args, **kw)

    def critical(self, event: str | None = None, *args: Any, **kw: Any):
        self.logger.critical(event, *args, **kw)

    def exception(self, event: str | None = None, *args: Any, **kw: Any):
        self.logger.exception(event, *args, **kw)
