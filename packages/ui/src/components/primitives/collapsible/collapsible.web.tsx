import * as React from 'react'
import { Pressable, View, type GestureResponderEvent } from 'react-native'

import { Collapsible } from 'radix-ui'

import { useAugmentedRef, useControllableState, useIsomorphicLayoutEffect } from '../../../hooks'
import { Slot } from '../slot'
import type { ContentProps, RootContext, RootProps, TriggerProps } from './collapsible.types'

const CollapsibleContext = React.createContext<RootContext | null>(null)

const Root = ({
    ref,
    asChild,
    disabled = false,
    open: openProp,
    defaultOpen,
    onOpenChange: onOpenChangeProp,
    ...viewProps
}: RootProps) => {
    const [open = false, onOpenChange] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChangeProp,
    })
    const augmentedRef = useAugmentedRef({ ref })

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return
        const augRef = augmentedRef.current as unknown as HTMLDivElement
        augRef.dataset.state = open ? 'open' : 'closed'
    }, [open])

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return
        const augRef = augmentedRef.current as unknown as HTMLDivElement
        augRef.dataset.disabled = disabled ? 'true' : undefined
    }, [disabled])

    const Component = asChild ? Slot.View : View
    return (
        <CollapsibleContext.Provider
            value={{
                disabled,
                open,
                onOpenChange,
            }}
        >
            <Collapsible.Root
                open={open}
                defaultOpen={defaultOpen}
                onOpenChange={onOpenChange}
                disabled={disabled}
            >
                <Component ref={ref} {...viewProps} />
            </Collapsible.Root>
        </CollapsibleContext.Provider>
    )
}

Root.displayName = 'CollapsibleRoot.Web'

function useCollapsibleContext() {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
        throw new Error(
            'Collapsible compound components cannot be rendered outside the Collapsible component',
        )
    }
    return context
}

const Trigger = ({
    ref,
    asChild,
    onPress: onPressProp,
    disabled: disabledProp = false,
    ...props
}: TriggerProps) => {
    const { disabled, open, onOpenChange } = useCollapsibleContext()
    const augmentedRef = useAugmentedRef({ ref })

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return
        const augRef = augmentedRef.current as unknown as HTMLButtonElement
        augRef.dataset.state = open ? 'open' : 'closed'
    }, [open])

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return

        const augRef = augmentedRef.current as unknown as HTMLButtonElement
        augRef.type = 'button'

        augRef.dataset.disabled = disabled ? 'true' : undefined
    }, [disabled])

    function onPress(ev: GestureResponderEvent) {
        onPressProp?.(ev)
        onOpenChange(!open)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Collapsible.Trigger disabled={disabled} asChild>
            <Component
                ref={augmentedRef}
                role="button"
                onPress={onPress}
                disabled={disabled}
                {...props}
            />
        </Collapsible.Trigger>
    )
}

Trigger.displayName = 'CollapsibleTrigger.Web'

const Content = ({ ref, asChild, forceMount, ...props }: ContentProps) => {
    const augmentedRef = useAugmentedRef({ ref })
    const { open } = useCollapsibleContext()

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return
        const augRef = augmentedRef.current as unknown as HTMLDivElement
        augRef.dataset.state = open ? 'open' : 'closed'
    }, [open])

    const Component = asChild ? Slot.View : View

    return (
        <Collapsible.Content forceMount={forceMount} asChild>
            <Component ref={augmentedRef} {...props} />
        </Collapsible.Content>
    )
}

Content.displayName = 'CollapsibleContent.Web'

export { Content, Root, Trigger }
