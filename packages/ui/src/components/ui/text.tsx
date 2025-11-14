import * as React from 'react'
import { Text as RNText, TextStyle } from 'react-native'

import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { getColorVariants, typography } from '../../design-system/design-system.utils'
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
    variant = 'body',
    style,
    ...props
}: TextProps) => {
    const { variant: ctxVariant, ...styleContext } = React.useContext(TextStyleContext) ?? {}
    const { theme } = useUnistyles()

    styles.useVariants({
        align,
        uppercase,
        color,
        variant,
    })

    const textStyles = typography(theme, ctxVariant ?? variant)

    const Component = asChild ? Slot.Text : RNText

    return <Component ref={ref} style={[styles.text, styleContext, textStyles, style]} {...props} />
}

Text.displayName = 'Text'

const styles = StyleSheet.create(theme => ({
    text: {
        variants: {
            variant: Object.fromEntries(
                Object.keys(theme.typography).map(key => [
                    key,
                    typography(theme, key as TypographyToken),
                ]),
            ),
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
