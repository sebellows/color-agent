import * as React from 'react'
import { Text, useColorScheme, View } from 'react-native'

import { AnyRecord } from '@coloragent/utils'
import { StyleSheet } from 'react-native-unistyles'

import {
    getBorderRadii,
    getBoxShadows,
    getColorSchemeProp,
    getColorSchemeVariant,
    typography,
} from '../../design-system/design-system.utils'
import { ColorScheme } from '../../design-system/design-tokens/colors.native'
import { radii, RadiiToken } from '../../design-system/design-tokens/radii'
import { ShadowToken } from '../../design-system/design-tokens/shadows'
import { RNText, RNView } from '../../types'
import { TextStyleContext } from './text'

type CardProps = React.ComponentPropsWithRef<RNView> & {
    borderRadius?: RadiiToken
    shadow?: ShadowToken
    variant?: ColorScheme
    dark?: boolean
    border?: boolean
}

const Card = ({ ref, border, borderRadius, dark, shadow, variant, style, ...props }: CardProps) => {
    const isDark = dark ?? useColorScheme() === 'dark'

    styles.useVariants({
        borderRadius: borderRadius as keyof Omit<typeof radii, 'default'>,
        shadow,
        variant,
    })

    // @ts-expect-error TS warning of "excessively deep" for `styles.card`
    return <View ref={ref} style={[styles.card({ border, isDark }), style]} {...props} />
}
Card.displayName = 'Card'

const CardHeader = ({ ref, style, ...props }: React.ComponentPropsWithRef<RNView>) => (
    <View ref={ref} style={[styles.header, style]} {...props} />
)
CardHeader.displayName = 'CardHeader'

const CardTitle = ({ ref, style, ...props }: React.ComponentPropsWithRef<RNText>) => (
    <Text role="heading" aria-level={3} ref={ref} style={[styles.title, style]} {...props} />
)
CardTitle.displayName = 'CardTitle'

const CardDescription = ({ ref, style, ...props }: React.ComponentPropsWithRef<RNText>) => (
    <Text ref={ref} style={[styles.description, style]} {...props} />
)
CardDescription.displayName = 'CardDescription'

const CardContent = ({ ref, style, ...props }: React.ComponentPropsWithRef<RNView>) => (
    <TextStyleContext.Provider value={styles.contentText}>
        <View ref={ref} style={[styles.content, style]} {...props} />
    </TextStyleContext.Provider>
)
CardContent.displayName = 'CardContent'

const CardFooter = ({ ref, style, ...props }: React.ComponentPropsWithRef<RNView>) => (
    <View ref={ref} style={[styles.footer, style]} {...props} />
)
CardFooter.displayName = 'CardFooter'

const styles = StyleSheet.create(theme => ({
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.space.lg,
        paddingTop: 0,
        _web: {
            display: 'flex',
        },
    },
    content: {
        padding: theme.space.lg,
        paddingTop: 0,
    },
    contentText: {
        color: theme.colors.fg,
        ...typography(theme, 'bodySmall'),
    },
    description: {
        color: theme.colors.fgMuted,
        ...typography(theme, 'bodySmall'),
    },
    title: {
        color: theme.colors.fg,
        ...typography(theme, 'cardTitle'),
    },
    header: {
        flexDirection: 'column',
        padding: theme.space.lg,
        _web: {
            display: 'flex',
        },
    },
    card: ({ border, isDark = false }) => ({
        borderWidth: border ? 1 : 0,
        variants: {
            variant: {
                accent: {
                    backgroundColor: getColorSchemeVariant(`accent.bg`),
                    borderColor: getColorSchemeVariant(`accent.line2`),
                    color: getColorSchemeVariant(`accent.fg`),
                },
                critical: {
                    backgroundColor: getColorSchemeVariant(`critical.bg`),
                    borderColor: getColorSchemeVariant(`critical.line2`),
                    color: getColorSchemeVariant(`critical.fg`),
                },
                default: {
                    backgroundColor: getColorSchemeProp(isDark, 'bg'),
                    borderColor: border ? getColorSchemeProp(isDark, 'line2') : 'transparent',
                    color: getColorSchemeProp(isDark, 'fg'),
                },
                neutral: {
                    backgroundColor: getColorSchemeVariant(`neutral.bg`),
                    borderColor: getColorSchemeVariant(`neutral.line2`),
                    color: getColorSchemeVariant(`neutral.fg`),
                },
                positive: {
                    backgroundColor: getColorSchemeVariant(`positive.bg`),
                    borderColor: getColorSchemeVariant(`positive.line2`),
                    color: getColorSchemeVariant(`positive.fg`),
                },
                primary: {
                    backgroundColor: getColorSchemeVariant(`primary.bg`),
                    borderColor: getColorSchemeVariant(`primary.line2`),
                    color: getColorSchemeVariant(`primary.fg`),
                },
                warning: {
                    backgroundColor: getColorSchemeVariant(`warning.bg`),
                    borderColor: getColorSchemeVariant(`warning.line2`),
                    color: getColorSchemeVariant(`warning.fg`),
                },
            },
            borderRadius: getBorderRadii(),
            // Forced to do this because Unistyles does not recognize that a string can
            // be used as a boxShadow value in the new architecture.
            shadow: getBoxShadows() as AnyRecord,
        },
    }),
}))

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
