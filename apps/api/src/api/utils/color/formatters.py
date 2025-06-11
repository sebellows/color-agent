import math
import re
from typing import Any

import numpy as np
from typing_extensions import TypeGuard

from .color_formats import RGB, RGBA, RGBValue
from .constants import CIE_E, CIE_K, D65
from .helpers import decimalize


def rgb_from_hex(hex_color: str):
    """
    Create an RGB instance from a hex string in the format "r,g,b".
    """
    if not isinstance(hex_color, str):
        raise TypeError("Hex color must be a string")
    value = hex_color.lstrip("#")
    lv = len(value)
    if lv > 6 and lv % 3 != 0:
        raise ValueError("Hex color must be in the format #RGB or #RRGGBB")
    qt = lv // 3  # floor division to get the quotient ("fff"=1, "ffff"=1, "ffffff"=2, "ffffffff"=2)
    value = "".join([v * 2 for v in value] if qt == 1 else value)  # expand shorthand hex if needed
    r, g, b = (int(value[i : i + qt], 16) for i in range(0, lv, qt))
    return RGB(r, g, b)


def rgba_from_hex(hex_color: str):
    """
    Create an RGB instance from a hex string in the format "r,g,b".
    """
    if not isinstance(hex_color, str):
        raise TypeError("Hex color must be a string")
    value = hex_color.lstrip("#")
    lv = len(value)
    if lv > 8 and lv % 4 != 0:
        raise ValueError("Hex color must be in the format #RGBA or #RRGGBBAA")
    qt = lv // 3  # floor division to get the quotient ("fff"=1, "ffff"=1, "ffffff"=2, "ffffffff"=2)
    value = "".join([v * 2 for v in value] if qt == 1 else value)  # expand shorthand hex if needed
    r, g, b, a = (int(value[i : i + qt], 16) for i in range(0, lv, qt))
    return RGBA(r, g, b, decimalize(a))


def hex_to_rgb(hex_color: str):
    """
    Convert a hex color string to RGB.

    Args:
        hex_color: A hexadecimal string of a sampled color.

    Returns:
        A tuple of RGB(A) color values.
    """
    value = hex_color.lstrip("#")
    lv = len(value)
    if 0 < lv <= 6 and lv % 3 == 0:
        return rgb_from_hex(hex_color)
    elif 0 < lv <= 8 and lv % 4 == 0:
        return rgba_from_hex(hex_color)
    raise ValueError(
        f"Invalid hex color format: {hex_color}. " + "Must be format of #RGB, #RRGGBB, #RGBA, or #RRGGBBAA."
    )


def rgb_to_hex(rgb: RGBValue) -> str:
    """
    Convert a RGB values to a hexadecimal string.

    Args:
        rgb: A tuple of RGB values for a sampled color.

    Returns:
        A valid hexadecimal color string.
    """
    value = rgb
    if len(rgb) == 4:
        r, g, b, a = rgb
        a = 0 if a < 0.0 else 1 if a >= 1.0 else a
        value = [r, g, b, math.fabs(a * 255)]
    return "#" + "".join(f"{int(i):02x}" for i in value)


def is_hex_color(c: Any, throw: bool = False) -> TypeGuard[str]:
    if not isinstance(c, str) or not c.startswith("#"):
        return False
    hexc = c.strip("#")
    if len(hexc) in [3, 4, 6, 8]:
        try:
            return all(int(n, 16) >= 0 for n in c)
        except ValueError:
            if throw:
                raise ValueError(
                    f"Invalid hex color value: {c}. Must be in the format #RGB, #RRGGBB, #RGBA, or #RRGGBBAA."
                )
            return False
    return False


def is_rgb(c: Any, throw: bool = False) -> bool:
    try:
        is_valid = isinstance(c, (list, tuple)) and all(n >= 0 and n <= 255 for n in c)
    except TypeError:
        is_valid = False
    except ValueError:
        is_valid = False

    if not is_valid:
        if throw:
            raise ValueError(f"Invalid RGB value: {c}. Must be a list or tuple of integers in the range [0, 255].")

    return is_valid


def is_oklch(c: Any, throw: bool = False) -> bool:
    if not isinstance(c, (list, tuple)) or len(c) != 3:
        if throw:
            raise ValueError(f"Invalid OKLCH value: {c}. Must be a list or tuple of three floats.")
        return False
    L, c, h = c
    if L < 0 or L > 1.0000 or c < 0 or c > 1.0000 or h < 0 or h > 360:
        if throw:
            raise ValueError(f"Invalid OKLCH value: {c}. L must be in [0, 1], c in [0, 1], and h in [0, 360].")
        return False
    return True


def ensure_rgb(*args) -> RGBValue:
    color_value = args[0] if len(args) == 1 else args

    if is_hex_color(color_value):
        return hex_to_rgb(color_value)
    if isinstance(color_value, str) and color_value.startswith("rgb"):
        match = re.search(r"\((.+?)\)", color_value)
        if match:
            color_value = tuple(int(val.strip()) for val in match.group(1).split(","))
    if isinstance(color_value, (list, tuple)):
        rgb = RGB(*color_value) if len(color_value) == 3 else RGBA(*color_value)
        if is_rgb(rgb):
            return rgb
    raise Exception('Arguments to "ensure_rgb" must be a valid hex or rgb string or an iterable of integers.')


def get_lightness(color: str | RGBValue):
    """
    Calculate the luminance of a color using its RGB values.
    See: https://en.wikipedia.org/wiki/Relative_luminance

    Args:
        rgb: A tuple of RGB values from a sampled color.

    Returns:
        The derived value of Y (green) the luminous efficiency
        function where the gamma-compressed values are converted
        to linear RGB (a.k.a., "gamma-expanded" values) via a
        transform matrix.

             ⎡X_{D65}⎤ = ⎡0.4124 0.3576 0.1805⎤⎡R_{linear}⎤
        L -> ⎢Y_{D65}⎟ = ⎢0.2126 0.7152 0.0722⎟⎢G_{linear}⎟
             ⎣Z_{D65}⎦ = ⎣0.0193 0.1192 0.9505⎦⎣B_{linear}⎦

        See: https://en.wikipedia.org/wiki/SRGB#From_sRGB_to_CIE_XYZ
    """
    r, g, b = ensure_rgb(color)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255


def clamp(value: int, min_value: int, max_value: int) -> int:
    return max(min_value, min(value, max_value))


def mean_color(color1: str | tuple[int | float], color2: str | tuple[int]):
    """
    Gets the mean color value between two provided hexadecimal color strings.
    Source: https://stackoverflow.com/a/70468866

    Args:
        color1: A hexadecimal color value
        color2: Another hexadecimal color value

    Returns:
        A hexadecimal color value equal to the mean of color1 and color2.
    """
    rgb1 = hex_to_rgb(color1) if is_hex_color(color1) else color1
    rgb2 = hex_to_rgb(color2) if is_hex_color(color2) else color2

    def avg(x, y):
        return round((x + y) / 2)

    new_rgb = ()

    for i in range(len(rgb1)):
        new_rgb += (avg(rgb1[i], rgb2[i]),)

    return new_rgb


def rgb_to_xyz(value: tuple[int, int, int]) -> tuple[float, float, float]:
    """
    Convert RGB color to XYZ color space.
    """
    # Normalize RGB values to the range [0, 1]
    rgb = np.array(value).astype(float)
    rgb = rgb / 255.0
    # Apply the inverse gamma correction
    rgb = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + np.float64(0.055)) / 1.055) ** 2.4)
    rgb *= 100  # Scale to [0, 100]

    r, g, b = rgb

    # Convert RGB to XYZ
    x = float(r * 0.4124564) + float(g * 0.3575761) + float(b * 0.1804375)
    y = float(r * 0.2126729) + float(g * 0.7151522) + float(b * 0.0721750)
    z = float(r * 0.0193339) + float(g * 0.1191920) + float(b * 0.9503041)

    return (x, y, z)


def xyz_to_lab(xyz: tuple[float, float, float]) -> tuple[float, float, float]:
    """
    Convert XYZ color values to LAB color space.
    """
    # Reference white point D65
    ref_x = 95.047
    ref_y = 100.000
    ref_z = 108.883

    x, y, z = xyz / np.array([ref_x, ref_y, ref_z])

    # Apply the function for LAB
    x = np.where(x > 0.008856, x ** (1 / 3), (x * 7.787) + (16 / 116))
    y = np.where(y > 0.008856, y ** (1 / 3), (y * 7.787) + (16 / 116))
    z = np.where(z > 0.008856, z ** (1 / 3), (z * 7.787) + (16 / 116))

    L = float((116 * y) - 16)
    a = float(500 * (x - y))
    b = float(200 * (y - z))

    return (L, a, b)


def lab_to_lch(lab: tuple[float, float, float]) -> tuple[float, float, float]:
    L, a, b = lab

    h = math.atan2(b, a)
    if h > 0:
        h = (h / math.pi) * 180.0
    else:
        h = 360 - (math.fabs(h) / math.pi) * 180.0
    if h < 0:
        h += 360.0
    elif h >= 360:
        h -= 360.0

    c = math.sqrt(a * a + b * b)

    return (round(L, 2), round(c, 2), round(h, 2))


def lch_to_lab(lch: tuple[float, float, float]) -> tuple[float, float, float]:
    l, c, h = lch  # noqa: E741
    a = c * math.cos((h / 180) * math.pi) if c > 0 else c
    b = c * math.sin((h / 180) * math.pi) if c > 0 else c

    return (l, a, b)


def _lab_convert(v: float) -> float:
    return pow(v, 3) if pow(v, 3) > CIE_E else (116 * v - 16) / CIE_K


def lab_to_xyz(lab: tuple[float, float, float]) -> tuple[float, float, float]:
    l, a, b = lab  # noqa: E741

    fy = (l + 16) / 116
    x = _lab_convert((l + 16) / 116) * D65["X"]
    y = _lab_convert(a / 500 + fy) * D65["Y"]
    z = _lab_convert(fy - b / 200) * D65["Z"]

    return (x, y, z)


def lrgb_to_rgb(rgb: tuple[float, float, float]):
    return tuple(
        (np.sign(v) or 1) * (1.055 * pow(abs(v), 1 / 2.4) - 0.055) if abs(v) > 0.0031308 else v * 12.92 for v in rgb
    )


def to_lch(color: str | RGBValue) -> tuple[float, float, float]:
    """
    Convert RGB color values to LCH color space
    :param color: RGB color tuple or hex string
    :return: Tuple of (Lightness, Chroma, Hue)
    """
    rgb = ensure_rgb(color)
    xyz = rgb_to_xyz(rgb)
    lab = xyz_to_lab(xyz)
    return lab_to_lch(lab)


def cbrt(n: float) -> float:
    return pow(n, 1 / 3)


def to_linear(c: int | float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def to_oklab(color: str | RGBValue) -> tuple[float, float, float]:
    """
    Convert RGB color values to OKLAB color space
    :param color: RGB color tuple or hex string
    :return: Tuple of (Lightness, a, b)
    """
    r, g, b = [v / 255.0 for v in ensure_rgb(color)]

    # Convert to OKLAB first (intermediate step)
    # Implementation of RGB to OKLAB conversion
    r, g, b = to_linear(r), to_linear(g), to_linear(b)

    # Convert to LMS space
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b  # noqa: E741
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

    # Non-linear compression
    l_ = pow(l, 1 / 3) if l > 0 else 0
    m_ = pow(m, 1 / 3) if m > 0 else 0
    s_ = pow(s, 1 / 3) if s > 0 else 0

    # OKLAB coordinates
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

    return (L, a, b)


def to_oklch(color: str | RGBValue) -> tuple[float, float, float]:
    """
    Convert RGB color values to OKLCH color space

    :param color: RGB color tuple
    :return: Tuple of (Lightness, Chroma, Hue)
    """
    L, a, b = to_oklab(color)

    # Convert to OKLCH
    chroma = math.sqrt(a**2 + b**2)

    # Convert hue to degrees, normalize to 0-360
    hue = (math.degrees(math.atan2(b, a)) + 360) % 360

    return (L, chroma, hue)


def oklab_distance(lab1: tuple[float, float, float], lab2: tuple[float, float, float]) -> float:
    """
    Calculate distance between two Oklab colors with balanced weighting
    to properly handle light colors.
    """
    # Convert input hex to LAB
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2

    # Calculate chroma values (saturation)
    C1 = math.sqrt(a1 * a1 + b1 * b1)
    C2 = math.sqrt(a2 * a2 + b2 * b2)

    # Calculate basic deltas
    deltaL = L1 - L2
    deltaA = a1 - a2
    deltaB = b1 - b2
    deltaC = C1 - C2

    # Calculate absolute lightness difference
    # abs_deltaL = abs(deltaL)

    # Base weights
    wL = 2.0
    wA = 4.0
    wB = 4.0
    wC = 3.0

    # Simple fixed weights that give appropriate importance
    # to both lightness and chromatic components
    return math.sqrt(
        wL * deltaL * deltaL  # Lightness difference
        + wA * deltaA * deltaA  # Red-green difference
        + wB * deltaB * deltaB  # Blue-yellow difference
        + wC * deltaC * deltaC  # Chroma (saturation) difference
    )


def valid_color_format(color: str | RGBValue, throw: bool = False) -> bool:
    """
    Check if the provided color value is a valid hex or RGB color.
    """
    return is_hex_color(color, throw) or is_rgb(color, throw) or is_oklch(color, throw)


def get_distance(color1: str | RGBValue, color2: str | RGBValue):
    valid_color_format(color1, throw=True)
    valid_color_format(color2, throw=True)
    return oklab_distance(to_oklab(color1), to_oklab(color2))


def format_color(color: Any, format: str = "hex") -> str:
    """
    Format a color value to a specific format (hex, rgb, oklch).

    Args:
        color: The color value to format.
        format: The desired format ("hex", "rgb", "oklch").

    Returns:
        The formatted color string.
    """
    if format == "hex":
        if is_hex_color(color):
            return color
        return rgb_to_hex(ensure_rgb(color))
    elif format == "rgb":
        rgb = ensure_rgb(color)
        return f"rgb({', '.join(map(str, rgb))})"
    elif format == "oklch":
        oklch = to_oklch(color)
        return f"oklch({', '.join(map(str, oklch))})"
    else:
        raise ValueError(f"Unsupported color format: {format}")
