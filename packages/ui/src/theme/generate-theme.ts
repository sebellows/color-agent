import { createTheme } from '@shopify/restyle'
import { ColorSchemeName, StyleSheet } from 'react-native'

import {
    breakpoints,
    getSizeVariants,
    getSpacingVariants,
    getTextVariants,
    getThemeColors,
    zIndices,
} from '@ui/tokens'
import { PlatformEnv } from '@ui/types'

export function generateTheme(colorScheme: ColorSchemeName) {
    const colorThemes = getThemeColors(PlatformEnv.mobile)

    return createTheme({
        colors: colorScheme === 'dark' ? colorThemes.dark : colorThemes.light,
        borderRadii: {
            xs: 2,
            sm: 4,
            md: 6,
            lg: 8,
            xl: 12,
            '2xl': 16,
            '3xl': 24,
            '4xl': 32,
            full: 1000,
        },
        spacing: getSpacingVariants(PlatformEnv.mobile),
        breakpoints,
        sizes: getSizeVariants(PlatformEnv.mobile),
        zIndices,
        buttonVariants: {
            defaults: {
                maxWidth: 200,
                borderRadius: 'md',
                paddingVertical: 'sm',
                paddingHorizontal: 'md',
                backgroundColor: 'cardBackground',
                color: 'cardForeground',
                textAlign: 'center',
            },
            accent: {
                color: 'accentForeground',
                backgroundColor: 'accentBackground',
            },
            secondary: {
                color: 'secondaryForeground',
                backgroundColor: 'secondaryBackground',
            },
            muted: {
                color: 'mutedForeground',
                backgroundColor: 'mutedBackground',
            },
            icon: {
                width: 'auto',
                padding: 'sm',
                borderRadius: 'full',
                aspectRatio: 1,
            },
        },
        textVariants: getTextVariants({ platform: PlatformEnv.mobile }),
        layoutVariants: {
            centered: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            absoluteFill: StyleSheet.absoluteFill,
        },
        cardVariants: {
            defaults: {
                backgroundColor: 'cardBackground',
                color: 'cardForeground',
            },
            cardHeader: {
                padding: 'md',
                flexDirection: 'row',
                columnGap: 'md',
                borderRadiusTopLeft: 'sm',
                borderRadiusTopRight: 'sm',
            },
            cardContent: {
                paddingHorizontal: 'md',
                paddingBottom: 'md',
                flexDirection: 'column',
                columnGap: 'md',
            },
            cardFooter: {
                paddingHorizontal: 'md',
                paddingBottom: 'md',
                flexDirection: 'row',
                columnGap: 'md',
                borderRadiusBottomLeft: 'sm',
                borderRadiusBottomRight: 'sm',
            },
            accent: {
                backgroundColor: 'accentBackground',
            },
            secondary: {
                backgroundColor: 'secondaryBackground',
            },
        },
    })
}
