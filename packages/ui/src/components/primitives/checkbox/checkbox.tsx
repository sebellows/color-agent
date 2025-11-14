import * as React from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'

import { Slot } from '../slot'
import type { IndicatorProps, RootProps, TriggerProps } from './checkbox.types'

/**************************************************
 * Checkbox Root/Context
 **************************************************/

type RootContext = RootProps & {
    nativeID?: string
}

const CheckboxContext = React.createContext<RootContext | null>(null)

const Root = ({
    ref,
    asChild,
    disabled = false,
    checked,
    onCheckedChange,
    nativeID,
    ...props
}: RootProps) => {
    return (
        <CheckboxContext.Provider
            value={{
                disabled,
                checked,
                onCheckedChange,
                nativeID,
            }}
        >
            <Trigger ref={ref} {...props} />
        </CheckboxContext.Provider>
    )
}

Root.displayName = 'CheckboxRoot.Native'

function useCheckboxContext() {
    const context = React.useContext(CheckboxContext)
    if (!context) {
        throw new Error(
            'Checkbox compound components cannot be rendered outside the Checkbox component',
        )
    }
    return context
}

/**************************************************
 * Checkbox Trigger
 **************************************************/

const Trigger = ({ ref, asChild, onPress: onPressProp, ...props }: TriggerProps) => {
    const { disabled, checked, onCheckedChange, nativeID } = useCheckboxContext()

    function onPress(event: GestureResponderEvent) {
        if (disabled) return
        const newValue = !checked
        onCheckedChange(newValue)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Component
            ref={ref}
            nativeID={nativeID}
            aria-disabled={disabled}
            role="checkbox"
            aria-checked={checked}
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

Trigger.displayName = 'CheckboxTrigger.Native'

/**************************************************
 * Checkbox Indicator
 **************************************************/

const Indicator = ({ ref, asChild, forceMount, ...props }: IndicatorProps) => {
    const { checked, disabled } = useCheckboxContext()

    if (!forceMount) {
        if (!checked) return null
    }

    const Component = asChild ? Slot.View : View

    return (
        <Component
            ref={ref}
            aria-disabled={disabled}
            aria-hidden={!(forceMount || checked)}
            role={'presentation'}
            {...props}
        />
    )
}

Indicator.displayName = 'CheckboxIndicator.Native'

export { Indicator, Root, Trigger }
