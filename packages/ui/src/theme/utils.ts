import { StyleSheet, ViewStyle } from 'react-native'

import { assertUnreachable } from '@coloragent/utils'
import { ActionState, KeyPathOf } from '@ui/types'
import { getEntries } from '@ui/utils/get-entries'
import { isError, upperFirst } from 'es-toolkit'
import { get } from 'es-toolkit/compat'

import type { ThemeColorScheme } from './color-palette/types'
import colors, { ColorScheme } from './design-tokens/colors.native'
import { ShadowsToken } from './design-tokens/shadows'
import { NegativeSpacingToken, SpacingToken } from './design-tokens/spacing'
import { TypographyToken } from './design-tokens/typography-token'
import { default as typographyTokens } from './design-tokens/typography.native'
import { TypographyDefinition } from './design-tokens/utils'
import { Theme } from './theme'
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

            return assertUnreachable(scheme) as never
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

export function getColorVariants(theme: Theme) {
    try {
        return Object.fromEntries(
            getEntries(theme.colors).map(([key, _value]) => {
                const color = get(theme.colors, key) as string
                return [key, { color }]
            }),
        )
    } catch (err) {
        const msg = isError(err) ? err.message : ''
        throw new Error("There was an error parsing the theme's color variants. " + msg)
    }
}

export function getColorSchemeVariants(token: string | ColorScheme | KeyPathOf<typeof colors>) {
    if (isColorScheme(token)) {
        return get(colors, token)
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

type Direction = 'top' | 'right' | 'bottom' | 'left'

export function getPosition(
    theme: UnistylesTheme,
    variant: SpacingToken | NegativeSpacingToken,
    ...dirs: Direction[]
) {
    const space = theme.space[variant]
    const value = variant.startsWith('-') ? -space : space

    if (dirs.length === 1) {
        return { [dirs[0]]: value }
    }

    return dirs.reduce(
        (acc, dir) => {
            acc[dir] = value
            return acc
        },
        {} as Record<Direction, number>,
    )
}

type SpacingDirection = 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end'

export function getMargin(
    theme: UnistylesTheme,
    variant: SpacingToken | NegativeSpacingToken,
    ...dirs: SpacingDirection[]
) {
    const space = theme.space[variant]
    const value = variant.startsWith('-') ? -space : space

    if (!dirs.length) {
        return { margin: value }
    }

    if (dirs.length === 1) {
        return { [`margin${upperFirst(dirs[0])}`]: value }
    }

    return dirs.reduce(
        (acc, dir) => {
            acc[`margin${upperFirst(dir)}`] = value
            return acc
        },
        {} as Record<Direction, number>,
    )
}

export function getPadding(
    theme: UnistylesTheme,
    variant: SpacingToken,
    ...dirs: SpacingDirection[]
) {
    const value = theme.space[variant]

    if (!dirs.length) {
        return { padding: value }
    }

    if (dirs.length === 1) {
        return { [`padding${upperFirst(dirs[0])}`]: value }
    }

    return dirs.reduce(
        (acc, dir) => {
            acc[`padding${upperFirst(dir)}`] = value
            return acc
        },
        {} as Record<Direction, number>,
    )
}
