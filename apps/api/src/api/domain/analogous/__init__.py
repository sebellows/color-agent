from .dependencies import provide_analogous_repository
from .models import Analogous

# from .repository import AnalogousRepository
from .routes import (
    create_analogous,
    delete_analogous,
    get_analogous,
    list_analogous,
    update_analogous,
)
from .routes import (
    router as analogous_router,
)
from .schemas import Analogous as AnalogousSchema
from .schemas import AnalogousCreate, AnalogousResponse, AnalogousUpdate
from .service import AnalogousService, provide_analogous_service


__all__ = [
    "Analogous",
    "AnalogousCreate",
    "AnalogousResponse",
    "AnalogousSchema",
    "AnalogousService",
    "AnalogousUpdate",
    "analogous_router",
    "create_analogous",
    "delete_analogous",
    "get_analogous",
    "list_analogous",
    "provide_analogous_repository",
    "provide_analogous_service",
    "update_analogous",
]
