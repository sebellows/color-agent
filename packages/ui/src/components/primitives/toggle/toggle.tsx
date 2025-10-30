import { type GestureResponderEvent } from 'react-native'

import { Pressable } from '../pressable'
import { Slot } from '../slot'
import type { RootProps } from './toggle.types'

const Root = ({
    ref,
    asChild,
    pressed,
    onPressedChange,
    disabled,
    onPress: onPressProp,
    ...props
}: RootProps) => {
    function onPress(event: GestureResponderEvent) {
        if (disabled) return
        const newValue = !pressed
        onPressedChange(newValue)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={ref}
            aria-disabled={disabled}
            role="switch"
            aria-selected={pressed}
            onPress={onPress}
            accessibilityState={{
                selected: pressed,
                disabled,
            }}
            disabled={disabled}
            {...props}
        />
    )
}

Root.displayName = 'ToggleRoot.Native'

export { Root }
