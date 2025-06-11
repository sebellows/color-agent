from enum import Enum


class OverlayEnum(Enum):
    """
    Describe SVG filter effects that can be applied over a color
    swatch to convey the visual effect of the paint.
    """

    Crackle = "Crackle"
    Chrome = "Chrome"
    Glossy = "Glossy"
    Glow = "Glow"
    Grunge = "Grunge"
    Liquid = "Liquid"
    Matte = "Matte"
    Topographic = "Topographic"
    Unknown = "Unknown"

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


class OpacityEnum(Enum):
    """
    Opacity is a measure of how much light can pass through a material.
    The higher the opacity, the less light can pass through.
    """

    Opaque = "Opaque"
    SemiOpaque = "SemiOpaque"
    SemiTransparent = "SemiTransparent"
    Transparent = "Transparent"
    Unknown = "Unknown"

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


class ViscosityEnum(Enum):
    """
    Viscosity is a measure of a fluid's resistance to flow.
    The higher the viscosity, the thicker the fluid.
    """

    Low = "Low"
    LowMedium = "LowMedium"
    Medium = "Medium"
    MediumHigh = "MediumHigh"
    High = "High"
    Unknown = "Unknown"

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


class ProductTypeEnum(Enum):
    """
    Color Agent categories for product type
    """

    Acrylic = "Acrylic"  # Default
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

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


class ApplicationMethodEnum(Enum):
    Airbrush = "Airbrush"
    DryBrush = "Dry Brush"
    Spray = "Spray"
    Unknown = "Unknown"

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


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
    Mixed = "Mixed"  # Default, when a product line is a mix of types
    Primer = "Primer"
    Wash = "Wash"

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


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

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_


class PackagingTypeEnum(Enum):
    Bottle = "Bottle"
    DropperBottle = "DropperBottle"
    Jar = "Jar"
    Pot = "Pot"
    SprayCan = "SprayCan"
    Tube = "Tube"
    Unknown = "Unknown"

    def __getitem__(self, name: str):
        return super().__getattribute__(name)

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_
