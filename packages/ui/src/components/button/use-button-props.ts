import * as React from 'react'

import {
    type AnchorOptions,
    AriaButtonProps,
    type ButtonType,
    isTrivialHref,
    UseButtonPropsMetadata,
} from './button.types'
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

export interface UseButtonPropsOptions extends AnchorOptions {
    type?: ButtonType
    disabled?: boolean
    onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>
    tabIndex?: number
    tagName?: keyof React.JSX.IntrinsicElements
    role?: React.AriaRole | undefined
}

export function useButtonProps({
    tagName,
    disabled,
    href,
    target,
    rel,
    role,
    onClick,
    tabIndex = 0,
    type,
}: UseButtonPropsOptions): [AriaButtonProps, UseButtonPropsMetadata] {
    const props = useRestyle(composedRestyleFunction, rest)
    const bg = getButtonBackgroundColor(buttonState, buttonType)
    const textColor = getButtonTextColor(buttonState)
    const borderColor = getButtonBorderColor(buttonState, buttonType)
    const borderWidth = buttonType === 'outline' ? 1 : 0
    const hasGap = !!icon && !!label

    if (!tagName) {
        if (href != null || target != null || rel != null) {
            tagName = 'a'
        } else {
            tagName = 'button'
        }
    }

    const meta: UseButtonPropsMetadata = { tagName }
    if (tagName === 'button') {
        return [{ type: (type as any) || 'button', disabled }, meta]
    }

    const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
        if (disabled || (tagName === 'a' && isTrivialHref(href))) {
            event.preventDefault()
        }

        if (disabled) {
            event.stopPropagation()
            return
        }

        onClick?.(event)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === ' ') {
            event.preventDefault()
            handleClick(event)
        }
    }

    if (tagName === 'a') {
        // Ensure there's a href so Enter can trigger anchor button.
        href ||= '#'
        if (disabled) {
            href = undefined
        }
    }

    return [
        {
            role: role ?? 'button',
            // explicitly undefined so that it overrides the props disabled in a spread
            // e.g. <Tag {...props} {...hookProps} />
            disabled: undefined,
            tabIndex: disabled ? undefined : tabIndex,
            href,
            target: tagName === 'a' ? target : undefined,
            'aria-disabled': !disabled ? undefined : disabled,
            rel: tagName === 'a' ? rel : undefined,
            onClick: handleClick,
            onKeyDown: handleKeyDown,
        },
        meta,
    ]
}

export interface BaseButtonProps {
    /**
     * Control the underlying rendered element directly by passing in a valid
     * component type
     */
    as?: keyof React.JSX.IntrinsicElements | undefined

    /** The disabled state of the button */
    disabled?: boolean | undefined

    /** Optionally specify an href to render a `<a>` tag styled as a button */
    href?: string | undefined

    /** Anchor target, when rendering an anchor as a button */
    target?: string | undefined

    rel?: string | undefined
}

export interface ButtonProps extends BaseButtonProps, React.ComponentPropsWithoutRef<'button'> {}
