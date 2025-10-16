import type { TextProps as RNTextProps } from 'react-native'

import { FastText } from '@ui/internal'
import { TypographyToken } from '@ui/theme/design-tokens/typography-token'
import { Color } from '@ui/theme/theme.types'
import { getColorVariants } from '@ui/theme/utils'
import { StyleSheet } from 'react-native-unistyles'

export type TextProps = RNTextProps & {
    variant?: TypographyToken
    align?: 'left' | 'right' | 'center'
    uppercase?: boolean
    color?: Color
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
            color: getColorVariants(theme),
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
