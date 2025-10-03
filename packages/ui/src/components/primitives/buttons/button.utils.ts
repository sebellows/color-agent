import { type StyleProp, type ViewStyle } from 'react-native'

import { getColorSchemeVariants, type Color, type Theme } from '@ui/theme'

import { type ButtonProps, type ButtonSize, type IconButtonProps } from './button.types'

/** Get the base style for a button or icon button */
const getBaseStyle = ({
    theme,
    variant = 'filled',
    color = 'primary',
    disabled = false,
}: Pick<ButtonProps, 'variant' | 'color' | 'disabled'> & {
    theme: Theme
}): ViewStyle => {
    const baseStyle: ViewStyle = {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 1,
    }

    if (disabled) {
        switch (variant) {
            case 'filled':
                baseStyle.backgroundColor = theme.colors.bgMuted
                break
            case 'soft':
                baseStyle.backgroundColor = theme.colors.bgSubtle
                break
            case 'outlined':
                baseStyle.backgroundColor = theme.colors.bg
                baseStyle.borderColor = theme.colors.line2
                break
            case 'plain':
                // baseStyle remains as is
                break

            default:
                break
        }
        return baseStyle
    }

    switch (variant) {
        case 'filled':
            baseStyle.backgroundColor = theme.utils.getColor(color)
            break
        case 'soft':
            baseStyle.backgroundColor = theme.utils.getColor(`${color}Muted`)
            break
        case 'outlined':
            baseStyle.backgroundColor = theme.utils.getColor('bg')
            baseStyle.borderColor = theme.utils.getColor(color)
            break
        case 'plain':
            // baseStyle remains as is
            break
    }

    return baseStyle
}

/** Get the color for text or icon based on the button properties */
const getColor = ({
    variant,
    color = 'primary',
    disabled,
}: Pick<ButtonProps, 'variant' | 'disabled'> & {
    color?: ButtonProps['color']
}): Color => {
    if (disabled) {
        return 'fgMuted'
    }

    if (color === 'neutral') {
        return 'fg'
    }

    switch (variant) {
        case 'filled':
            return 'fgInverted'
        case 'soft':
        case 'outlined':
        case 'plain':
            const variantColors = getColorSchemeVariants(color)
            return color === 'primary' ? 'primary.bg' : variantColors.fg
        default:
            return 'fgMuted'
    }
}

/** Get the wrapper style for a button */
export const getButtonWrapperStyle = ({
    theme,
    variant = 'filled',
    color = 'primary',
    disabled = false,
}: Pick<ButtonProps, 'variant' | 'color' | 'disabled'> & {
    theme: Theme
}): StyleProp<ViewStyle> => {
    return getBaseStyle({ variant, color, disabled, theme })
}

/** Get the wrapper style for an icon button */
export const getIconWrapperStyle = ({
    theme,
    variant = 'filled',
    color = 'primary',
    disabled = false,
}: Pick<IconButtonProps, 'variant' | 'color' | 'disabled'> & {
    theme: Theme
}): StyleProp<ViewStyle> => {
    if (color === 'neutral') {
        return { backgroundColor: 'transparent' }
    }
    return getBaseStyle({ variant, color, disabled, theme })
}

/** Get the text color for a button */
export const getTextColor = ({
    variant = 'filled',
    color = 'primary',
    disabled = false,
}: Pick<ButtonProps, 'variant' | 'color' | 'disabled'>): Color => {
    return getColor({ variant, color, disabled })
}

/** Get the icon color for an icon button */
export const getIconColor = ({
    variant = 'filled',
    color = 'primary',
    disabled = false,
}: Pick<IconButtonProps, 'variant' | 'color' | 'disabled'>): Color => {
    return getColor({ variant, color, disabled })
}

/** Map button sizes to icon sizes */
export const sizeToIconSize: Record<ButtonSize, number> = {
    small: 14,
    normal: 18,
    large: 22,
}
