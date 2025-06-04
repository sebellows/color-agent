import datetime
import inspect

from collections.abc import Callable, Iterable, Mapping, Sequence
from types import FunctionType
from typing import Any, TypeGuard

__all__ = [
    "isdict",
    "ismapping",
    "islist",
    "issequence",
    "isiter",
    "isstr",
    "isset",
    "istuple",
    "isnone",
    "iserror",
    "isdate",
    "isdatetime",
    "isfunction",
    "isasync",
    "isempty",
    "isnumber",
    "isnumericstr",
    "isnumeric",
    "eq",
    "gt",
    "gte",
    "lt",
    "lte",
    "in_range",
    "equal_with",
]


def isdict(o: Any) -> TypeGuard[dict]:
    return isinstance(o, dict)


def ismapping(o: Any) -> TypeGuard[Mapping]:
    return isinstance(o, Mapping)


def islist(o: Any) -> TypeGuard[list]:
    return isinstance(o, list)


def issequence(o: Any) -> TypeGuard[Sequence]:
    return isinstance(o, Sequence)


def isiter(o: Any) -> TypeGuard[Iterable]:
    return isinstance(o, Iterable)


def isstr(o: Any) -> TypeGuard[str]:
    return isinstance(o, str)


def isset(o: Any) -> TypeGuard[set]:
    return isinstance(o, set)


def istuple(o: Any) -> TypeGuard[tuple]:
    return isinstance(o, tuple)


def isnone(o: Any) -> TypeGuard[None]:
    return o is None


def iserror(o: Any) -> TypeGuard[Exception]:
    return isinstance(o, Exception)


def isdate(obj: Any) -> bool:
    return isinstance(obj, datetime.date)


def isdatetime(obj: Any) -> bool:
    return isinstance(obj, datetime.datetime)


def isfunction(o: Any) -> TypeGuard[FunctionType]:
    return inspect.isfunction(o)


def isasync(o: Any) -> bool:  # TypeGuard[Coroutine]:
    """
    Example:
    --------
    >>> async def async_sum(lst: list[int]) -> int:
    >>>     await asyncio.sleep(1)
    >>>     return sum(lst)
    >>>
    >>> async def main():
    >>>     if (isasync(async_sum)):
    >>>         return await async_sum([2, 3, 4])
    >>>     return async_sum([8, 6, 7])
    >>>
    >>> if __name__ == 'main':
    >>>     total = await main()
    >>>     print(total)
    9
    """
    return inspect.iscoroutinefunction(o)


def isempty(obj: Any) -> bool:
    return (
        len(obj) == 0 if isinstance(obj, (dict, list, set, str, tuple)) else bool(obj)
    )


def isnumber(value: Any, strict=False) -> bool:
    """
    Verify that a value is a
    number (integer or float). This function checks if the value is an instance of `int` or `float`.
    Example:
    --------
    >>> isnumber(10)
    True
    >>> isnumber('10')
    False
    >>> isnumber(3.14)
    True
    >>> isnumber('3.14')
    False
    >>> isnumber(3.14, strict=True)
    False
    >>> isnumber(None)
    False
    >>> isnumber('Steve')
    False
    """
    if strict:
        return isinstance(value, int)
    return isinstance(value, (int, float))


def isnumericstr(value: Any) -> bool:
    """
    Verify that a value is an integer in string form.

    Example:
    --------
    >>> isnumericstr('55')
    True
    >>> isnumericstr(20)
    False
    """
    return isstr(value) and value.isnumeric()


def isnumeric(value: Any) -> bool:
    """
    Verify that a value is either an integer or integer in string form.

    Example:
    --------
    >>> isnumeric(2)
    True
    >>> isnumeric('55')
    True
    >>> isnumeric('Steve')
    False
    """
    return isinstance(value, int) or isnumericstr(value)


def eq(obj1: Any, obj2: Any) -> bool:
    return obj1 is obj2


def gt(obj1: Any, obj2: Any) -> bool:
    return obj1 > obj2


def gte(obj1: Any, obj2: Any) -> bool:
    return obj1 >= obj2


def lt(obj1: Any, obj2: Any) -> bool:
    return obj1 < obj2


def lte(obj1: Any, obj2: Any) -> bool:
    return obj1 <= obj2


def in_range(value: Any, start: Any = 0, end: Any = None) -> bool:
    if not isnumber(value):
        return False
    if not isnumber(start):
        start = 0
    if not isnumber(end):
        end = start
        start = 0
    return start <= value < end


def equal_with(
    obj1: Any, obj2: Any, comparator: Callable[[Any, Any], bool] | None = None
) -> bool:
    if callable(comparator):
        if (
            type(obj1) is type(obj2)
            and isinstance(obj1, (dict, list))
            and isinstance(obj2, (dict, list))
            and len(obj1) == len(obj2)
        ):
            o1 = obj1.items() if isdict(obj1) else enumerate(obj1)
            equal = False

            for key, value in o1:
                if obj2[key]:
                    equal = equal_with(value, obj2[key], comparator)
                if not equal:
                    break
            return equal
        else:
            equal = comparator(obj1, obj2)
            return equal if isinstance(equal, bool) else False

    return eq(obj1, obj2)
