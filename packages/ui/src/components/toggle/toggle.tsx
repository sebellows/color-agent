import { backgroundColor } from '@shopify/restyle'
import React, { ReactNode, useRef } from 'react'
import {
    Animated as RNAnimated,
    Easing,
    GestureResponderEvent,
    NativeSyntheticEvent,
    PanResponder,
    PanResponderCallbacks,
    PanResponderGestureState,
    TargetedEvent,
    useAnimatedValue,
    TouchableOpacityProps,
} from 'react-native'

import { Animated } from '../../animated'
import { Pressable } from '../../pressable'

import { Box } from '../box'

export interface ToggleProps extends TouchableOpacityProps {
    appearance?: 'default' | 'outline' | 'filled'
    children?: ReactNode
    checked?: boolean
    onChange?: (checked: boolean) => void
}

const toggleStyles = {
    thumbWidth: 28,
    thumbHeight: 28,
    thumbBorderRadius: 14,
    iconWidth: 12,
    iconHeight: 12,
}

export const Toggle = ({
    onChange,
    onPressIn,
    onPressOut,
    onBlur,
    onFocus,
    ...props
}: ToggleProps & PanResponderCallbacks) => {
    const thumbWidthAnimation = useAnimatedValue(0)
    const thumbTranslateAnimation = useAnimatedValue(0)
    const ellipseScaleAnimation = useAnimatedValue(0)
    const thumbTranslateAnimationActive = useRef(false)

    const panResponder = useRef(
        PanResponder.create({
            onPanResponderGrant: (event: GestureResponderEvent): void => {
                const { checked, disabled } = props

                if (disabled) {
                    return
                }

                onPressIn?.(event)

                if (thumbTranslateAnimationActive) {
                    thumbTranslateAnimationActive.current = false
                    stopAnimations()
                    return
                }

                animateThumbWidth(toggleStyles.thumbWidth * 1.2)
                animateEllipseScale(checked ? 1 : 0.01)
            },
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (
                event: GestureResponderEvent,
                gestureState: PanResponderGestureState,
            ): boolean => {
                const { checked, disabled } = props
                const { dx } = gestureState
                const isMoving = Math.abs(dx) > 5
                const isChecked = checked && dx < 0
                const isUnchecked = !checked && dx > 0
                const isDisabled = disabled
                const isPressable = !isDisabled && (isMoving || isChecked || isUnchecked)
                if (isPressable) {
                    onPressIn?.(event)
                    animateThumbWidth(toggleStyles.thumbWidth * 1.2)
                    animateEllipseScale(checked ? 1 : 0.01)
                }
                return isPressable
            },
            onPanResponderMove: () => true,
            onPanResponderRelease: (
                event: GestureResponderEvent,
                gestureState: PanResponderGestureState,
            ): void => {
                const { checked, disabled } = props

                if (!disabled) {
                    if ((!checked && gestureState.dx > -5) || (checked && gestureState.dx < 5)) {
                        toggle(onPress)
                    } else {
                        animateEllipseScale(checked ? 0.01 : 1)
                    }
                }

                animateThumbWidth(toggleStyles.thumbWidth)
                onPressOut?.(event)
            },
        }),
    )

    const animateThumbWidth = (value: number, callback: () => void = () => null): void => {
        RNAnimated.timing(thumbWidthAnimation, {
            toValue: value,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(callback)
    }

    const animateEllipseScale = (value: number, callback: () => void = () => null): void => {
        RNAnimated.timing(ellipseScaleAnimation, {
            toValue: value,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(callback)
    }

    const stopAnimations = (): void => {
        const value: number = props.checked ? 0.01 : 1

        thumbTranslateAnimation.stopAnimation()
        ellipseScaleAnimation.stopAnimation()
        thumbWidthAnimation.stopAnimation()

        ellipseScaleAnimation.setValue(value)
    }

    const toggle = (callback: (nextValue: boolean) => void): void => {
        const value: number = props.checked ? -20 : 20

        animateThumbTranslate(value, () => {
            thumbTranslateAnimation.setValue(0)
            callback(!props.checked)
        })

        animateThumbWidth(toggleStyles.thumbWidth)
    }

    const onPress = (): void => {
        onChange?.(!props.checked)
    }

    const animateThumbTranslate = (value: number, callback: () => void = () => null): void => {
        thumbTranslateAnimationActive.current = true

        RNAnimated.timing(thumbTranslateAnimation, {
            toValue: value,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            thumbTranslateAnimationActive.current = false
            callback()
        })
    }

    return (
        <Box
            testID={props.testID}
            {...(panResponder.current?.panHandlers ?? {})}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
        >
            <Pressable
                {...props}
                justifyContent="center"
                alignItems="center"
                onFocus={onFocus}
                onBlur={onBlur}
            >
                <Box alignSelf="center" position="absolute" />
                <Animated.Box justifyContent="center" alignItems="center" overflow="hidden">
                    <Animated.Box alignSelf="center" position="absolute" />
                    <Animated.Box justifyContent="center" alignItems="center">
                        {/* <CheckMark /> */}
                    </Animated.Box>
                </Animated.Box>
            </Pressable>
        </Box>
    )
}
