import { getEntries } from '@coloragent/utils'
import { type HslValueString, toHslString } from '@ui/lib/color'
import { THEME_COLOR_SCHEMES } from '../theme'
import {
    CustomColorSchemes,
    PaletteColors,
    rawColorPalette,
    ThemeColorSchemes,
    useColorPalette,
} from '../theme/color-palette'
import { PlatformEnv } from '../types'

function generateHslColorScheme<TColorSchemes extends CustomColorSchemes = {}>(
    themeColors: ThemeColorSchemes<TColorSchemes>,
): PaletteColors<HslValueString> {
    return getEntries(rawColorPalette).reduce((acc, [colorName, colorValues]) => {
        acc[colorName] = colorValues.map(color => toHslString(color))
        return acc
    }, {} as PaletteColors<HslValueString>)
}

export const colors = {}

export function getThemeColors(platform: PlatformEnv) {
    const colorSpace = platform === 'mobile' ? 'hsl' : 'oklch'
    const { colorSchemes } = useColorPalette(colorSpace, THEME_COLOR_SCHEMES)
    const light = colorSchemes.neutral(0) // palette.neutral[0]
    const dark = colorSchemes.neutral(12)

    const sharedSchemas = {
        transparent: 'transparent',

        // Primary theme accent colors
        'accent.action-default': colorSchemes.accent(6),
        'accent.bg-primary': colorSchemes.accent(5),
        'accent.bg-secondary': colorSchemes.accent(7),
        'accent.border': colorSchemes.accent(7),
        'accent.fg-primary': colorSchemes.accent(12),

        // Secondary theme accent colors
        'secondary.action-default': colorSchemes.secondary(6),
        'secondary.bg-primary': colorSchemes.secondary(5),
        'secondary.bg-secondary': colorSchemes.secondary(7),
        'secondary.border': colorSchemes.secondary(7),
        'secondary.fg-primary': colorSchemes.secondary(12),

        // Critical/negative theme colors
        'critical.action-default': colorSchemes.critical(6),
        'critical.bg-primary': colorSchemes.critical(5),
        'critical.bg-secondary': colorSchemes.critical(7),
        'critical.border': colorSchemes.critical(7),
        'critical.fg-primary': colorSchemes.critical(12),

        // Positive/success theme colors
        'positive.action-default': colorSchemes.positive(6),
        'positive.bg-primary': colorSchemes.positive(5),
        'positive.bg-secondary': colorSchemes.positive(7),
        'positive.border': colorSchemes.positive(7),
        'positive.fg-primary': colorSchemes.positive(12),

        // Warning theme colors
        'warning.action-default': colorSchemes.warning(6),
        'warning.bg-primary': colorSchemes.warning(5),
        'warning.bg-secondary': colorSchemes.warning(7),
        'warning.border': colorSchemes.warning(7),
        'warning.fg-primary': colorSchemes.warning(12),
    }

    return {
        light: {
            'base.fg-primary': dark,
            'base.fg-inverted': colorSchemes.neutral(2),
            'base.fg-subtle': colorSchemes.neutral(6),

            'base.bg-overlay': colorSchemes.neutral(11, 66),
            'base.bg-primary': light,
            'base.bg-secondary': colorSchemes.neutral(1),
            'base.bg-subtle': colorSchemes.neutral(4),

            'base.action-hover': colorSchemes.neutral(6),
            'base.action-default': dark,

            'base.border-transparent': colorSchemes.neutral(12, 12.5),
            'base.border-default': colorSchemes.neutral(2),

            'base.component-bg-default': light,
            'base.component-bg-hover': colorSchemes.neutral(3, 20),
            'base.component-bg-pressed': colorSchemes.neutral(3, 33.33),
            'base.component-bg-subtle': colorSchemes.neutral(1),

            ...sharedSchemas,
        },
        dark: {
            'base.fg-primary': light,
            'base.fg-inverted': colorSchemes.neutral(11),
            'base.fg-subtle': colorSchemes.neutral(6),

            'base.bg-overlay': colorSchemes.neutral(11, 66),
            'base.bg-primary': dark,
            'base.bg-secondary': colorSchemes.neutral(10),
            'base.bg-subtle': colorSchemes.neutral(8),

            'base.action-hover': colorSchemes.neutral(3),
            'base.action-default': dark,

            'base.border-transparent': colorSchemes.neutral(1, 12.5),
            'base.border-default': colorSchemes.neutral(6),

            'base.component-bg-default': dark,
            'base.component-bg-hover': colorSchemes.neutral(10, 20),
            'base.component-bg-pressed': colorSchemes.neutral(10, 33.33),
            'base.component-bg-subtle': colorSchemes.neutral(11),

            ...sharedSchemas,
        },
    }
}
