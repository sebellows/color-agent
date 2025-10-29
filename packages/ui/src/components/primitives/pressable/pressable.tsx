import React from 'react'
import {
    GestureResponderEvent,
    Pressable as RNPressable,
    PressableProps as RNPressableProps,
} from 'react-native'

import { isNil, isString, isUndefined } from 'es-toolkit'
import Animated, { AnimatedProps } from 'react-native-reanimated'

import { useHaptics, usePressedState } from '../../../hooks'

export type PressableHapticFeedbackType = 'soft' | 'light' | 'medium' | 'heavy' | 'rigid'

export type HapticConfig = {
    onPress?: PressableHapticFeedbackType
    onLongPress?: PressableHapticFeedbackType
}

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type PressableCoreProps = React.ComponentPropsWithRef<typeof RNPressable> &
    Pick<AnimatedProps<RNPressableProps>, 'animatedProps' | 'style' | 'entering' | 'exiting'>

const PressableCore = (props: PressableCoreProps) => <AnimatedPressable {...props} />

export type PressableProps = PressableCoreProps & {
    haptics?: PressableHapticFeedbackType | HapticConfig
}

export function Pressable({ ref, haptics = {}, onPress, onLongPress, ...rest }: PressableProps) {
    const { triggerHaptics } = useHaptics()
    const hapticConfig = isString(haptics) ? { onPress: haptics } : haptics
    const { onPressIn, onPressOut } = usePressedState(rest)
    const shouldPassLongPress = isUndefined(onLongPress) || !isNil(hapticConfig.onLongPress)

    function handlePress(event: GestureResponderEvent) {
        if (hapticConfig.onPress) {
            void triggerHaptics(hapticConfig.onPress)
        }
        onPress?.(event)
    }

    function handleLongPress(event: GestureResponderEvent) {
        if (hapticConfig.onLongPress) {
            void triggerHaptics(hapticConfig.onLongPress)
        }
        onLongPress?.(event)
    }

    return (
        <PressableCore
            ref={ref}
            onPress={handlePress}
            onLongPress={shouldPassLongPress ? handleLongPress : undefined}
            {...rest}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        />
    )
}
