import * as React from 'react'
import { View, type GestureResponderEvent } from 'react-native'

import { Pressable } from '../pressable'
import { Slot } from '../slot'
import type { ContentProps, ListProps, RootProps, TriggerProps } from './tabs.types'

interface RootContext extends RootProps {
    nativeID: string
}

const TabsContext = React.createContext<RootContext | null>(null)

const Root = ({
    ref,
    asChild,
    value,
    onValueChange,
    orientation: _orientation,
    dir: _dir,
    activationMode: _activationMode,
    ...viewProps
}: RootProps) => {
    const nativeID = React.useId()
    const Component = asChild ? Slot.View : View
    return (
        <TabsContext.Provider
            value={{
                value,
                onValueChange,
                nativeID,
            }}
        >
            <Component ref={ref} {...viewProps} />
        </TabsContext.Provider>
    )
}

Root.displayName = 'TabsRoot.Native'

function useRootContext() {
    const context = React.useContext(TabsContext)
    if (!context) {
        throw new Error('Tabs compound components cannot be rendered outside the Tabs component')
    }
    return context
}

const List = ({ ref, asChild, ...props }: ListProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="tablist" {...props} />
}

List.displayName = 'TabsList.Native'

const TriggerContext = React.createContext<{ value: string } | null>(null)

const Trigger = ({
    ref,
    asChild,
    onPress: onPressProp,
    disabled,
    value: tabValue,
    ...props
}: TriggerProps) => {
    const { onValueChange, value: rootValue, nativeID } = useRootContext()

    function onPress(ev: GestureResponderEvent) {
        if (disabled) return
        onValueChange(tabValue)
        onPressProp?.(ev)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <TriggerContext.Provider value={{ value: tabValue }}>
            <Component
                ref={ref}
                nativeID={`${nativeID}-tab-${tabValue}`}
                aria-disabled={!!disabled}
                aria-selected={rootValue === tabValue}
                role="tab"
                onPress={onPress}
                accessibilityState={{
                    selected: rootValue === tabValue,
                    disabled: !!disabled,
                }}
                disabled={!!disabled}
                {...props}
            />
        </TriggerContext.Provider>
    )
}

Trigger.displayName = 'TabsTrigger.Native'

function useTriggerContext() {
    const context = React.useContext(TriggerContext)
    if (!context) {
        throw new Error(
            'Tabs.Trigger compound components cannot be rendered outside the Tabs.Trigger component',
        )
    }
    return context
}

const Content = ({ ref, asChild, forceMount, value: tabValue, ...props }: ContentProps) => {
    const { value: rootValue, nativeID } = useRootContext()

    if (!forceMount && rootValue !== tabValue) return null

    const Component = asChild ? Slot.View : View

    return (
        <Component
            ref={ref}
            aria-hidden={!(forceMount || rootValue === tabValue)}
            aria-labelledby={`${nativeID}-tab-${tabValue}`}
            role="tabpanel"
            {...props}
        />
    )
}

Content.displayName = 'TabsContent.Native'

export { Content, List, Root, Trigger, useRootContext, useTriggerContext }
