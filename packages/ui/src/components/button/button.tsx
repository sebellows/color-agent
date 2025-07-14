import * as React from 'react'
import { Pressable, PressableProps, StyleProp, TextStyle, TouchableOpacity } from 'react-native'
import {
    backgroundColor,
    BackgroundColorProps,
    border,
    BorderProps,
    composeRestyleFunctions,
    createRestyleComponent,
    createVariant,
    layout,
    LayoutProps,
    opacity,
    OpacityProps,
    ResponsiveValue,
    spacing,
    SpacingProps,
    typography,
    TypographyProps,
    useRestyle,
    VariantProps,
    visible,
    VisibleProps,
} from '@shopify/restyle'

import { ThemeColorScheme, appendColorSchemes, whenColorScheme } from '@ui/theme/color-palette'
import { Theme } from '../../../scripts'

import { Text } from '../text/text'

type RestyleProps = SpacingProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    LayoutProps<Theme> &
    OpacityProps<Theme> &
    TypographyProps<Theme> &
    VisibleProps<Theme>

export type Props = RestyleProps & React.PropsWithChildren<PressableProps>

const buttonRestyleFunctions = [
    spacing,
    border,
    backgroundColor,
    layout,
    opacity,
    typography,
    visible,
]

const composedRestyleFunction = composeRestyleFunctions<Theme, Props>(buttonRestyleFunctions)

const buttonStates = appendColorSchemes({
    link: 'violet',
})

const buttonStyleTypes = {
    default: true,
    ghost: true,
    outline: true,
}

type ButtonStates = typeof buttonStates
type ButtonState = keyof ButtonStates

export function getButtonTextColor(buttonState: ButtonState) {
    return whenColorScheme<
        ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']>,
        ButtonStates
    >(buttonState, {
        accent: 'accent.fg-primary',
        critical: 'critical.fg-primary',
        default: 'base.fg-primary',
        link: 'accent.fg-primary',
        neutral: 'base.fg-subtle',
        secondary: 'secondary.fg-primary',
        positive: 'positive.fg-primary',
        warning: 'warning.fg-primary',
    })
}

function _resolveBg(
    color: ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']> | undefined,
    buttonType?: keyof typeof buttonStyleTypes,
) {
    if (buttonType === 'ghost') {
        return undefined
    }
    if (buttonType === 'outline') {
        return 'transparent'
    }
    return color
}

export function getButtonBackgroundColor(
    buttonState: ButtonState,
    buttonType?: keyof typeof buttonStyleTypes,
) {
    return whenColorScheme<
        ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']> | undefined,
        ButtonStates
    >(buttonState, {
        accent: _resolveBg('accent.bg-primary', buttonType),
        secondary: _resolveBg('secondary.bg-primary', buttonType),
        critical: _resolveBg('critical.bg-primary', buttonType),
        default: _resolveBg('base.bg-primary', buttonType),
        link: _resolveBg('accent.bg-primary', buttonType),
        neutral: _resolveBg('base.bg-subtle', buttonType),
        positive: _resolveBg('positive.bg-primary', buttonType),
        warning: _resolveBg('warning.bg-primary', buttonType),
    })
}

function _resolveBorder(
    color: ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']>,
    buttonType?: keyof typeof buttonStyleTypes,
) {
    if (buttonType === 'outline') {
        return color
    }
    return undefined
}

export function getButtonBorderColor(
    buttonState: ButtonState,
    buttonType?: keyof typeof buttonStyleTypes,
) {
    return whenColorScheme<
        ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']> | undefined,
        ButtonStates
    >(buttonState, {
        secondary: _resolveBorder('secondary.bg-primary', buttonType),
        critical: _resolveBorder('critical.bg-primary', buttonType),
        default: _resolveBorder('base.bg-primary', buttonType),
        link: _resolveBorder('accent.bg-primary', buttonType),
        neutral: _resolveBorder('base.bg-subtle', buttonType),
        accent: _resolveBorder('accent.bg-primary', buttonType),
        positive: _resolveBorder('positive.bg-primary', buttonType),
        warning: _resolveBorder('warning.bg-primary', buttonType),
    })
}

export type ButtonProps = {
    label?: string
    buttonState?: ThemeColorScheme
    buttonType?: keyof typeof buttonStyleTypes
    icon?: React.ReactNode
    textStyle?: StyleProp<TextStyle>
    textVariant?: VariantProps<Theme, 'textVariants'>['variant']
} & Props

export const Button = React.forwardRef(
    (
        {
            label,
            buttonState = 'default',
            buttonType = 'default',
            icon,
            textStyle,
            textVariant = 'label01',
            ...rest
        }: ButtonProps,
        ref: any,
    ) => {
        const props = useRestyle(composedRestyleFunction, rest)
        const bg = getButtonBackgroundColor(buttonState, buttonType)
        const textColor = getButtonTextColor(buttonState)
        const borderColor = getButtonBorderColor(buttonState, buttonType)
        const borderWidth = buttonType === 'outline' ? 1 : 0
        const hasGap = !!icon && !!label

        return (
            <Pressable
                ref={ref}
                backgroundColor={bg}
                padding="3"
                borderRadius="sm"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                borderColor={borderColor}
                borderWidth={borderWidth}
                gap={hasGap ? '2' : undefined}
                {...props}
            >
                {icon}
                {label ?
                    <Text variant={textVariant} color={textColor} style={textStyle}>
                        {label}
                    </Text>
                :   null}
            </Pressable>
        )
    },
)

Button.displayName = 'Button'

export const ButtonVariant = createRestyleComponent<
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
