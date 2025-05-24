from dataclasses import dataclass
import re
from typing import Any, Generic, Literal, NoReturn, Type, TypedDict
from unicodedata import normalize, category

from sqlalchemy import Select

from ..core.enums import ColorRangeEnum


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


# def filter_colors(color_category: ColorRangeEnum, filters: ColorFilters):
#     rangefilters = [

#     ]

# def normalize_search_string(s):
#     # Normalize search strings in the same way as 'TitelEinfach'
#     return ''.join(
#         c for c in normalize('NFD', s) if category(c) != 'Mn'
#     ).replace('...', '') \
#     .replace('-', '') \
#     .replace('–', '') \
#     .replace('…', '') \
#     .replace(':', '') \
#     .replace('«', '') \
#     .replace('»', '') \
#     .replace('"', '') \
#     .replace("'", '') \
#     .replace('(', '') \
#     .replace(')', '') \
#     .replace(']', '') \
#     .replace('[', '') \
#     .replace('{', '') \
#     .replace('}', '') \
#     .replace('.', '') \
#     .replace(',', '') \
#     .replace('&', '') \
#     .lower()

# regex_patterns = [re.escape(normalize_search_string(option)) for option in or_conditions]


def filter_by_range(df, column, min_value, max_value):
    try:
        if min_value is not None:
            min_value = float(min_value)
            df = df[df[column] >= min_value]
        if max_value is not None:
            max_value = float(max_value)
            df = df[df[column] <= max_value]
    except ValueError:
        print(f"Invalid range for {column}: {min_value}, {max_value}")
    return df


def sort_data(df, args):
    with_sort = args.get("sort", None)
    if with_sort is not None:
        is_asc = True
        if with_sort.startswith("-"):
            with_sort = with_sort.strip("-")
            is_asc = False
        df = df.sort_values(with_sort, ascending=is_asc)
    return df


def paginate_data(df, args):
    page = int(args.get("page", 1))
    per_page = int(args.get("per_page", 10))
    total = len(df)
    pages = -(-total // per_page)  # Calculate total pages
    offset = (page - 1) * per_page
    dprange = df[offset : offset + per_page]
    return dprange, {"page": page, "pages": pages, "total": total}


def convert_to_json(df, as_json):
    if as_json:
        return df.to_json(orient="records")
    return df
