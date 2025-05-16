import { createTheme } from '@shopify/restyle'
import { spacingStyles } from './styles/spacing'
import { default as palette } from './palette/hsla'
import { StyleSheet } from 'react-native'

const light = palette.neutral[0]
const dark = palette.neutral[12]

const theme = createTheme({
    colors: {
        background: light,
        foreground: dark,
        cardBackground: light,
        cardForeground: dark,
        popoverBackground: light,
        popoverForeground: dark,
        primaryBackground: palette.violet[6],
        primaryForeground: light,
        accentBackground: palette.orange[6],
        accentForeground: light,
        mutedBackground: palette.neutral[4],
        mutedForeground: palette.neutral[9],
        negativeBackground: palette.rose[6],
        negativeForeground: palette.rose[1],
        positiveBackground: palette.emerald[6],
        positiveForeground: palette.emerald[1],
        warningBackground: palette.amber[6],
        warningForeground: palette.emerald[1],
        border: palette.neutral[2],
        input: palette.neutral[2],
        ring: palette.neutral[3],
        title: dark,
        text: dark,
    },
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
    spacing: {
        ...spacingStyles,
        sm: spacingStyles['2'], // 8
        md: spacingStyles['4'], // 16
        lg: spacingStyles['6'], // 24
        xl: spacingStyles['8'], // 32
    },
    breakpoints: {
        xs: 0,
        sm: 640, // small devices/large phones
        md: 768, // baseline tablet
        lg: 1024, // horizontal tablet screns, most laptops, etc.
        xl: 1280, // large displays (desktop monitors)
        hd: 1920, // full HD monitors start at 1920x1080
        // Aliased by device for RN
        phone: 0,
        tablet: 768,
        desktop: 1280,
    },
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
        primary: {
            color: 'primaryForeground',
            backgroundColor: 'primaryBackground',
        },
        accent: {
            color: 'accentForeground',
            backgroundColor: 'accentBackground',
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
    textVariants: {
        defaults: {
            color: 'text',
        },
        header: {
            fontSize: 32,
            fontWeight: 'bold',
            lineHeight: 40,
            color: 'title',
        },
        subheader: {
            fontSize: 24,
            fontWeight: 'bold',
            lineHeight: 32,
            color: 'title',
        },
        cardTitle: {
            fontSize: 20,
            fontWeight: 'semibold',
            lineHeight: 28,
            color: 'title',
        },
        body: {
            fontSize: 16,
            fontWeight: 'regular',
            lineHeight: 24,
        },
        detail: {
            fontSize: 14,
            fontWeight: 'regular',
            lineHeight: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: 'regular',
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: 'medium',
            lineHeight: 16,
            color: 'mutedForeground',
        },
    },
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
        primary: {
            backgroundColor: 'primaryBackground',
        },
        secondary: {
            backgroundColor: 'accentBackground',
        },
    },
})

type Theme = typeof theme

const darkTheme: Theme = {
    ...theme,
    colors: {
        background: dark,
        foreground: light,
        cardBackground: dark,
        cardForeground: light,
        popoverBackground: dark,
        popoverForeground: light,
        primaryBackground: palette.violet[6],
        primaryForeground: dark,
        accentBackground: palette.orange[6],
        accentForeground: dark,
        mutedBackground: palette.neutral[4],
        mutedForeground: palette.neutral[9],
        negativeBackground: palette.rose[6],
        negativeForeground: palette.rose[1],
        positiveBackground: palette.emerald[6],
        positiveForeground: palette.emerald[1],
        warningBackground: palette.amber[6],
        warningForeground: palette.emerald[1],
        border: palette.neutral[2],
        input: palette.neutral[2],
        ring: palette.neutral[3],
        title: light,
        text: light,
    },
}

export { theme, darkTheme, type Theme }
