import * as React from 'react'
import { View, type GestureResponderEvent } from 'react-native'

import { Pressable } from '../pressable'
import { Slot } from '../slot'
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
            <Component ref={ref} role="radiogroup" {...viewProps} />
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

interface RadioItemContext {
    itemValue: string | undefined
}

const RadioItemContext = React.createContext<RadioItemContext | null>(null)

const Item = ({
    ref,
    asChild,
    value: itemValue,
    disabled: disabledProp = false,
    onPress: onPressProp,
    accessibilityHint = 'Double tap to select this option',
    accessibilityLabel,
    ...props
}: ItemProps) => {
    const { disabled, value, onValueChange } = useRadioGroupContext()

    function onPress(event: GestureResponderEvent) {
        if (disabled || disabledProp) return
        onValueChange(itemValue)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <RadioItemContext.Provider
            value={{
                itemValue: itemValue,
            }}
        >
            <Component
                ref={ref}
                role="radio"
                onPress={onPress}
                aria-checked={value === itemValue}
                disabled={(disabled || disabledProp) ?? false}
                accessibilityState={{
                    disabled: (disabled || disabledProp) ?? false,
                    checked: value === itemValue,
                }}
                accessibilityHint={accessibilityHint}
                accessibilityLabel={accessibilityLabel ?? `Radio option: ${value}`}
                {...props}
            />
        </RadioItemContext.Provider>
    )
}

Item.displayName = 'RadioGroupItem'

function useRadioItemContext() {
    const context = React.useContext(RadioItemContext)
    if (!context) {
        throw new Error(
            'RadioItem compound components cannot be rendered outside the RadioItem component',
        )
    }
    return context
}

const Indicator = ({ ref, asChild, forceMount, ...props }: IndicatorProps) => {
    const { value } = useRadioGroupContext()
    const { itemValue } = useRadioItemContext()

    if (!forceMount && value !== itemValue) return null

    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role="presentation" {...props} />
}

Indicator.displayName = 'RadioGroupIndicator'

export { Indicator, Item, Root }
