from collections.abc import Callable
import re

from .reducers import reduce_with_index


def variadic(*args):
    """
    Safely extract parameters within a function as a list where they may be passed as an array or a
    variable number of arguments.

    Example(s):
    -----------
    >>> def getargs(*args):
    >>>    return variadic(*args)

    >>> getargs(['a', 'b', 'c'])
    ['a', 'b', 'c']
    >>> getargs('d', 'e', 'f', 'g')
    ['d', 'e', 'f', 'g']
    """
    return (
        args[0] if len(args) == 1 and isinstance(args[0], (list, set, tuple)) else args
    )


def default_customizer[P](path: P) -> P:
    """
    Default customizer function that simply returns the argument given to it.
    """
    return path


# Matches on path strings like "[<int>]". This is used to
# test whether a path string part is a list index.
INDEX_KEY_RE = re.compile(r"^\[(-?\d+)\]$")


def parse_key(key: int | str) -> int | str:
    if isinstance(key, int):
        return key

    found = INDEX_KEY_RE.search(key)

    return int(found.group(1)) if found else key


def parse_keys(keys: list[int | str] | tuple[int | str], sep: str) -> list[int | str]:
    def _parse(key: int | str):
        if isinstance(key, str) and sep in key:
            return [parse_key(k) for k in key.split(sep)]
        return parse_key(key)

    results = variadic(_parse(key) for key in keys)
    return results if isinstance(results, list) else list(results)


def to_path(*paths, sep=".", customizer=default_customizer):
    return sep.join([customizer(path) for path in variadic(paths)])


def to_path_str(*paths, sep=".", customizer=default_customizer) -> str:
    return sep.join([str(customizer(path)) for path in variadic(paths)])


def to_paths(*args, sep=".") -> list[int | str]:
    keys = [arg for arg in variadic(*args) if isinstance(arg, (int | str))]
    return parse_keys(keys, sep)


def to_str_paths(*args, sep=".") -> list[str]:
    paths = parse_keys(
        [arg for arg in variadic(*args) if isinstance(arg, (int | str))], sep
    )
    return [str(path) for path in paths]


def to_url(
    *paths: str, init="", customizer: Callable[[str], str] = default_customizer
) -> str:
    """
    Convert a path to a URL.

    Args:
        paths: The path to convert.

    Returns:
        str: The converted URL.
    """

    def normalize_path(acc: str, item: str, index: int) -> str:
        if item is None:
            return ""
        p = item.strip("/")
        if index > 0:
            p = f"/{p}"
        return acc + customizer(p)

    path = reduce_with_index(normalize_path, paths, init)

    return path
