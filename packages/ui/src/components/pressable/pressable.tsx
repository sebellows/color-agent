import { type GestureResponderEvent } from 'react-native'

import { useHaptics } from '@ui/hooks/use-haptics'
import { usePressedState } from '@ui/hooks/use-pressed-state'

import { PressableCore, PressableCoreProps, PressableRef } from './pressable-core'
import { PressEffects } from './pressable.types'
import { usePressEffectStyle } from './pressable.utils'

type PressableHapticFeedbackType = 'soft' | 'light' | 'medium' | 'heavy' | 'rigid'

interface HapticConfig {
    onPress?: PressableHapticFeedbackType
    onLongPress?: PressableHapticFeedbackType
}

interface PressableOwnProps {
    /**
     * Configure haptic feedback
     *
     * @example
     * // Provide a single string value to apply feedback to 'onPress'.
     * <Pressable haptics="soft" />
     *
     * // Use an object to specify feedback type for press, long press, or both
     * <Pressable haptics={{ onPress: 'light', onLongPress: 'rigid' }} />
     */
    haptics?: PressableHapticFeedbackType | HapticConfig

    /**
     * Specify animations for pressed state
     *
     * @example
     * // Basic property transition
     * <Pressable pressEffects={{ opacity: { from: 1, to: 0.5 } }} />
     *
     * @example
     * // Multiple properties
     * <Pressable
     *   pressEffects={{
     *     opacity: { from: 1, to: 0.5 },
     *     backgroundColor: { from: 'base.bg-primary', to: 'base.bg-secondary' },
     *   }}
     * />
     *
     * @example
     * // Delay the transition
     * <Pressable pressEffects={{ opacity: { from: 1, to: 0.5 }, settings: { delay: 150 } }} />
     *
     * @example
     * // Specify react-native-reanimated configuration
     * <Pressable pressEffects={{ opacity: { from: 1, to: 0.5, settings: { type: 'spring', config: { duration: 300 } } } }} />
     */
    pressEffects?: PressEffects
}

export type PressableProps = PressableOwnProps & PressableCoreProps

export function Pressable({
    haptics = {},
    pressEffects = {},
    onPress,
    onLongPress,
    style,
    ref,
    ...rest
}: PressableProps & { ref?: PressableRef }) {
    const triggerHaptics = useHaptics()
    const hapticConfig = typeof haptics === 'string' ? { onPress: haptics } : haptics
    const { onPressIn, onPressOut, pressed } = usePressedState(rest)
    const pressEffectStyle = usePressEffectStyle({ pressed, pressEffects })
    const shouldPassLongPress =
        typeof onLongPress !== 'undefined' || typeof hapticConfig.onLongPress !== 'undefined'

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
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[pressEffectStyle, style]}
            {...rest}
        />
    )
}
