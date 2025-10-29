import * as React from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'

import { RadioGroup } from 'radix-ui'

import { Slot } from '@ui/components/primitives/slot'
import type { IndicatorProps, ItemProps, RootProps } from './radio-group.types'

const RadioGroupContext = React.createContext<RootProps | null>(null)

const Root = ({
    ref,
    asChild,
    value,
    onValueChange,
    disabled = false,
    ...viewProps
}: RootProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <RadioGroupContext.Provider
            value={{
                value,
                disabled,
                onValueChange,
            }}
        >
            <RadioGroup.Root
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                asChild
            >
                <Component ref={ref} {...viewProps} />
            </RadioGroup.Root>
        </RadioGroupContext.Provider>
    )
}

Root.displayName = 'RadioGroupRoot'

function useRadioGroupContext() {
    const context = React.useContext(RadioGroupContext)
    if (!context) {
        throw new Error(
            'RadioGroup compound components cannot be rendered outside the RadioGroup component',
        )
    }
    return context
}

const Item = ({ ref, asChild, value, onPress: onPressProps, ...props }: ItemProps) => {
    const { onValueChange } = useRadioGroupContext()

    function onPress(ev: GestureResponderEvent) {
        if (onPressProps) {
            onPressProps(ev)
        }
        onValueChange(value)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <RadioGroup.Item value={value} asChild>
            <Component ref={ref} onPress={onPress} {...props} />
        </RadioGroup.Item>
    )
}

Item.displayName = 'RadioGroupItem'

const Indicator = ({ ref, asChild, forceMount, ...props }: IndicatorProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <RadioGroup.Indicator asChild>
            <Component ref={ref} {...props} />
        </RadioGroup.Indicator>
    )
}

Indicator.displayName = 'RadioGroupIndicator'

export { Indicator, Item, Root }
