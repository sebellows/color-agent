import * as React from 'react'
import { Text as RNText, TextStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { getColorVariants, getTypographyVariants } from '../../design-system/design-system.utils'
import { TypographyToken } from '../../design-system/design-tokens/typography-token'
import { Color } from '../../theme/theme.types'
import { Slot } from '../primitives/slot'
import type { SlottableTextProps } from '../primitives/types'

type TextStyleProps = {
    color?: Color
    variant?: TypographyToken
    align?: 'left' | 'center' | 'right'
    fontStyle?: 'italic' | 'normal'
    uppercase?: boolean
}

type TextProps = SlottableTextProps & TextStyleProps

const TextStyleContext = React.createContext<
    (TextStyle & Pick<TextStyleProps, 'color' | 'variant'>) | undefined
>(undefined)

const Text = ({
    ref,
    asChild = false,
    align = 'left',
    uppercase = false,
    color = 'fg',
    fontStyle,
    variant = 'body',
    style,
    ...props
}: TextProps) => {
    const { variant: ctxVariant, ...styleContext } = React.useContext(TextStyleContext) ?? {}

    styles.useVariants({
        align,
        uppercase,
        color,
        fontStyle,
        variant,
    })

    // const textStyles = typography(theme, ctxVariant ?? variant)

    const Component = asChild ? Slot.Text : RNText

    return <Component ref={ref} style={[styles.text, styleContext, style]} {...props} />
}

Text.displayName = 'Text'

const styles = StyleSheet.create(theme => ({
    text: {
        variants: {
            variant: getTypographyVariants(theme),
            color: getColorVariants(theme),
            fontStyle: {
                normal: { fontStyle: 'normal' },
                italic: { fontStyle: 'italic' },
            },
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

export { Text, TextStyleContext }
