import React from 'react'
import { Pressable, View } from 'react-native'

import { Tabs } from 'radix-ui'

import { Slot } from '../slot'
import type { ContentProps, ListProps, RootProps, TriggerProps } from './tabs.types'

const TabsContext = React.createContext<RootProps | null>(null)
const Root = ({
    ref,
    asChild,
    value,
    onValueChange,
    orientation,
    dir,
    activationMode,
    ...viewProps
}: RootProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <TabsContext.Provider
            value={{
                value,
                onValueChange,
            }}
        >
            <Tabs.Root
                value={value}
                onValueChange={onValueChange}
                orientation={orientation}
                dir={dir}
                activationMode={activationMode}
                asChild
            >
                <Component ref={ref} {...viewProps} />
            </Tabs.Root>
        </TabsContext.Provider>
    )
}

Root.displayName = 'TabsRoot.Web'

function useRootContext() {
    const context = React.useContext(TabsContext)
    if (!context) {
        throw new Error('Tabs compound components cannot be rendered outside the Tabs component')
    }
    return context
}

const List = ({ ref, asChild, ...props }: ListProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <Tabs.List asChild>
            <Component ref={ref} {...props} />
        </Tabs.List>
    )
}

List.displayName = 'TabsList.Web'

const TriggerContext = React.createContext<{ value: string } | null>(null)

const Trigger = ({ ref, asChild, value: tabValue, ...props }: TriggerProps) => {
    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <TriggerContext.Provider value={{ value: tabValue }}>
            <Tabs.Trigger value={tabValue} asChild>
                <Component ref={ref} {...props} />
            </Tabs.Trigger>
        </TriggerContext.Provider>
    )
}

Trigger.displayName = 'TabsTrigger.Web'

function useTriggerContext() {
    const context = React.useContext(TriggerContext)
    if (!context) {
        throw new Error(
            'Tabs.Trigger compound components cannot be rendered outside the Tabs.Trigger component',
        )
    }
    return context
}

const Content = ({ ref, asChild, forceMount, value, tabIndex = -1, ...props }: ContentProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <Tabs.Content value={value} asChild>
            <Component ref={ref} {...props} tabIndex={tabIndex} />
        </Tabs.Content>
    )
}

Content.displayName = 'TabsContent.Web'

export { Content, List, Root, Trigger, useRootContext, useTriggerContext }
