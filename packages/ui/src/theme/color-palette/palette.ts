import { assertUnreachable, getEntries } from '@coloragent/utils'
import Color, { Coords } from 'colorjs.io'
import { isNumber } from 'es-toolkit/compat'

import { THEME_COLOR_SCHEMES } from '../constants'
import { rawColorPalette } from './raw-colors'
import {
    CustomColorSchemes,
    HslValueString,
    OklchValueString,
    PaletteColors,
    StateColor,
    ThemeColorSchemeMap,
    ThemeColorSchemes,
} from './types'

function normalizeAlpha(alpha?: number) {
    if (typeof alpha === 'number') {
        if (alpha <= 1.0) {
            alpha = alpha <= 0 ? 0 : alpha
        } else if (alpha > 1) {
            alpha = alpha > 100 ? 100 : alpha
            alpha = alpha / 100
        }
    }
    return alpha
}

export function toHslString(values: Coords, alpha = 1): HslValueString {
    return new Color({ space: 'oklch', coords: values, alpha: normalizeAlpha(alpha) })
        .to('hsl')
        .toString() as HslValueString
}

export function toOklchString(values: Coords, alpha?: number): OklchValueString {
    return new Color('oklch', values, normalizeAlpha(alpha)).toString() as OklchValueString
}

export function appendColorSchemes<TColorSchemes extends CustomColorSchemes>(
    schemes: TColorSchemes,
): ThemeColorSchemes<TColorSchemes> {
    return { ...THEME_COLOR_SCHEMES, ...schemes } as ThemeColorSchemes<TColorSchemes>
}

export function whenColorScheme<TColorValue, TColorSchemes extends CustomColorSchemes = {}>(
    scheme: keyof ThemeColorSchemeMap<TColorValue, TColorSchemes>,
    match: ThemeColorSchemeMap<TColorValue, TColorSchemes>,
) {
    switch (scheme) {
        case 'accent':
            return match.accent
        case 'critical':
            return match.critical
        case 'default':
            return match.default
        case 'neutral':
            return match.neutral
        case 'primary':
            return match.primary
        case 'positive':
            return match.positive
        case 'warning':
            return match.warning
        default:
            return assertUnreachable(scheme)
    }
}

export function whenStateColor<T>(state: StateColor, match: Record<StateColor, T>) {
    switch (state) {
        case 'active':
            return match.active
        case 'default':
            return match.default
        case 'disabled':
            return match.disabled
        case 'focus':
            return match.focus
        case 'hover':
            return match.hover
        case 'invalid':
            return match.invalid
        case 'valid':
            return match.valid
        default:
            return assertUnreachable(state)
    }
}

const palette: PaletteColors<string> = getEntries(rawColorPalette).reduce(
    (acc, [colorName, colorValues]) => {
        acc[colorName] = colorValues.map(color => new Color('hsl', color).toString())
        return acc
    },
    {} as PaletteColors<string>,
)

function getColor(color: keyof PaletteColors, index: number, alpha?: number) {
    return new Color('oklch', rawColorPalette[color][index], normalizeAlpha(alpha)).toString()
}

export function resolvePaletteColor(color: keyof PaletteColors, defaultAlpha?: number) {
    return (index = 6, alpha = defaultAlpha) => {
        if (!isNumber(alpha)) {
            return palette[color][index]
        }

        return getColor(color, index, alpha)
    }
}

export const getColorSchemes = (themeColors: ThemeColorSchemes) => ({
    accent: resolvePaletteColor(themeColors.accent),
    critical: resolvePaletteColor(themeColors.critical),
    default: resolvePaletteColor(themeColors.default),
    neutral: resolvePaletteColor(themeColors.neutral),
    primary: resolvePaletteColor(themeColors.primary),
    positive: resolvePaletteColor(themeColors.positive),
    warning: resolvePaletteColor(themeColors.warning),
})

// export function useColorPalette<
//     ColorSpace extends 'hsl' | 'oklch',
//     TColorSchemes extends CustomColorSchemes = {},
// >(space: ColorSpace, themeColors: ThemeColorSchemes<TColorSchemes>) {
//     const init = {} as PaletteColors<string>
//     let palette = {} as PaletteColors<string>

//     if (space === 'oklch') {
//         palette = getEntries(rawColorPalette).reduce((acc, [colorName, colorValues]) => {
//             acc[colorName] = colorValues.map(color => toOklchString(color))
//             return acc
//         }, init)
//     } else {
//         palette = getEntries(rawColorPalette).reduce((acc, [colorName, colorValues]) => {
//             acc[colorName] = colorValues.map(color => toHslString(color))
//             return acc
//         }, init)
//     }

//     const toString = space === 'oklch' ? toOklchString : toHslString

//     function _getColor(color: keyof PaletteColors, index: number, alpha?: number) {
//         return toString(rawColorPalette[color][index], alpha)
//     }

//     function _colorResolver(color: keyof PaletteColors, defaultAlpha?: number) {
//         return (index = 6, alpha = defaultAlpha) => _getColor(color, index, alpha)
//     }

//     const colorSchemes = {
//         accent: _colorResolver(themeColors.accent),
//         critical: _colorResolver(themeColors.critical),
//         default: _colorResolver(themeColors.default),
//         neutral: _colorResolver(themeColors.neutral),
//         primary: _colorResolver(themeColors.primary),
//         positive: _colorResolver(themeColors.positive),
//         warning: _colorResolver(themeColors.warning),
//     }

//     return {
//         palette,
//         colorSchemes,
//         toString,
//     }
// }
