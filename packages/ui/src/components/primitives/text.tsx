import { createElement, forwardRef, type ComponentType } from 'react'
import type { TextProps as RNTextProps } from 'react-native'

import { getKeys } from '@coloragent/utils'
import { FastText } from '@ui/internal'
import type { Color, TypographyToken } from '@ui/theme'
import { typography } from '@ui/theme/utils'
import { getEntries } from '@ui/utils/get-entries'
import { StyleSheet } from 'react-native-unistyles'

type TextProps = RNTextProps & {
    variant?: TypographyToken
    align?: 'left' | 'right' | 'center'
    uppercase?: boolean
    color?: Color
    children: React.ReactNode
}

export function Text({
    variant = 'body',
    align = 'left',
    uppercase = false,
    color,
    children,
    style,
    ...props
}: TextProps) {
    styles.useVariants({
        align,
        uppercase,
        color: color as string,
        variant,
    })

    return (
        <FastText style={[styles.text, style]} {...props}>
            {children}
        </FastText>
    )
}

const styles = StyleSheet.create(theme => ({
    text: {
        variants: {
            variant: theme.typography,
            color: Object.fromEntries(
                getEntries(theme.colors).map(([key, _value]) => [
                    key,
                    { color: theme.utils.getColor(key) },
                ]),
            ),
            align: {
                left: { textAlign: 'left' },
                right: { textAlign: 'right' },
                center: { textAlign: 'center' },
            },
            uppercase: {
                true: { textTransform: 'uppercase' },
                false: { textTransform: 'none' },
            },
        },
    },
}))
