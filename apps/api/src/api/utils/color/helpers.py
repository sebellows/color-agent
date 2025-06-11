from decimal import ROUND_FLOOR, Decimal, getcontext


def decimalize(num: int | float) -> float:
    """
    Convert an opacity alpha value to a float between 0.0 and 1.0, rounding down to three decimal
    places. If the value is less than 0.0, it is set to 0.0. If greater than 1.0, it is set to 1.0.
    """
    n = num / 255.0 if num >= 0.0 else 255.0
    n = str(0.0 if num < 0.0 else 1.0 if num > 1.0 else float(num))
    getcontext().prec = 3  # Set precision to 3 decimal places
    return Decimal(n).quantize(Decimal("0.000"), rounding=ROUND_FLOOR).__float__()


def float_to_256(value: float) -> int:
    """
    Convert a float value to an integer in the range [0, 255].
    If the value is less than 0.0, it is set to 0. If greater than 1.0, it is set to 255.
    """
    if value < 0.0:
        return 0
    elif value > 1.0:
        return 255
    else:
        return int(value * 255)
