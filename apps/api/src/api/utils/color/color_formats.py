class RGBA(tuple):
    """
    A class to represent an RGBA color, which is a tuple of 3 integers and an optional alpha float.
    Inherits from tuple to allow for easy unpacking and manipulation.
    """

    def __new__(cls, r: int, g: int, b: int, a: float = 1.0):
        return super().__new__(cls, (r, g, b, max(0.0, min(1.0, a))))

    def __len__(self):
        return 4

    def validate(self, throw: bool = False) -> bool:
        """
        Validate the RGBA values to ensure they are within the correct ranges.
        """

        is_valid = 0 < len(self) <= 8 and len(self) % 4 == 0

        if throw:
            if not all(0 <= x <= 255 for x in self[:3]):
                raise ValueError("RGB values must be between 0 and 255.")
            if not (0.0 <= self[3] <= 1.0):
                raise ValueError("Alpha value must be between 0.0 and 1.0.")
        return is_valid


class RGB(tuple):
    """
    A class to represent an RGB color, which is a tuple of 3 integers.
    Inherits from tuple to allow for easy unpacking and manipulation.
    """

    def __new__(cls, r: int, g: int, b: int):
        return super().__new__(cls, (r, g, b))

    def __len__(self):
        return 3

    def validate(self, throw: bool = False) -> bool:
        """
        Validate the RGB values to ensure they are within the correct ranges.
        """

        is_valid = 0 < len(self) <= 6 and len(self) % 3 == 0

        if throw and not all(0 <= x <= 255 for x in self):
            raise ValueError("RGB values must be between 0 and 255.")
        return is_valid


type RGBValue = RGB | RGBA
