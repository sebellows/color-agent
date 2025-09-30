import { StyleSheet, ViewStyle } from 'react-native'

import { assertUnreachable } from '@coloragent/utils'

import { ActionState } from '../types'
import type { ThemeColorScheme } from './color-palette/types'

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
        accent: state === 'disabled' ? 'mutedForeground' : 'secondaryForeground',
        critical: state === 'disabled' ? 'mutedForeground' : 'negativeForeground',
        default: state === 'disabled' ? 'mutedForeground' : 'foreground',
        neutral: state === 'disabled' ? 'mutedForeground' : 'foreground',
        positive: state === 'disabled' ? 'mutedForeground' : 'positiveForeground',
        primary: state === 'disabled' ? 'mutedForeground' : 'accentForeground',
        warning: state === 'disabled' ? 'mutedForeground' : 'warningForeground',
    })
}
