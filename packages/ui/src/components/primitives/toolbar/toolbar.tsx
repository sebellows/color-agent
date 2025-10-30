import * as React from 'react'
import { View, type GestureResponderEvent } from 'react-native'

import { Pressable } from '../pressable'
import { ToggleGroupUtils } from '../primitive.utils'
import { Slot } from '../slot'
import type {
    ButtonProps,
    LinkProps,
    RootProps,
    SeparatorProps,
    ToggleGroupProps,
    ToggleItemProps,
} from './toolbar.types'

const Root = ({
    ref,
    asChild,
    orientation: _orientation,
    dir: _dir,
    loop: _loop,
    ...props
}: RootProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="toolbar" {...props} />
}

Root.displayName = 'ToolbarRoot.Native'

const ToggleGroupContext = React.createContext<ToggleGroupProps | null>(null)

const ToggleGroup = ({
    ref,
    asChild,
    type,
    value,
    onValueChange,
    disabled = false,
    ...viewProps
}: ToggleGroupProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <ToggleGroupContext.Provider
            value={
                {
                    type,
                    value,
                    disabled,
                    onValueChange,
                } as ToggleGroupProps
            }
        >
            <Component ref={ref} role="group" {...viewProps} />
        </ToggleGroupContext.Provider>
    )
}

ToggleGroup.displayName = 'ToolbarToggleGroup.Native'

function useToggleGroupContext() {
    const context = React.useContext(ToggleGroupContext)
    if (!context) {
        throw new Error(
            'ToggleGroup compound components cannot be rendered outside the ToggleGroup component',
        )
    }
    return context
}

const ToggleItem = ({
    ref,
    asChild,
    value: itemValue,
    disabled: disabledProp = false,
    onPress: onPressProp,
    ...props
}: ToggleItemProps) => {
    const { type, disabled, value, onValueChange } = useToggleGroupContext()

    function onPress(event: GestureResponderEvent) {
        if (disabled || disabledProp) return
        if (type === 'single') {
            onValueChange(ToggleGroupUtils.getNewSingleValue(value, itemValue))
        }
        if (type === 'multiple') {
            onValueChange(ToggleGroupUtils.getNewMultipleValue(value, itemValue))
        }
        onPressProp?.(event)
    }

    const isChecked =
        type === 'single' ? ToggleGroupUtils.getIsSelected(value, itemValue) : undefined
    const isSelected =
        type === 'multiple' ? ToggleGroupUtils.getIsSelected(value, itemValue) : undefined

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={ref}
            aria-disabled={disabled}
            role={type === 'single' ? 'radio' : 'checkbox'}
            onPress={onPress}
            aria-checked={isChecked}
            aria-selected={isSelected}
            disabled={(disabled || disabledProp) ?? false}
            accessibilityState={{
                disabled: (disabled || disabledProp) ?? false,
                checked: isChecked,
                selected: isSelected,
            }}
            {...props}
        />
    )
}

ToggleItem.displayName = 'ToolbarToggleItem.Native'

const Separator = ({ ref, asChild, ...props }: SeparatorProps) => {
    const Component = asChild ? Slot.View : View

    return <Component role={'separator'} ref={ref} {...props} />
}

Separator.displayName = 'ToolbarSeparator.Native'

const Link = ({ ref, asChild, ...props }: LinkProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} role="link" {...props} />
}

Link.displayName = 'ToolbarLink.Native'

const Button = ({ ref, asChild, ...props }: ButtonProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} role="button" {...props} />
}

export { Button, Link, Root, Separator, ToggleGroup, ToggleItem }
