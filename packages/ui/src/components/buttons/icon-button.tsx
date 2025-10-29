import { ActivityIndicator, GestureResponderEvent, Pressable } from 'react-native'

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { useHaptics } from '../../hooks/use-haptics'
import { usePressedState } from '../../hooks/use-pressed-state'
import { Icon } from '../icon'
import { Slot } from '@ui/components/primitives/slot'
import type { IconButtonProps } from './button.types'
import { getIconColor, getIconWrapperStyle, sizeToIconSize } from './button.utils'

const HIT_SLOP_FACTOR = 1.2

export function IconButton({
    ref,
    asChild,
    icon,
    color = 'neutral.fg',
    size = 'normal',
    variant = 'filled',
    loading,
    disabled,
    onPress,
    accessibilityRole,
    accessibilityLabel,
    accessibilityHint,
    ...props
}: IconButtonProps) {
    const { theme } = useUnistyles()
    const {
        onPressIn,
        onPressOut,
        pressed: pressedState = false,
    } = usePressedState({ disabled, ...props })
    const pressed = useSharedValue(pressedState)
    const iconSize = sizeToIconSize[size]
    const wantedHitSize = iconSize * HIT_SLOP_FACTOR

    const { triggerHaptics } = useHaptics()

    const hitSlop = {
        top: (wantedHitSize - iconSize) / 2,
        bottom: (wantedHitSize - iconSize) / 2,
        left: (wantedHitSize - iconSize) / 2,
        right: (wantedHitSize - iconSize) / 2,
    }

    const wrapperStyle = getIconWrapperStyle({
        theme,
        variant,
        color,
        disabled,
    })

    const iconColor = getIconColor({ variant, color, disabled })

    const contentStyles = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(pressed.value ? 0.8 : 1) }],
        }
    })

    const highlightStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(pressed.value ? 1 : 0),
            transform: [{ scale: withSpring(pressed.value ? 1.3 : 1.6) }],
        }
    })

    const handleOnPress = (e: GestureResponderEvent) => {
        if (disabled) return

        triggerHaptics('selection')

        onPress?.(e)
    }

    styles.useVariants({
        size,
        disabled,
    })

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={ref}
            hitSlop={hitSlop}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
            onPress={handleOnPress}
            style={[styles.wrapper, wrapperStyle]}
            accessibilityRole={accessibilityRole ?? 'button'}
            accessibilityLabel={accessibilityLabel} // Icon button with ${icon} icon
            accessibilityHint={accessibilityHint} // Double tap to perform action
            accessibilityState={{ disabled: !!disabled, busy: !!loading }}
            {...props}
        >
            <Animated.View style={highlightStyles} />
            {loading ?
                <ActivityIndicator color={theme.utils.getColor(iconColor)} size="small" />
            :   <Animated.View style={contentStyles}>
                    <Icon name={icon} color={iconColor} size={iconSize} />
                </Animated.View>
            }
        </Component>
    )
}

const styles = StyleSheet.create(theme => ({
    wrapper: {
        borderRadius: theme.radii.md,
        position: 'relative',
        ...theme.utils.flexCenter,
        variants: {
            size: {
                small: {
                    height: 16,
                    width: 16,
                    borderRadius: theme.radii.default,
                },
                normal: {
                    height: 24,
                    width: 24,
                    borderRadius: theme.radii.default,
                },
                large: {
                    height: 44,
                    width: 44,
                },
            },
            disabled: {
                true: {
                    opacity: 0.9,
                },
            },
        },
    },
    pressHighlight: {
        zIndex: -1,
        elevation: -1,
        backgroundColor: theme.utils.getColor('neutral.bg'), // TODO: Add press highlight color to theme
        borderRadius: theme.radii.full,
    },
}))
