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
from .schemas import AnalogousCreate, AnalogousUpdate


__all__ = [
    "Analogous",
    "AnalogousSchema",
    "AnalogousCreate",
    "AnalogousUpdate",
    "analogous_router",
    "create_analogous",
    "delete_analogous",
    "get_analogous",
    "list_analogous",
    "provide_analogous_repository",
    "update_analogous",
]
