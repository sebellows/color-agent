import { Platform } from 'react-native'

import { useColorPalette } from '../color-palette'
import { THEME_COLOR_SCHEMES } from '../constants'

// export const colors = {}

const colorSpace = Platform.OS === 'web' ? 'oklch' : 'hsl'
const { colorSchemes } = useColorPalette(colorSpace, THEME_COLOR_SCHEMES)

const _light = colorSchemes.neutral(0) // palette.neutral[0]
const _dark = colorSchemes.neutral(12)

const primary = {
    // Primary theme accent colors
    actionDefault: colorSchemes.primary(6),
    bgPrimary: colorSchemes.primary(5),
    bgSecondary: colorSchemes.primary(7),
    border: colorSchemes.primary(7),
    fgPrimary: colorSchemes.primary(12),
    focusRing: colorSchemes.primary(5),
    line1: colorSchemes.primary(5, 12.5),
    line2: colorSchemes.primary(5, 24),
    line3: colorSchemes.primary(5, 36),
}

const accent = {
    // Secondary theme accent colors
    actionDefault: colorSchemes.accent(6),
    bgPrimary: colorSchemes.accent(5),
    bgSecondary: colorSchemes.accent(7),
    border: colorSchemes.accent(7),
    fgPrimary: colorSchemes.accent(12),
    focusRing: colorSchemes.accent(5),
    line1: colorSchemes.accent(5, 12.5),
    line2: colorSchemes.accent(5, 24),
    line3: colorSchemes.accent(5, 36),
}

const critical = {
    // Critical/negative theme colors
    actionDefault: colorSchemes.critical(6),
    bgPrimary: colorSchemes.critical(5),
    bgSecondary: colorSchemes.critical(7),
    border: colorSchemes.critical(7),
    fgPrimary: colorSchemes.critical(12),
    focusRing: colorSchemes.critical(5),
    line1: colorSchemes.critical(5, 12.5),
    line2: colorSchemes.critical(5, 24),
    line3: colorSchemes.critical(5, 36),
}

const positive = {
    // Positive/success theme colors
    actionDefault: colorSchemes.positive(6),
    bgPrimary: colorSchemes.positive(5),
    bgSecondary: colorSchemes.positive(7),
    border: colorSchemes.positive(7),
    fgPrimary: colorSchemes.positive(12),
    focusRing: colorSchemes.positive(5),
    line1: colorSchemes.positive(5, 12.5),
    line2: colorSchemes.positive(5, 24),
    line3: colorSchemes.positive(5, 36),
}

const warning = {
    // Warning theme colors
    actionDefault: colorSchemes.warning(6),
    bgPrimary: colorSchemes.warning(5),
    bgSecondary: colorSchemes.warning(7),
    border: colorSchemes.warning(7),
    fgPrimary: colorSchemes.warning(12),
    focusRing: colorSchemes.warning(5),
    line1: colorSchemes.warning(5, 12.5),
    line2: colorSchemes.warning(5, 24),
    line3: colorSchemes.warning(5, 36),
}

const light = {
    fg: _dark,
    fgInverted: colorSchemes.neutral(2),
    fgMuted: colorSchemes.neutral(8),
    fgSubtle: colorSchemes.neutral(6),

    bg: _light,
    bgMuted: colorSchemes.neutral(4),
    bgSubtle: colorSchemes.neutral(1),
    bgOverlay: colorSchemes.neutral(11, 66),
    bgHover: colorSchemes.neutral(6),

    focusRing: colorSchemes.neutral(6),
    line1: colorSchemes.neutral(6, 12.5),
    line2: colorSchemes.neutral(6, 25),
    line3: colorSchemes.neutral(6, 37.5),

    componentBg: _light,
    componentBgHover: colorSchemes.neutral(3, 20),
    componentBgPressed: colorSchemes.neutral(3, 33.33),
    componentBgSubtle: colorSchemes.neutral(1),
}

const dark = {
    fg: _light,
    fgInverted: colorSchemes.neutral(11),
    fgSubtle: colorSchemes.neutral(6),

    bg: _dark,
    bgSecondary: colorSchemes.neutral(10),
    bgSubtle: colorSchemes.neutral(8),
    bgOverlay: colorSchemes.neutral(11, 66),

    bgHover: colorSchemes.neutral(3),

    focusRing: colorSchemes.neutral(1),
    line1: colorSchemes.neutral(1, 12.5),
    line2: colorSchemes.neutral(1, 25),
    line3: colorSchemes.neutral(1, 37.5),

    componentBg: _dark,
    componentBgHover: colorSchemes.neutral(10, 20),
    componentBgPressed: colorSchemes.neutral(10, 33.33),
    componentBgSubtle: colorSchemes.neutral(11),
}

const colors = {
    primary,
    accent,
    critical,
    positive,
    warning,
    light,
    dark,
}

export type ColorToken = keyof typeof colors

export default colors
