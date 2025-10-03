import { getKeys } from '@coloragent/utils'
import { get } from 'es-toolkit/compat'
import { StyleSheet } from 'react-native-unistyles'

import { Config } from '../config'
import { KeyPathOf } from '../types'
import {
    getFonts,
    getFontSizes,
    getFontWeights,
    getLetterSpacings,
    getLineHeights,
    getShadows,
    TypographyDefinition,
    TypographyDefinitions,
} from './design-tokens'
import breakpoints from './design-tokens/breakpoints'
import colors from './design-tokens/colors'
import radii from './design-tokens/radii'
import shadows from './design-tokens/shadows'
import sizes from './design-tokens/sizes'
import space from './design-tokens/spacing'
import { default as _typography, TypographyToken } from './design-tokens/typography'
import zIndices from './design-tokens/z-indices'
import { absoluteFill, flexCenter } from './utils'

const typography = _typography as TypographyDefinitions
const { light, dark, ...colorSchemes } = colors

const themeCommon = {
    radii,
    space,
    typography,
    fonts: getFonts(typography),
    fontSizes: getFontSizes(typography),
    fontWeights: getFontWeights(typography),
    letterSpacings: getLetterSpacings(typography),
    lineHeights: getLineHeights(typography),
    shadows: getShadows(shadows),
    sizes,
    zIndices,
    gap: (value: number) => value * Config.get('theme.SPACING_UNIT'),
    utils: {
        absoluteFill,
        flexCenter,
        getColor: (token: KeyPathOf<typeof colors>) => {
            const color = get(colors, token)
            if (color) return color
            throw new Error(`Color token "${token}" not found in theme colors.`)
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

// export function generateTheme(colorScheme: ColorSchemeName) {
//     const colorThemes = getThemeColors(PlatformEnv.mobile)

//     return createTheme({
//         colors: colorScheme === 'dark' ? colorThemes.dark : colorThemes.light,
//         rounded: {
//             xs: 2,
//             sm: 4,
//             md: 6,
//             lg: 8,
//             xl: 12,
//             '2xl': 16,
//             '3xl': 24,
//             '4xl': 32,
//             full: 1000,
//         },
//         spacing: getSpacingVariants(PlatformEnv.mobile),
//         breakpoints,
//         sizes: getSizeVariants(PlatformEnv.mobile),
//         transitions: transitions,
//         zIndices,
//         buttonVariants: {
//             defaults: {
//                 maxWidth: 200,
//                 borderRadius: 'md',
//                 paddingVertical: 'sm',
//                 paddingHorizontal: 'md',
//                 backgroundColor: 'cardBackground',
//                 color: 'cardForeground',
//                 textAlign: 'center',
//             },
//             accent: {
//                 color: 'accentForeground',
//                 backgroundColor: 'accentBackground',
//             },
//             secondary: {
//                 color: 'secondaryForeground',
//                 backgroundColor: 'secondaryBackground',
//             },
//             muted: {
//                 color: 'mutedForeground',
//                 backgroundColor: 'mutedBackground',
//             },
//             icon: {
//                 width: 'auto',
//                 padding: 'sm',
//                 borderRadius: 'full',
//                 aspectRatio: 1,
//             },
//         },
//         textVariants: getTextVariants({ platform: PlatformEnv.mobile }),
//         layoutVariants: {
//             centered: {
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             },
//             absoluteFill: StyleSheet.absoluteFill,
//         },
//         cardVariants: {
//             defaults: {
//                 backgroundColor: 'cardBackground',
//                 color: 'cardForeground',
//             },
//             cardHeader: {
//                 padding: 'md',
//                 flexDirection: 'row',
//                 columnGap: 'md',
//                 borderRadiusTopLeft: 'sm',
//                 borderRadiusTopRight: 'sm',
//             },
//             cardContent: {
//                 paddingHorizontal: 'md',
//                 paddingBottom: 'md',
//                 flexDirection: 'column',
//                 columnGap: 'md',
//             },
//             cardFooter: {
//                 paddingHorizontal: 'md',
//                 paddingBottom: 'md',
//                 flexDirection: 'row',
//                 columnGap: 'md',
//                 borderRadiusBottomLeft: 'sm',
//                 borderRadiusBottomRight: 'sm',
//             },
//             accent: {
//                 backgroundColor: 'accentBackground',
//             },
//             secondary: {
//                 backgroundColor: 'secondaryBackground',
//             },
//         },
//     })
// }
