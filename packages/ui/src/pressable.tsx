import * as React from 'react'
import { Pressable as RNPressable, PressableProps as RNPressableProps } from 'react-native'
import { Theme } from './theme'
import {
    backgroundColor,
    BackgroundColorProps,
    border,
    BorderProps,
    composeRestyleFunctions,
    layout,
    LayoutProps,
    spacing,
    SpacingProps,
    typography,
    TypographyProps,
    useRestyle,
} from '@shopify/restyle'

type RestyleProps = SpacingProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    LayoutProps<Theme> &
    TypographyProps<Theme>

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
    spacing,
    border,
    backgroundColor,
    layout,
    typography,
])

export type PressableProps = RestyleProps &
    RNPressableProps & {
        children?: React.ReactNode
    }

export function Pressable({ children, onPress, onPressIn, onPressOut, ...rest }: PressableProps) {
    const props = useRestyle(restyleFunctions, rest)

    return (
        <RNPressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} {...props} />
    )
}
