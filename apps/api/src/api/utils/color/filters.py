from dataclasses import dataclass
from typing import Any, TypedDict


class ColorFilterRangeParams(TypedDict):
    min: int | None
    max: int | None


@dataclass
class ColorFilterRange:
    min = 0
    max = 100

    def __init__(self, min: int | None = None, max: int | None = None):
        if min is not None and min >= 0:
            self.min = min
        if max is not None and max >= self.min:
            self.max = max


class ColorFilterParams(TypedDict):
    chroma: ColorFilterRangeParams | None
    hue: ColorFilterRangeParams | None
    lightness: ColorFilterRangeParams | None
    opacity: ColorFilterRangeParams | None


class ColorFiltersMap(TypedDict):
    chroma: ColorFilterRange
    hue: ColorFilterRange
    lightness: ColorFilterRange
    opacity: ColorFilterRange


default_color_filters: ColorFiltersMap = {
    "chroma": ColorFilterRange(0, 100),
    "hue": ColorFilterRange(0, 360),
    "lightness": ColorFilterRange(0, 100),
    "opacity": ColorFilterRange(0, 100),
}


def is_color_filter_range(value: Any) -> bool:
    if isinstance(value, ColorFilterRange):
        return True
    if isinstance(value, dict) and "min" in value and "max" in value:
        return True
    return False


def _get_og_color_filters() -> ColorFiltersMap:
    return default_color_filters.copy()


def inrange(property: str, value: int | None):
    _range: ColorFilterRange | None = default_color_filters.get(property)
    if _range is None or value is None:
        raise ValueError(f"Property '{property}' not found in ColorFilters.")
    return _range.min <= value <= _range.max


def get_color_filters(filters: ColorFilterParams) -> ColorFiltersMap:
    filter_ranges = _get_og_color_filters()
    for key in filters.keys():
        value = filters[key]
        if is_color_filter_range(filters.get(key)):
            if inrange(key, value["min"]):
                filter_ranges[key].min = value["min"]
            if inrange(key, value["max"]):
                filter_ranges[key].max = value["max"]
    return filter_ranges
