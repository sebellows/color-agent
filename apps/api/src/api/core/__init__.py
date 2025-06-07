"""Core functionality package."""

from .config import settings
from .database import get_db
from .logger import (
    FastAPIStructLogger,
    get_logger,
    log_request_middleware,
    setup_logging,
)
from .models import Entity, WithFullTimeAuditMixin, WithTimeAuditMixin
from .security import get_keycloak_public_key, get_password_hash, verify_password


__all__ = [
    "settings",
    "setup_logging",
    "get_logger",
    "log_request_middleware",
    "FastAPIStructLogger",
    "get_db",
    "Entity",
    "WithFullTimeAuditMixin",
    "WithTimeAuditMixin",
    "get_keycloak_public_key",
    "get_password_hash",
    "verify_password",
]
