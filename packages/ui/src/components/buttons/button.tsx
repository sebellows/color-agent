import { ActivityIndicator, TouchableOpacity, type GestureResponderEvent } from 'react-native'

import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { TypographyToken } from '../../design-system/design-tokens/typography-token'
import { useHaptics } from '../../hooks/use-haptics'
import { Icon } from '../ui/icon'
import { Stack } from '../layout/stack'
import { Text } from '../text'
import { type ButtonProps, type ButtonSize } from './button.types'
import { getButtonWrapperStyle, getTextColor, sizeToIconSize } from './button.utils'

export function Button({
    children,
    color = 'primary',
    icon,
    iconPlacement = 'end',
    loading,
    disabled,
    size = 'normal',
    style,
    variant = 'filled',
    onPress,
    accessibilityRole,
    ...rest
}: ButtonProps) {
    const { theme } = useUnistyles()
    const textVariant = sizeToTextVariant[size]
    const iconSize = sizeToIconSize[size]

    const wrapperStyle = getButtonWrapperStyle({
        theme,
        variant,
        color,
        disabled,
    })

    const textColor = getTextColor({ variant, color, disabled })

    const iconComp = icon && <Icon name={icon} color={textColor} size={iconSize} />

    const { triggerHaptics } = useHaptics()

    const handleOnPress = (e: GestureResponderEvent) => {
        if (disabled) return

        triggerHaptics('selection')

        onPress?.(e)
    }

    styles.useVariants({
        size,
        disabled,
    })

    return (
        <TouchableOpacity
            style={[styles.wrapper, wrapperStyle, style]}
            onPress={handleOnPress}
            activeOpacity={disabled ? 0.9 : 0.8}
            accessibilityRole={accessibilityRole ?? 'button'}
            accessibilityState={{ disabled, busy: loading }}
            {...rest}
        >
            <Stack
                axis="x"
                align="center"
                justify="center"
                style={{ flexGrow: 1 }}
                spacing={size === 'large' ? 'sm' : 'xs'}
            >
                {loading ?
                    <ActivityIndicator color={theme.utils.getColor(textColor)} size="small" />
                :   <>
                        {icon && iconPlacement === 'start' && iconComp}
                        <Text
                            variant={textVariant}
                            style={{
                                color: theme.utils.getColor(textColor),
                                lineHeight: sizeToLineHeight[size],
                                flexShrink: 1,
                            }}
                            numberOfLines={size === 'large' ? 2 : 1}
                        >
                            {children}
                        </Text>
                        {icon && iconPlacement === 'end' && iconComp}
                    </>
                }
            </Stack>
        </TouchableOpacity>
    )
}

const sizeToTextVariant: Record<ButtonSize, TypographyToken> = {
    small: 'detailBold',
    normal: 'bodySmallBold',
    large: 'bodySemiBold',
}

const sizeToLineHeight: Record<ButtonSize, number> = {
    small: 18,
    normal: 22,
    large: 26,
}

const styles = StyleSheet.create(theme => ({
    wrapper: {
        borderRadius: theme.radii.full,
        variants: {
            size: {
                small: { minHeight: 32, paddingHorizontal: theme.space.sm },
                normal: { minHeight: 44, paddingHorizontal: theme.space.md },
                large: { minHeight: 60, paddingHorizontal: theme.space.lg },
            },
            disabled: {
                true: { opacity: 0.9 },
            },
        },
    },
}))
