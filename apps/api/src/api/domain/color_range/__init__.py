from .dependencies import provide_color_range_repository
from .models import ColorRange

# from .repository import ColorRangeRepository
from .routes import (
    create_color_range,
    delete_color_range,
    get_color_range,
    list_color_ranges,
    update_color_range,
)
from .routes import (
    router as color_range_router,
)
from .schemas import ColorRange as ColorRangeSchema
from .schemas import ColorRangeCreate, ColorRangeUpdate


__all__ = [
    "ColorRange",
    "provide_color_range_repository",
    "ColorRangeSchema",
    "ColorRangeCreate",
    "ColorRangeUpdate",
    "color_range_router",
    "create_color_range",
    "delete_color_range",
    "get_color_range",
    "list_color_ranges",
    "update_color_range",
]
