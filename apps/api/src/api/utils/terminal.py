from .string import get_formatting_variables

__all__ = ["write"]

TColorKeys = [
    "ESC",
    "BLACK",
    "RED",
    "GREEN",
    "YELLOW",
    "BLUE",
    "MAGENTA",
    "CYAN",
    "WHITE",
    "GRAY",
    "BLACK_BG",
    "RED_BG",
    "GREEN_BG",
    "YELLOW_BG",
    "BLUE_BG",
    "MAGENTA_BG",
    "CYAN_BG",
    "WHITE_BG",
    "GRAY_BG",
    "BRIGHT_BLACK",
    "BRIGHT_RED",
    "BRIGHT_GREEN",
    "BRIGHT_YELLOW",
    "BRIGHT_BLUE",
    "BRIGHT_MAGENTA",
    "BRIGHT_CYAN",
    "BRIGHT_WHITE",
    "BRIGHT_GRAY",
    "BRIGHT_BLACK_BG",
    "BRIGHT_RED_BG",
    "BRIGHT_GREEN_BG",
    "BRIGHT_YELLOW_BG",
    "BRIGHT_BLUE_BG",
    "BRIGHT_MAGENTA_BG",
    "BRIGHT_CYAN_BG",
    "BRIGHT_WHITE_BG",
    "BRIGHT_GRAY_BG",
    "HEADER",
    "PRIMARY",
    "SECONDARY",
    "ACCENT",
    "MUTED",
    "WARNING",
    "FAIL",
    "PRIMARY_BG",
    "SECONDARY_BG",
    "ACCENT_BG",
    "MUTED_BG",
    "WARNING_BG",
    "FAIL_BG",
    "END",
    "_BOLD",
    "BOLD_",
    "_DIM",
    "DIM_",
    "_ITAL",
    "ITAL_",
    "_UNDERLINE",
    "UNDERLINE_",
    "_BLINK",
    "BLINK_",
    "_REV",
    "REV_",
    "_HIDE",
    "HIDE_",
    "_STRIKE",
    "STRIKE_",
]


class TColors:
    """
    ASCII Escape codes for displaying color in the console.

    References:
    -----------
    - https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797

    Example
    -------
    >>>print(f"{TColors.WARNING}Warning: Everyone has left. Continue embarrassing yourself?{TColors.ENDC}")

    >>>print(f"{_BOLD}{PRIMARY}Color:{BOLD_}{END} {_ITAL}{ACCENT}{color}{ITAL_}{END}", color = "Primary"))
    Color: Primary
    """

    # ----------- Boundries ------------
    ESC = "\033["

    # ------------- Colors -------------
    BLACK = "\033[30m"
    RED = "\033[31m"  # 1;31;40m | 91m
    GREEN = "\033[32m"  # 92m
    YELLOW = "\033[33m"  # 1;33;40m | 93m
    BLUE = "\033[34m"  # 94m
    MAGENTA = "\033[35m"  # 1;35;40m
    CYAN = "\033[36m"  # 96m
    WHITE = "\033[37m"
    GRAY = "\033[39"

    BLACK_BG = "\033[40m"
    RED_BG = "\033[41m"  # 1;31;40m | 91m
    GREEN_BG = "\033[42m"  # 92m
    YELLOW_BG = "\033[43m"  # 1;33;40m | 93m
    BLUE_BG = "\033[44m"  # 94m
    MAGENTA_BG = "\033[45m"  # 1;35;40m
    CYAN_BG = "\033[46m"  # 96m
    WHITE_BG = "\033[47m"
    GRAY_BG = "\033[49"

    BRIGHT_BLACK = "\033[90m"
    BRIGHT_RED = "\033[91m"  # 1;31;40m | 91m
    BRIGHT_GREEN = "\033[92m"  # 92m
    BRIGHT_YELLOW = "\033[93m"  # 1;33;40m | 93m
    BRIGHT_BLUE = "\033[94m"  # 94m
    BRIGHT_MAGENTA = "\033[95m"  # 1;35;40m
    BRIGHT_CYAN = "\033[96m"  # 96m
    BRIGHT_WHITE = "\033[97m"
    BRIGHT_GRAY = "\033[99m"

    BRIGHT_BLACK_BG = "\033[100m"
    BRIGHT_RED_BG = "\033[101m"  # 1;31;40m | 91m
    BRIGHT_GREEN_BG = "\033[102m"  # 92m
    BRIGHT_YELLOW_BG = "\033[103m"  # 1;33;40m | 93m
    BRIGHT_BLUE_BG = "\033[104m"  # 94m
    BRIGHT_MAGENTA_BG = "\033[105m"  # 1;35;40m
    BRIGHT_CYAN_BG = "\033[106m"  # 96m
    BRIGHT_WHITE_BG = "\033[107m"
    BRIGHT_GRAY_BG = "\033[109m"

    # ------------ Theming -------------
    HEADER = "\033[38;5;199m"  # '\033[95m'

    PRIMARY = "\033[38;5;199m"  # PINK/MAGENTA
    SECONDARY = "\033[38;5;209m"  # ORANGE
    ACCENT = "\033[38;5;220m"  # ORANGEISH-YELLOW
    MUTED = "\033[38;5;69m"  # BLUISH-GRAY
    WARNING = "\033[38;5;226m"  # '\033[93m'
    FAIL = "\033[38;5;160m"  # '\033[91m'

    PRIMARY_BG = "\033[48;5;207m"  # PINK/MAGENTA
    SECONDARY_BG = "\033[48;5;216m"  # ORANGE
    ACCENT_BG = "\033[48;5;230m"  # ORANGEISH-YELLOW
    MUTED_BG = "\033[48;5;111m"  # BLUISH-GRAY
    WARNING_BG = "\033[48;5;231m"  # '\033[93m'
    FAIL_BG = "\033[48;5;171m"  # '\033[91m'

    # ------------ Styles --------------
    END = "\033[0m"  # Reset all modes (styles and colors)
    _BOLD = "\033[1m"  # Bold text code sequence
    BOLD_ = "\033[21m"  # Bold text reset sequence
    _DIM = "\033[2m"  # Dim mode code sequence
    DIM_ = "\033[22m"  # Dim text reset sequence
    _ITAL = "\033[3m"  # Italic text code sequence
    ITAL_ = "\033[23m"  # Italic text reset sequence
    _UNDERLINE = "\033[4m"  # Underline text code sequence
    UNDERLINE_ = "\033[24m"  # Underline text reset sequence
    _BLINK = "\033[5m"  # Blinking mode code sequence
    BLINK_ = "\033[25m"  # Blinking mode reset sequence
    _REV = "\033[7m"  # Inverse/Reverse mode code sequence
    REV_ = "\033[27m"  # Inverse/Reverse mode reset sequence
    _HIDE = "\033[8m"  # Hidden/Invisible mode code sequence
    HIDE_ = "\033[28m"  # Hidden/Invisible mode reset sequence
    _STRIKE = "\033[9m"  # Strikethroughx text code sequence
    STRIKE_ = "\033[29m"  # Strikethroughx text reset sequence


def stylize_message(message: str, **kwargs):
    formatting_vars = get_formatting_variables(message)

    if len(formatting_vars) == 0 or len(kwargs) == 0:
        return message

    items = {}
    for i in range(len(formatting_vars)):
        var = formatting_vars[i]
        if var in TColorKeys:
            items[var] = getattr(TColors, var)
        else:
            items[var] = kwargs.get(var)

    return message.format(**items)


def write(message: str, **kwargs):
    formatted = stylize_message(message, **kwargs)
    print(formatted)
