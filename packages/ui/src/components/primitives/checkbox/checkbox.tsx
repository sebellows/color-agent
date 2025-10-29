import * as React from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'

import type { SlottablePressableProps } from '../../../types/react-native.types'
import { Slot } from '@ui/components/primitives/slot'
import type { CheckboxIndicatorProps, CheckboxRootProps } from './checkbox.types'

/**************************************************
 * Checkbox Root/Context
 **************************************************/

type RootContext = CheckboxRootProps & {
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
}: CheckboxRootProps) => {
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

type CheckboxTriggerProps = SlottablePressableProps

const Trigger = ({ ref, asChild, onPress: onPressProp, ...props }: CheckboxTriggerProps) => {
    const { disabled, checked, onCheckedChange, nativeID } = useCheckboxContext()

    function onPress(ev: GestureResponderEvent) {
        if (disabled) return
        const newValue = !checked
        onCheckedChange(newValue)
        onPressProp?.(ev)
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

const Indicator = ({ ref, asChild, forceMount, ...props }: CheckboxIndicatorProps) => {
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
