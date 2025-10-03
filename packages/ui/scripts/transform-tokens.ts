// import fs from 'fs'
// import path from 'path'
// import {
//     BorderToken,
//     GradientToken,
//     PureToken,
//     ReferenceValue,
//     ShadowToken,
//     StrictToken,
//     StrokeStyleToken,
//     Token,
//     TokenCompositeValue,
//     TokenType,
//     TokenValue,
//     TransitionToken,
//     TypographyToken,
// } from './types'
// import { isReference, unwrapReference } from './token.utils'

// export const PALETTE_COLOR_NAMES: Record<string, string> = {}

// export const THEME_COLOR_SCHEMES: Record<string, string> = {}

// function useColorPalette<TColorSchemes extends CustomColorSchemes = {}>(
//     space: 'hsl' | 'oklch',
//     themeColors: ThemeColorSchemes<TColorSchemes>,
// ) {
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
//         secondary: _colorResolver(themeColors.secondary),
//         critical: _colorResolver(themeColors.critical),
//         default: _colorResolver(themeColors.default),
//         neutral: _colorResolver(themeColors.neutral),
//         accent: _colorResolver(themeColors.accent),
//         positive: _colorResolver(themeColors.positive),
//         warning: _colorResolver(themeColors.warning),
//     }

//     return {
//         palette,
//         colorSchemes,
//         toString,
//     }
// }
