import { useCallback } from 'react'
import { GestureResponderEvent } from 'react-native'

import { SharedValue, useSharedValue } from 'react-native-reanimated'

export interface UsePressedStateInputProps {
    disabled?: boolean
    onPressIn?: ((event: GestureResponderEvent) => void) | null
    onPressOut?: ((event: GestureResponderEvent) => void) | null
}

export interface UsePressedState {
    pressed?: SharedValue<boolean>
    onPressIn?: ((event: GestureResponderEvent) => void) | null
    onPressOut?: ((event: GestureResponderEvent) => void) | null
}

/**
 * Access pressed state of interactive elements.
 *
 * Source: @leather-io/mono
 *
 * @example Basic example
 * ```
 * const { pressed, onPressIn, onPressOut } = usePressedState()
 * return <Pressable onPressIn={onPressIn} onPressOut={onPressOut}/>
 * ```
 *
 * @example Pass outer props to make sure incoming onPressIn and onPressOut are invoked.
 * ```
 * function Button(props: ButtonProps) {
 *   const { pressed, onPressIn, onPressOut } = usePressedState(props)
 *   return <Pressable onPressIn={onPressIn} onPressOut={onPressOut}/>
 * }
 * ```
 */
export function usePressedState({
    disabled,
    onPressIn,
    onPressOut,
}: UsePressedStateInputProps = {}): UsePressedState {
    const pressed = useSharedValue(false)

    function handlePressIn(event: GestureResponderEvent) {
        if (disabled) return

        pressed.value = true
        onPressIn?.(event)
    }

    function handlePressOut(event: GestureResponderEvent) {
        if (disabled) return

        pressed.value = false
        onPressOut?.(event)
    }

    return {
        onPressIn: useCallback(handlePressIn, [onPressIn, pressed]),
        onPressOut: useCallback(handlePressOut, [onPressOut, pressed]),
        pressed,
    }
}
