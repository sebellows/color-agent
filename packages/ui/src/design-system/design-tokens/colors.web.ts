import { THEME_COLOR_SCHEMES } from '../../theme/theme.const'
import { getColorSchemes } from '../color-palette/palette.web'

const colorSchemes = getColorSchemes(THEME_COLOR_SCHEMES)

const _light = colorSchemes.neutral(0) // palette.neutral[0]
const _dark = colorSchemes.neutral(12)

const primary = {
    // Primary theme accent colors
    actionDefault: colorSchemes.primary(6),
    bg: colorSchemes.primary(5),
    bgHover: colorSchemes.primary(4),
    bgMuted: colorSchemes.primary(7),
    bgMutedHover: colorSchemes.primary(6),
    bgSubtle: colorSchemes.primary(3),
    fg: colorSchemes.primary(12),
    focusRing: colorSchemes.primary(5),
    line1: colorSchemes.primary(5, 12.5),
    line2: colorSchemes.primary(5, 24),
    line3: colorSchemes.primary(5, 36),
}

const accent = {
    // Secondary theme accent colors
    actionDefault: colorSchemes.accent(6),
    bg: colorSchemes.accent(5),
    bgHover: colorSchemes.accent(4),
    bgMuted: colorSchemes.accent(7),
    bgMutedHover: colorSchemes.accent(6),
    bgSubtle: colorSchemes.accent(3),
    fg: colorSchemes.accent(12),
    focusRing: colorSchemes.accent(5),
    line1: colorSchemes.accent(5, 12.5),
    line2: colorSchemes.accent(5, 24),
    line3: colorSchemes.accent(5, 36),
}

const critical = {
    // Critical/negative theme colors
    actionDefault: colorSchemes.critical(6),
    bg: colorSchemes.critical(5),
    bgHover: colorSchemes.critical(4),
    bgMuted: colorSchemes.critical(7),
    bgMutedHover: colorSchemes.critical(6),
    bgSubtle: colorSchemes.critical(3),
    fg: colorSchemes.critical(12),
    focusRing: colorSchemes.critical(5),
    line1: colorSchemes.critical(5, 12.5),
    line2: colorSchemes.critical(5, 24),
    line3: colorSchemes.critical(5, 36),
}

const positive = {
    // Positive/success theme colors
    actionDefault: colorSchemes.positive(6),
    bg: colorSchemes.positive(5),
    bgHover: colorSchemes.positive(4),
    bgMuted: colorSchemes.positive(7),
    bgMutedHover: colorSchemes.positive(6),
    bgSubtle: colorSchemes.positive(3),
    fg: colorSchemes.positive(12),
    focusRing: colorSchemes.positive(5),
    line1: colorSchemes.positive(5, 12.5),
    line2: colorSchemes.positive(5, 24),
    line3: colorSchemes.positive(5, 36),
}

const warning = {
    // Warning theme colors
    actionDefault: colorSchemes.warning(6),
    bg: colorSchemes.warning(5),
    bgHover: colorSchemes.warning(4),
    bgMuted: colorSchemes.warning(7),
    bgMutedHover: colorSchemes.warning(6),
    bgSubtle: colorSchemes.warning(3),
    fg: colorSchemes.warning(12),
    focusRing: colorSchemes.warning(5),
    line1: colorSchemes.warning(5, 12.5),
    line2: colorSchemes.warning(5, 24),
    line3: colorSchemes.warning(5, 36),
}

const neutral = {
    // Warning theme colors
    actionDefault: colorSchemes.neutral(6),
    bg: colorSchemes.neutral(5),
    bgHover: colorSchemes.neutral(4),
    bgMuted: colorSchemes.neutral(7),
    bgMutedHover: colorSchemes.neutral(6),
    bgSubtle: colorSchemes.neutral(3),
    fg: colorSchemes.neutral(12),
    focusRing: colorSchemes.neutral(5),
    line1: colorSchemes.neutral(5, 12.5),
    line2: colorSchemes.neutral(5, 24),
    line3: colorSchemes.neutral(5, 36),
}

const light = {
    fg: _dark,
    fgInverted: colorSchemes.neutral(2),
    fgMuted: colorSchemes.neutral(8),
    fgSubtle: colorSchemes.neutral(6),

    bg: _light,
    bgHover: colorSchemes.neutral(2),
    bgMuted: colorSchemes.neutral(4),
    bgMutedHover: colorSchemes.neutral(5),
    bgSubtle: colorSchemes.neutral(1),
    bgOverlay: colorSchemes.neutral(11, 8),

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
    fgMuted: colorSchemes.neutral(4),
    fgSubtle: colorSchemes.neutral(6),

    bg: _dark,
    bgHover: colorSchemes.neutral(11),
    bgMuted: colorSchemes.neutral(10),
    bgMutedHover: colorSchemes.neutral(9),
    bgSubtle: colorSchemes.neutral(8),
    bgOverlay: colorSchemes.neutral(11, 8),

    focusRing: colorSchemes.neutral(1),
    line1: colorSchemes.neutral(1, 12.5),
    line2: colorSchemes.neutral(1, 25),
    line3: colorSchemes.neutral(1, 37.5),

    componentBg: _dark,
    componentBgHover: colorSchemes.neutral(10, 20),
    componentBgPressed: colorSchemes.neutral(10, 33.33),
    componentBgSubtle: colorSchemes.neutral(11),
}

export const colors = {
    primary,
    accent,
    critical,
    neutral,
    positive,
    warning,
    light,
    dark,
}

type Colors = typeof colors
type ColorSchemeToken = keyof Colors
type ColorSchemeVariantToken = keyof Colors[ColorSchemeToken]
export type ColorToken = `${ColorSchemeToken}.${ColorSchemeVariantToken}`

export type ColorScheme = keyof Omit<Colors, 'light' | 'dark'>
export type ColorVariant = keyof Colors[ColorScheme]

// export function getThemeColors(platform: PlatformEnv) {
//     const colorSpace = platform === 'mobile' ? 'hsl' : 'oklch'
//     const { colorSchemes } = useColorPalette(colorSpace, THEME_COLOR_SCHEMES)
//     const light = colorSchemes.neutral(0) // palette.neutral[0]
//     const dark = colorSchemes.neutral(12)

//     const sharedSchemas = {
//         transparent: 'transparent',

//         // Primary theme accent colors
//         'accent.action-default': colorSchemes.accent(6),
//         'accent.bg-primary': colorSchemes.accent(5),
//         'accent.bg-secondary': colorSchemes.accent(7),
//         'accent.border': colorSchemes.accent(7),
//         'accent.fg-primary': colorSchemes.accent(12),

//         // Secondary theme accent colors
//         'secondary.action-default': colorSchemes.secondary(6),
//         'secondary.bg-primary': colorSchemes.secondary(5),
//         'secondary.bg-secondary': colorSchemes.secondary(7),
//         'secondary.border': colorSchemes.secondary(7),
//         'secondary.fg-primary': colorSchemes.secondary(12),

//         // Critical/negative theme colors
//         'critical.action-default': colorSchemes.critical(6),
//         'critical.bg-primary': colorSchemes.critical(5),
//         'critical.bg-secondary': colorSchemes.critical(7),
//         'critical.border': colorSchemes.critical(7),
//         'critical.fg-primary': colorSchemes.critical(12),

//         // Positive/success theme colors
//         'positive.action-default': colorSchemes.positive(6),
//         'positive.bg-primary': colorSchemes.positive(5),
//         'positive.bg-secondary': colorSchemes.positive(7),
//         'positive.border': colorSchemes.positive(7),
//         'positive.fg-primary': colorSchemes.positive(12),

//         // Warning theme colors
//         'warning.action-default': colorSchemes.warning(6),
//         'warning.bg-primary': colorSchemes.warning(5),
//         'warning.bg-secondary': colorSchemes.warning(7),
//         'warning.border': colorSchemes.warning(7),
//         'warning.fg-primary': colorSchemes.warning(12),
//     }

//     return {
//         light: {
//             'base.fg-primary': dark,
//             'base.fg-inverted': colorSchemes.neutral(2),
//             'base.fg-subtle': colorSchemes.neutral(6),

//             'base.bg-overlay': colorSchemes.neutral(11, 66),
//             'base.bg-primary': light,
//             'base.bg-secondary': colorSchemes.neutral(1),
//             'base.bg-subtle': colorSchemes.neutral(4),

//             'base.action-hover': colorSchemes.neutral(6),
//             'base.action-default': dark,

//             'base.border-transparent': colorSchemes.neutral(12, 12.5),
//             'base.border-default': colorSchemes.neutral(2),

//             'base.component-bg-default': light,
//             'base.component-bg-hover': colorSchemes.neutral(3, 20),
//             'base.component-bg-pressed': colorSchemes.neutral(3, 33.33),
//             'base.component-bg-subtle': colorSchemes.neutral(1),

//             ...sharedSchemas,
//         },
//         dark: {
//             'base.fg-primary': light,
//             'base.fg-inverted': colorSchemes.neutral(11),
//             'base.fg-subtle': colorSchemes.neutral(6),

//             'base.bg-overlay': colorSchemes.neutral(11, 66),
//             'base.bg-primary': dark,
//             'base.bg-secondary': colorSchemes.neutral(10),
//             'base.bg-subtle': colorSchemes.neutral(8),

//             'base.action-hover': colorSchemes.neutral(3),
//             'base.action-default': dark,

//             'base.border-transparent': colorSchemes.neutral(1, 12.5),
//             'base.border-default': colorSchemes.neutral(6),

//             'base.component-bg-default': dark,
//             'base.component-bg-hover': colorSchemes.neutral(10, 20),
//             'base.component-bg-pressed': colorSchemes.neutral(10, 33.33),
//             'base.component-bg-subtle': colorSchemes.neutral(11),

//             ...sharedSchemas,
//         },
//     }
// }
