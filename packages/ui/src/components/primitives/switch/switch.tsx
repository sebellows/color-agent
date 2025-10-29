import { View, type GestureResponderEvent } from 'react-native'

import { Pressable } from '../pressable'
import { Slot } from '../slot'
import type { RootProps, ThumbProps } from './switch.types'

const Root = ({
    ref,
    asChild,
    checked,
    onCheckedChange,
    disabled,
    onPress: onPressProp,
    'aria-valuetext': ariaValueText,
    ...props
}: RootProps) => {
    function onPress(ev: GestureResponderEvent) {
        if (disabled) return
        onCheckedChange(!checked)
        onPressProp?.(ev)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Component
            ref={ref}
            aria-disabled={disabled}
            role="switch"
            aria-checked={checked}
            aria-valuetext={ariaValueText ?? checked ? 'on' : 'off'}
            onPress={onPress}
            accessibilityState={{
                checked,
                disabled,
            }}
            disabled={disabled}
            {...props}
        />
    )
}

Root.displayName = 'SwitchRoot.Native'

const Thumb = ({ ref, asChild, ...props }: ThumbProps) => {
    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role="presentation" {...props} />
}

Thumb.displayName = 'SwitchThumb.Native'

export { Root, Thumb }
