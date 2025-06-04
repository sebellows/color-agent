from enum import Enum


class OverlayEnum(Enum):
    """
    Describe SVG filter effects that can be applied over a color
    swatch to convey the visual effect of the paint.
    """

    crackle = "crackle"
    chrome = "chrome"
    glossy = "glossy"
    glow = "glow"
    grunge = "grunge"
    liquid = "liquid"
    matte = "matte"
    topographic = "topographic"
    unknown = "unknown"

    def _get_value(self, **kwargs) -> str:
        return self.value


class OpacityEnum(Enum):
    """
    Opacity is a measure of how much light can pass through a material.
    The higher the opacity, the less light can pass through.
    """

    opaque = "opaque"
    semi_opaque = "semi-opaque"
    semi_transparent = "semi-transparent"
    transparent = "transparent"
    unknown = "unknown"

    def _get_value(self, **kwargs) -> str:
        return self.value


class ViscosityEnum(Enum):
    """
    Viscosity is a measure of a fluid's resistance to flow.
    The higher the viscosity, the thicker the fluid.
    """

    low = "low"
    low_medium = "low-to-medium"
    medium = "medium"
    medium_high = "medium-to-high"
    high = "high"
    unknown = "unknown"

    def _get_value(self, **kwargs) -> str:
        return self.value


class ProductTypeEnum(Enum):
    """
    Color Agent categories for product type
    """

    Acrylic = "Acrylic"
    Contrast = "Contrast"
    Effect = "Effect"
    Enamel = "Enamel"
    Flesh = "Flesh"
    Florescent = "Florescent"
    Ink = "Ink"
    Medium = "Medium"
    Metallic = "Metallic"
    Wash = "Wash"
    Primer = "Primer"  # Could be spray or brush on

    def _get_value(self, **kwargs) -> str:
        return self.value


class ApplicationMethodEnum(Enum):
    Airbrush = "Airbrush"
    DryBrush = "Dry Brush"
    Spray = "Spray"

    def _get_value(self, **kwargs) -> str:
        return self.value


class ProductLineTypeEnum(Enum):
    """
    Similar to ProductType, but reserved for when an entire
    product line is of that type.
    """

    Air = "Air"
    Contrast = "Contrast"
    Effect = "Effect"
    Florescent = "Florescent"
    Ink = "Ink"
    Medium = "Medium"  # Varnishes, thinners, mediums, etc.
    Metallic = "Metallic"
    Mixed = "Mixed"  # When a product line is a mix of types
    Primer = "Primer"
    Wash = "Wash"

    def _get_value(self, **kwargs) -> str:
        return self.value


class ColorRangeEnum(Enum):
    """
    Basic Color Terms (+5 metallic colors)

    Color Agent color categories are comprised of 13 colors identified
    in the ISCC NBS color system, plus 5 metallic color categories.
    See: https://en.wikipedia.org/wiki/Color_term#basic_color_terms
    """

    Black = "Black"
    Blue = "Blue"
    Brown = "Brown"
    Grey = "Grey"
    Green = "Green"
    Olive = "Olive"
    Orange = "Orange"
    Pink = "Pink"
    Purple = "Purple"
    Red = "Red"
    Turquoise = "Turquoise"
    Yellow = "Yellow"
    White = "White"

    Brass = "Brass"
    Bronze = "Bronze"
    Copper = "Copper"
    Gold = "Gold"
    Silver = "Silver"

    def _get_value(self, **kwargs) -> str:
        return self.value


class PackagingTypeEnum(Enum):
    Bottle = "Bottle"
    Dropper_Bottle = "Dropper Bottle"
    Jar = "Jar"
    Pot = "Pot"
    Spray_Can = "Spray Can"
    Tube = "Tube"

    def _get_value(self, **kwargs) -> str:
        return self.value
