from collections import defaultdict
from enum import Enum
from typing import Any

from pydantic import BaseModel, ValidationInfo, field_validator
from sqlalchemy.orm import Query
from sqlalchemy.sql.selectable import Select

_orm_operator_map = {
    "eq": "__eq__",
    "neq": "__ne__",
    "gt": "__gt__",
    "gte": "__ge__",
    "in": "in_",
    "is": "is_",
    "lt": "__lt__",
    "lte": "__le__",
    "like": "like",
    "ilike": "ilike",
    "not": "is_not",
    "not_in": "not_in",
}


class Direction(str, Enum):
    asc = "asc"
    desc = "desc"


class Filter(BaseModel, extra="forbid"):
    class Constants:
        model: Any
        ordering_field_name: str = "sort_by"
        search_model_fields: list[str] = []
        original_filter: type["Filter"]

    class State:
        sort_dir: Direction = Direction.asc

    @property
    def filtering_fields(self):
        fields = self.model_dump(exclude_none=True, exclude_unset=True)
        fields.pop(self.Constants.ordering_field_name, None)
        return fields.items()

    @property
    def ordering_values(self):
        """Check that the ordering field is present on the class definition."""
        try:
            return getattr(self, self.Constants.ordering_field_name)
        except AttributeError as e:
            raise AttributeError(
                f"Ordering field {self.Constants.ordering_field_name} is not defined. "
                "Make sure to add it to your filter class."
            ) from e

    @field_validator("*", mode="before")
    def split_str(cls, value, field: ValidationInfo):
        if (
            field.field_name is not None
            and field.field_name == cls.Constants.ordering_field_name
            and isinstance(value, str)
        ):
            # Empty string should return [] not ['']
            return list(value.split(",")) if value else []
        return value

    @field_validator("*", mode="before", check_fields=False)
    def strip_order_by_values(cls, value: list[str], field: ValidationInfo):
        if not value:
            return None

        if field.field_name != cls.Constants.ordering_field_name:
            return value

        return [field_name.strip() for field_name in value]

    @field_validator("*", mode="before", check_fields=False)
    def validate_order_by(cls, value, field: ValidationInfo):
        if not value:
            return None

        if not len(cls.Constants.ordering_field_name):
            return value

        field_name_usages = defaultdict(list)
        # duplicated_field_names = set()

        for field_name in value:
            if not hasattr(cls.Constants.model, field_name):
                raise ValueError(f"{field_name} is not a valid ordering field.")

            field_name_usages[field_name].append(field_name)
            if len(field_name_usages[field_name]) > 1:
                raise ValueError(
                    f"Field names can appear at most once for 'order_by'. "
                    f"The following was ambiguous: '{field_name}'."
                )

        return value

    def filter(self, query: Query | Select):
        for field_name, value in self.filtering_fields:
            field_value = getattr(self, field_name)
            if isinstance(field_value, Filter):
                query = field_value.filter(query)
                continue

            operator = "__eq__"
            if "filter." in field_name:
                parts = field_name.split(".")
                field_name = parts.pop()
                # prefix = parts.pop(0)
                if len(parts) > 1 and (op := parts.pop()) in _orm_operator_map:
                    operator = _orm_operator_map[op]

            model_field = getattr(self.Constants.model, field_name)
            query = query.filter(getattr(model_field, operator)(value))

        return query

    def sort(self, query: Query | Select, direction: Direction | None = None):
        # @see {github.com/arthurio/fastapi-filter/base/filter.py}
        if not self.ordering_values:
            return query

        for field_name in self.ordering_values:
            direction = Filter.State.sort_dir

            order_by_field = getattr(self.Constants.model, field_name)

            query = query.order_by(getattr(order_by_field, direction)())

        return query
