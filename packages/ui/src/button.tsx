import * as React from 'react'
import { Pressable, PressableProps, TouchableOpacity } from 'react-native'
import {
    backgroundColor,
    BackgroundColorProps,
    border,
    BorderProps,
    createRestyleComponent,
    createVariant,
    layout,
    LayoutProps,
    spacing,
    SpacingProps,
    typography,
    TypographyProps,
    VariantProps,
} from '@shopify/restyle'
import { Theme } from './theme'

type RestyleProps = SpacingProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    LayoutProps<Theme> &
    TypographyProps<Theme>

export type ButtonProps = RestyleProps &
    PressableProps & {
        children?: React.ReactNode
    }

export const Button = createRestyleComponent<
    VariantProps<Theme, 'buttonVariants'> &
        ButtonProps &
        React.ComponentProps<typeof TouchableOpacity>,
    Theme
>(
    [
        createVariant({ themeKey: 'buttonVariants' }),
        spacing,
        border,
        backgroundColor,
        layout,
        typography,
    ],
    ({ disabled, style, ...props }) => (
        <Pressable disabled={disabled} style={[style, disabled && { opacity: 0.5 }]} {...props} />
    ),
)
