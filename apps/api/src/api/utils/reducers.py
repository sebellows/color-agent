from collections.abc import Callable
from functools import reduce
from typing import Sequence


def reduce_with_index[ItemT, InitialT](
    func: Callable[[InitialT, ItemT, int], InitialT],
    sequence: Sequence[ItemT],
    initial: InitialT,
) -> InitialT:
    """
    Applies a function cumulatively to the items of a sequence, with the
    function receiving the accumulator, the current item, and its index.

    EXAMPLE:
    --------
        def add(acc: int, item: int, index: int) -> int:
            return acc + (item * index)

        result = reduce_with_index(add, [1, 2, 3], initial=1)
        print(result)  # Output: 14
    """

    def wrapped_func(accumulator, item_index_tuple) -> InitialT:
        index, item = item_index_tuple
        return func(accumulator, item, index)

    results = reduce(wrapped_func, enumerate(sequence), initial)

    return initial if not isinstance(results, type(initial)) else results
