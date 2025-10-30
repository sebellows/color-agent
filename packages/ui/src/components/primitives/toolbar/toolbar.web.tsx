import * as React from 'react'
import { Pressable, View, type GestureResponderEvent } from 'react-native'

import { Toolbar } from 'radix-ui'

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

const Root = ({ ref, asChild, orientation, dir, loop, style, ...props }: RootProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Toolbar.Root orientation={orientation} dir={dir} loop={loop} asChild>
            <Component ref={ref} {...props} />
        </Toolbar.Root>
    )
}

Root.displayName = 'ToolbarRoot.Web'

const ToggleGroupContext = React.createContext<ToggleGroupProps | null>(null)

const ToggleGroup = ({
    ref,
    asChild,
    type,
    value,
    onValueChange,
    disabled = false,
    style,
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
            <Toolbar.ToggleGroup
                type={type as any}
                value={value as any}
                onValueChange={onValueChange as any}
                disabled={disabled}
                asChild
            >
                <Component ref={ref} {...viewProps} />
            </Toolbar.ToggleGroup>
        </ToggleGroupContext.Provider>
    )
}

ToggleGroup.displayName = 'ToolbarToggleGroup.Web'

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
    style,
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

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Toolbar.ToggleItem value={itemValue} asChild>
            <Component ref={ref} onPress={onPress} role="button" {...props} />
        </Toolbar.ToggleItem>
    )
}

ToggleItem.displayName = 'ToolbarToggleItem.Web'

const Separator = ({ ref, asChild, style, ...props }: SeparatorProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} {...props} />
}

Separator.displayName = 'ToolbarSeparator.Web'

const Link = ({ ref, asChild, style, ...props }: LinkProps) => {
    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Toolbar.Link asChild>
            <Component ref={ref} {...props} />
        </Toolbar.Link>
    )
}

Link.displayName = 'ToolbarLink.Web'

const Button = ({ ref, asChild, style, ...props }: ButtonProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Toolbar.Button asChild>
            <Component ref={ref} role="button" {...props} />
        </Toolbar.Button>
    )
}

export { Button, Link, Root, Separator, ToggleGroup, ToggleItem }
