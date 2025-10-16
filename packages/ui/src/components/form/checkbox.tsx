import React from 'react'
import { AccessibilityProps, PixelRatio, TouchableOpacity, View } from 'react-native'

import { useHaptics } from '@ui/hooks/use-haptics'
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { Icon } from '../icon'
import { PressableSlotProps } from '../slot'
import { Text } from '../text'

type RootProps = AccessibilityProps &
    PressableSlotProps & {
        onChange: (value: boolean) => void
        value: string
        checked: boolean
        disabled?: boolean
        label: string
    }

export function Checkbox({
    onChange,
    checked,
    value,
    label,
    accessibilityLabel = `Checkbox option: ${label}`,
    ...props
}: RootProps) {
    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(checked ? 1 : 0, {
                        duration: 100,
                        easing: Easing.inOut(Easing.ease),
                    }),
                },
            ],
        }
    })

    const accessibilityHint = React.useMemo(() => {
        if (props?.accessibilityHint) {
            return props.accessibilityHint
        }
        return checked ? 'Double tap to check this option' : 'Double tap to uncheck this option'
    }, [checked])

    const { triggerHaptics } = useHaptics()

    function onPress() {
        triggerHaptics('selection')
        onChange(!checked)
    }

    styles.useVariants({ checked })

    return (
        <TouchableOpacity
            style={styles.wrapper}
            onPress={onPress}
            activeOpacity={0.8}
            accessible
            accessibilityRole="checkbox"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ checked }}
            accessibilityHint={accessibilityHint}
        >
            <View style={styles.radioOuter}>
                <Animated.View style={animatedStyles}>
                    <Icon name="check" size={18} color="textOnContrastingBg" />
                </Animated.View>
            </View>

            <Text variant={checked ? 'bodyBold' : 'body'}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create(theme => ({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        position: 'relative',
        width: 24,
        height: 24,
        backgroundColor: 'transparent',
        borderRadius: theme.radii.default,
        borderWidth: PixelRatio.roundToNearestPixel(1.5), // try to match with icon width
        marginRight: theme.space.sm,
        borderColor: theme.colors.fg,
        ...theme.utils.flexCenter,
        variants: {
            checked: {
                true: {
                    backgroundColor: theme.colors.primary,
                },
            },
        },
    },
}))
