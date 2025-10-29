import * as React from 'react'
import { Pressable, View, type GestureResponderEvent } from 'react-native'

import { Switch } from 'radix-ui'

import { Slot } from '../slot'
import type { RootProps, ThumbProps } from './switch.types'

const Root = ({
    ref,
    asChild,
    checked,
    onCheckedChange,
    disabled,
    onPress: onPressProp,
    onKeyDown: onKeyDownProp,
    ...props
}: RootProps) => {
    function onPress(ev: GestureResponderEvent) {
        onCheckedChange(!checked)
        onPressProp?.(ev)
    }

    function onKeyDown(ev: React.KeyboardEvent) {
        onKeyDownProp?.(ev)
        if (ev.key === ' ') {
            onCheckedChange(!checked)
        }
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Switch.Root
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            asChild
        >
            <Component
                ref={ref}
                disabled={disabled}
                onPress={onPress}
                // @ts-expect-error Web only
                onKeyDown={onKeyDown}
                {...props}
            />
        </Switch.Root>
    )
}

Root.displayName = 'SwitchRoot.Web'

const Thumb = ({ ref, asChild, ...props }: ThumbProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Switch.Thumb asChild>
            <Component ref={ref} {...props} />
        </Switch.Thumb>
    )
}

Thumb.displayName = 'SwitchThumb.Web'

export { Root, Thumb }
