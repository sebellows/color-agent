import * as React from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'

import { Slot } from '@ui/components/primitives/slot'
import { useAugmentedRef, useIsomorphicLayoutEffect } from '@ui/hooks'
import { Checkbox } from 'radix-ui'

import type { CheckboxIndicatorProps, CheckboxRootProps } from './checkbox.types'

const ROOT_NAME = 'CheckboxRoot.Web'

const CheckboxContext = React.createContext<CheckboxRootProps | null>(null)

const Root = ({
    ref,
    asChild,
    disabled,
    checked,
    onCheckedChange,
    onPress: onPressProp,
    role: _role,
    ...props
}: CheckboxRootProps) => {
    const augmentedRef = useAugmentedRef({ ref: ref! })

    function onPress(event: GestureResponderEvent) {
        onPressProp?.(event)
        onCheckedChange(!checked)
    }

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLButtonElement
            augRef.dataset.state = checked ? 'checked' : 'unchecked'
            augRef.value = checked ? 'on' : 'off'
        }
    }, [checked])

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLButtonElement
            augRef.type = 'button'
            augRef.role = 'checkbox'

            if (disabled) {
                augRef.dataset.disabled = 'true'
            } else {
                augRef.dataset.disabled = undefined
            }
        }
    }, [disabled])

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <CheckboxContext.Provider value={{ checked, disabled, onCheckedChange }}>
            <Checkbox.Root
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                asChild
            >
                <Component
                    ref={augmentedRef}
                    role="button"
                    onPress={onPress}
                    disabled={disabled}
                    {...props}
                />
            </Checkbox.Root>
        </CheckboxContext.Provider>
    )
}

Root.displayName = ROOT_NAME

function useCheckboxContext() {
    const context = React.useContext(CheckboxContext)
    if (context === null) {
        throw new Error(
            'Checkbox compound components cannot be rendered outside the Checkbox component',
        )
    }
    return context
}

const INDICATOR_NAME = 'CheckboxIndicator.Web'

const Indicator = ({ ref, asChild, forceMount, ...props }: CheckboxIndicatorProps) => {
    const { checked, disabled } = useCheckboxContext()
    const augmentedRef = useAugmentedRef({ ref: ref! })

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLDivElement
            augRef.dataset.state = checked ? 'checked' : 'unchecked'
        }
    }, [checked])

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLDivElement
            if (disabled) {
                augRef.dataset.disabled = 'true'
            } else {
                augRef.dataset.disabled = undefined
            }
        }
    }, [disabled])

    const Component = asChild ? Slot.View : View
    return (
        <Checkbox.Indicator forceMount={forceMount} asChild>
            <Component ref={ref} {...props} />
        </Checkbox.Indicator>
    )
}

Indicator.displayName = INDICATOR_NAME

export { Indicator, Root }
