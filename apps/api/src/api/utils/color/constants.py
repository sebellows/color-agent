"""
D65 represents white light, XYZ here represents the central 2-degree functions for observing
illuminant data.
@see https://en.wikipedia.org/wiki/Standard_illuminant
"""

D65 = {
    "X": 0.95047,  # i.e., 0.3127 / 0.329,
    "Y": 1,
    "Z": 1.08883,  # i.e., (1 - 0.3127 - 0.329) / 0.329,
}

# Constants used in Lab calculations
CIE_K = pow(29, 3) / pow(3, 3)
CIE_E = pow(6, 3) / pow(29, 3)
