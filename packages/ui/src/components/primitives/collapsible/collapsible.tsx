import * as React from 'react'
import { View, type GestureResponderEvent } from 'react-native'

import { useControllableState } from '../hooks'
import { Pressable } from '../pressable'
import { Slot } from '../slot'
import type { ContentProps, RootContext, RootProps, TriggerProps } from './collapsible.types'

const CollapsibleContext = React.createContext<(RootContext & { nativeID: string }) | null>(null)

const Root = ({
    ref,
    asChild,
    disabled = false,
    open: openProp,
    defaultOpen,
    onOpenChange: onOpenChangeProp,
    ...viewProps
}: RootProps) => {
    const nativeID = React.useId()
    const [open = false, onOpenChange] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChangeProp,
    })

    const Component = asChild ? Slot.View : View
    return (
        <CollapsibleContext.Provider
            value={{
                disabled,
                open,
                onOpenChange,
                nativeID,
            }}
        >
            <Component ref={ref} {...viewProps} />
        </CollapsibleContext.Provider>
    )
}

Root.displayName = 'CollapsibleRoot.Native'

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
    const { disabled, open, onOpenChange, nativeID } = useCollapsibleContext()

    function onPress(event: GestureResponderEvent) {
        if (disabled || disabledProp) return
        onOpenChange(!open)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Component
            ref={ref}
            nativeID={nativeID}
            aria-disabled={(disabled || disabledProp) ?? undefined}
            role="button"
            onPress={onPress}
            accessibilityState={{
                expanded: open,
                disabled: (disabled || disabledProp) ?? undefined,
            }}
            disabled={disabled || disabledProp}
            {...props}
        />
    )
}

Trigger.displayName = 'CollapsibleTrigger.Native'

const Content = ({ ref, asChild, forceMount, ...props }: ContentProps) => {
    const { nativeID, open } = useCollapsibleContext()

    if (!forceMount && !open) return null

    const Component = asChild ? Slot.View : View

    return (
        <Component
            ref={ref}
            aria-hidden={!(forceMount || open)}
            aria-labelledby={nativeID}
            role={'region'}
            {...props}
        />
    )
}

Content.displayName = 'CollapsibleContent.Native'

export { Content, Root, Trigger }
