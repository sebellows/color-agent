import { Pressable, type GestureResponderEvent } from 'react-native'

import { Toggle } from 'radix-ui'

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
    function onPress(ev: GestureResponderEvent) {
        onPressProp?.(ev)
        onPressedChange(!pressed)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Toggle.Root
            pressed={pressed}
            onPressedChange={onPressedChange}
            disabled={disabled}
            asChild
        >
            <Component ref={ref} onPress={onPress} disabled={disabled} role="button" {...props} />
        </Toggle.Root>
    )
}

Root.displayName = 'ToggleRoot.Web'

export { Root }
