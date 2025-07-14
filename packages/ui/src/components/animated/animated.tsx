import { ReactNode } from 'react'
import { PressableProps, Animated as RNAnimated } from 'react-native'
import {
    createRestyleComponent,
    backgroundColor,
    layout,
    border,
    spacing,
    opacity,
    color,
    createVariant,
    OpacityProps,
    spacingShorthand,
    textShadow,
    typography,
    shadow,
} from '@shopify/restyle'
import { Theme } from '../../../scripts'
import { TextProps } from '@ui/components/text/text'
import { overflow, OverlayColorProps, ObjectFitProps, ResizeModeProps } from '@ui/restyleFunctions'
import { type BoxProps } from '../box'

export type AnimationProps = {
    children?: ReactNode
    entering?: unknown
    style?: any
}

export type AnimationBoxProps = BoxProps & AnimationProps

const Box = createRestyleComponent<AnimationBoxProps, Theme>(
    [backgroundColor, layout, border, spacing, opacity],
    RNAnimated.View,
)

export type AnimationTextProps = TextProps & AnimationProps

const Text = createRestyleComponent<AnimationTextProps, Theme>(
    [
        color,
        opacity,
        typography,
        spacing,
        spacingShorthand,
        textShadow,
        layout,
        createVariant({ themeKey: 'textVariants' }),
    ],
    RNAnimated.Text,
)

export type AnimationImageProps = BoxProps &
    PressableProps &
    AnimationProps &
    OverlayColorProps<Theme> &
    ObjectFitProps<Theme> &
    OpacityProps<Theme> &
    ResizeModeProps<Theme>

const Image = createRestyleComponent<AnimationBoxProps, Theme>(
    [backgroundColor, border, layout, opacity, overflow, shadow, spacing, spacingShorthand],
    RNAnimated.Image,
)

export const Animated = {
    Box,
    Text,
    Image,
}
