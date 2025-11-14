import { get, isNumber } from 'es-toolkit/compat'
import { StyleSheet } from 'react-native-unistyles'
import { Get } from 'type-fest'

import { Config } from '../config'
import { breakpoints } from '../design-system/design-tokens/breakpoints'
import { colors } from '../design-system/design-tokens/colors.native'
import { containers } from '../design-system/design-tokens/containers'
import { radii } from '../design-system/design-tokens/radii'
import { boxShadows, shadows } from '../design-system/design-tokens/shadows'
import { sizes, SizeToken } from '../design-system/design-tokens/sizes'
import { spacing, SpacingToken } from '../design-system/design-tokens/spacing'
import { TypographyToken } from '../design-system/design-tokens/typography-token'
import { typography as _typography } from '../design-system/design-tokens/typography.native'
import {
    getFonts,
    getFontSizes,
    getFontWeights,
    getLetterSpacings,
    getLineHeights,
    getShadows,
    getShadowStyles,
    TypographyDefinitions,
} from '../design-system/design-tokens/utils'
import { zIndices } from '../design-system/design-tokens/z-indices'
import { KeyPathOf } from '../types/common'
import { absoluteFill, flexCenter } from './theme.utils'

const typography = _typography as TypographyDefinitions
const { light, dark, ...colorSchemes } = colors

const themeCommon = {
    boxShadows: getShadowStyles(boxShadows),
    containers,
    fonts: getFonts(typography),
    fontSizes: getFontSizes(typography),
    fontStyle: {
        normal: 'normal',
        italic: 'italic',
    },
    fontWeights: getFontWeights(typography),
    letterSpacings: getLetterSpacings(typography),
    lineHeights: getLineHeights(typography),
    radii,
    typography,
    shadows: getShadows(shadows),
    sizes,
    space: spacing,
    zIndices,
    gap: (value: number | SpacingToken) =>
        isNumber(value) ? value * Config.get('theme.SPACING_UNIT')
        : value === 'auto' ? 0
        : spacing[value],
    utils: {
        absoluteFill,
        flexCenter,
        getColor: <Token extends KeyPathOf<typeof colors>>(
            token: Token,
        ): Get<typeof colors, Token> => {
            const color = get(colors, token)
            if (color) return color as Get<typeof colors, Token>
            throw new Error(`Color token "${token}" not found in theme colors.`)
        },
        getSize: (token: SizeToken) => {
            const sizeIndex = sizes.findIndex(sz => sz === token)
            if (sizeIndex !== -1) {
                return { width: sizes[sizeIndex], height: sizes[sizeIndex] }
            }
            throw new Error(`There is no size option of ${token} configured in the theme.`)
        },
        getTypography: (token: TypographyToken) => {
            const typo = get(typography, token)
            if (typo) return typo
            throw new Error(`Typography token "${token}" not found in theme typography.`)
        },
    },
}

const lightColors = Object.assign({}, light, colorSchemes)
const darkColors = Object.assign({}, dark, colorSchemes)

const lightTheme = {
    colors: lightColors,
    ...themeCommon,
}

const darkTheme = {
    colors: darkColors,
    ...themeCommon,
}

const appThemes = {
    light: lightTheme,
    dark: darkTheme,
}

export type AppThemes = typeof appThemes
export type AppBreakpoints = typeof breakpoints
export type Theme = AppThemes[keyof AppThemes]

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes {}
    export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
    themes: appThemes,
    breakpoints,
    settings: {
        initialTheme: 'light',
    },
})
