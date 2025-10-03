import { StyleSheet, ViewStyle } from 'react-native'

import { assertUnreachable } from '@coloragent/utils'

import { ActionState, KeyPathOf } from '../types'
import type { ThemeColorScheme } from './color-palette/types'
import { ColorScheme, TypographyDefinition } from './design-tokens'
import colors from './design-tokens/colors'
import { ShadowsToken } from './design-tokens/shadows'
import { default as typographyTokens, type TypographyToken } from './design-tokens/typography'
import { UnistylesTheme } from './theme.types'

type FlexCenter = Required<Pick<ViewStyle, 'flexDirection' | 'justifyContent' | 'alignItems'>>
export const flexCenter: FlexCenter = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
}

export const absoluteFill = StyleSheet.absoluteFillObject

export function resolveComponentColorScheme<T>(
    scheme: ThemeColorScheme,
    match: Record<ThemeColorScheme, T>,
): T {
    switch (scheme) {
        case 'accent':
            return match.accent
        case 'default':
            return match.default
        case 'critical':
            return match.critical
        case 'neutral':
            return match.neutral
        case 'positive':
            return match.positive
        case 'primary':
            return match.primary
        case 'warning':
            return match.warning
        default:
            if (scheme in match) {
                return match[scheme as keyof typeof match]
            }
            assertUnreachable(scheme)
    }
}

export function resolveTextColor(scheme: ThemeColorScheme, state: ActionState = 'default') {
    return resolveComponentColorScheme(scheme, {
        accent: state === 'disabled' ? 'accent.fgMuted' : 'accent.fg',
        critical: state === 'disabled' ? 'critical.fgMuted' : 'critical.fg',
        default: state === 'disabled' ? 'fgMuted' : 'fg',
        neutral: state === 'disabled' ? 'neutral.fgMuted' : 'neutral.fg',
        positive: state === 'disabled' ? 'positive.fgMuted' : 'positive.fg',
        primary: state === 'disabled' ? 'primary.fgMuted' : 'primary.fg',
        warning: state === 'disabled' ? 'warning.fgMuted' : 'warning.fg',
    })
}

export const colorSchemeNames: ColorScheme[] = Object.keys(colors).filter(
    key => !['light', 'dark'].includes(key),
) as ColorScheme[]

export function isColorScheme(
    token: string | ColorScheme | KeyPathOf<typeof colors>,
): token is ColorScheme {
    return colorSchemeNames.includes(token as ColorScheme)
}

export function getColorSchemeVariants(token: string | ColorScheme | KeyPathOf<typeof colors>) {
    if (isColorScheme(token)) {
        return colors[token]
    }
    throw new Error(`Color scheme "${token}" is not a valid color scheme.`)
}

export const typography = (theme: UnistylesTheme, variant: TypographyToken) => {
    const { textTransform } = typographyTokens[variant]

    return {
        fontFamily: theme.fonts[variant],
        fontSize: theme.fontSizes[variant],
        fontWeight: theme.fontWeights[variant],
        letterSpacing: theme.letterSpacings[variant],
        lineHeight: theme.lineHeights[variant],
        textTransform,
    } as TypographyDefinition
}

export function getShadow(theme: UnistylesTheme, variant: ShadowsToken) {
    return [theme.shadows[variant]]
}
