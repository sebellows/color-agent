import * as React from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'

import { NavigationMenu } from 'radix-ui'

import { useAugmentedRef, useIsomorphicLayoutEffect } from '../../../hooks'
import { EmptyGestureResponderEvent } from '../../../utils'
import { Slot } from '../slot'
import type {
    ContentProps,
    IndicatorProps,
    ItemProps,
    LinkProps,
    ListProps,
    PortalProps,
    RootProps,
    TriggerProps,
    ViewportProps,
} from './navigation-menu.types'

const NavigationMenuContext = React.createContext<RootProps | null>(null)

const Root = ({
    ref,
    asChild,
    value,
    onValueChange,
    delayDuration,
    skipDelayDuration,
    dir,
    orientation,
    ...viewProps
}: RootProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <NavigationMenuContext.Provider value={{ value, onValueChange, orientation }}>
            <NavigationMenu.Root
                value={value}
                onValueChange={onValueChange}
                delayDuration={delayDuration}
                skipDelayDuration={skipDelayDuration}
                dir={dir}
                orientation={orientation}
            >
                <Component ref={ref} {...viewProps} />
            </NavigationMenu.Root>
        </NavigationMenuContext.Provider>
    )
}

Root.displayName = 'NavigationMenuRoot.Web'

function useRootContext() {
    const context = React.useContext(NavigationMenuContext)
    if (!context) {
        throw new Error(
            'NavigationMenu compound components cannot be rendered outside the NavigationMenu component',
        )
    }
    return context
}

const List = ({ ref, asChild, ...viewProps }: ListProps) => {
    const augmentedRef = useAugmentedRef({ ref })
    const { orientation } = useRootContext()

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLDivElement
            augRef.dataset.orientation = orientation
        }
    }, [orientation])

    const Component = asChild ? Slot.View : View
    return (
        <NavigationMenu.List asChild>
            <Component ref={ref} {...viewProps} />
        </NavigationMenu.List>
    )
}

List.displayName = 'NavigationMenuList.Web'

const ItemContext = React.createContext<ItemProps | null>(null)

const Item = ({ ref, asChild, value, ...props }: ItemProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <ItemContext.Provider value={{ value }}>
            <NavigationMenu.Item value={value} asChild>
                <Component ref={ref} {...props} />
            </NavigationMenu.Item>
        </ItemContext.Provider>
    )
}

Item.displayName = 'NavigationMenuItem.Web'

function useItemContext() {
    const context = React.useContext(ItemContext)
    if (!context) {
        throw new Error(
            'NavigationMenu compound components cannot be rendered outside the NavigationMenu component',
        )
    }
    return context
}

const Trigger = ({
    ref,
    asChild,
    onPress: onPressProp,
    disabled = false,
    onKeyDown: onKeyDownProp,
    ...props
}: TriggerProps) => {
    const { value: rootValue, onValueChange } = useRootContext()
    const { value } = useItemContext()
    function onKeyDown(ev: React.KeyboardEvent) {
        onKeyDownProp?.(ev)
        if (ev.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent)
            onValueChange(value === rootValue ? '' : value)
        }
    }

    function onPress(ev: GestureResponderEvent) {
        onPressProp?.(ev)
        onValueChange(value === rootValue ? '' : value)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <NavigationMenu.Trigger disabled={disabled ?? undefined} asChild>
            <Component
                ref={ref}
                // @ts-expect-error web only
                onKeyDown={onKeyDown}
                onPress={onPress}
                {...props}
            />
        </NavigationMenu.Trigger>
    )
}

Trigger.displayName = 'NavigationMenuTrigger.Web'

function Portal({ children }: PortalProps) {
    return <>{children}</>
}

const Content = ({
    ref,
    asChild = false,
    forceMount,
    align: _align,
    side: _side,
    sideOffset: _sideOffset,
    alignOffset: _alignOffset,
    avoidCollisions: _avoidCollisions,
    onLayout: onLayoutProp,
    insets: _insets,
    disablePositioningStyle: _disablePositioningStyle,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    ...props
}: ContentProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <NavigationMenu.Content
            forceMount={forceMount}
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            onFocusOutside={onFocusOutside}
            onInteractOutside={onInteractOutside}
        >
            <Component ref={ref} {...props} />
        </NavigationMenu.Content>
    )
}

Content.displayName = 'NavigationMenuContent.Web'

const Link = ({
    ref,
    asChild,
    active,
    onPress: onPressProp,
    onKeyDown: onKeyDownProp,
    ...props
}: LinkProps) => {
    const { onValueChange } = useRootContext()

    function onKeyDown(ev: React.KeyboardEvent) {
        onKeyDownProp?.(ev)
        if (ev.key === 'Enter' || ev.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent)
            onValueChange('')
        }
    }

    function onPress(ev: GestureResponderEvent) {
        onPressProp?.(ev)
        onValueChange('')
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <NavigationMenu.Link active={active} asChild>
            <Component
                ref={ref}
                role="link"
                // @ts-expect-error web only
                onKeyDown={onKeyDown}
                onPress={onPress}
                {...props}
            />
        </NavigationMenu.Link>
    )
}

Link.displayName = 'NavigationMenuLink.Web'

const Viewport = ({ ref, ...props }: ViewportProps) => {
    return (
        <Slot.View ref={ref} {...props}>
            <NavigationMenu.Viewport />
        </Slot.View>
    )
}

Viewport.displayName = 'NavigationMenuViewport.Web'

const Indicator = ({ ref, asChild, ...props }: IndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <NavigationMenu.Indicator asChild>
            <Component ref={ref} {...props} />
        </NavigationMenu.Indicator>
    )
}

Indicator.displayName = 'NavigationMenuIndicator.Web'

export {
    Content,
    Indicator,
    Item,
    Link,
    List,
    Portal,
    Root,
    Trigger,
    useItemContext,
    useRootContext,
    Viewport,
}
