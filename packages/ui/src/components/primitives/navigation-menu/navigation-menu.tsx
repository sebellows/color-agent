import * as React from 'react'
import {
    BackHandler,
    Pressable,
    View,
    type GestureResponderEvent,
    type LayoutChangeEvent,
    type LayoutRectangle,
} from 'react-native'

import { useRelativePosition, type LayoutPosition } from '../../../hooks'
import { Portal as RNPPortal } from '../portal'
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

interface INavigationMenuRootContext extends RootProps {
    triggerPosition: LayoutPosition | null
    setTriggerPosition: (triggerPosition: LayoutPosition | null) => void
    contentLayout: LayoutRectangle | null
    setContentLayout: (contentLayout: LayoutRectangle | null) => void
    nativeID: string
}

const RootContext = React.createContext<INavigationMenuRootContext | null>(null)

const Root = ({ ref, asChild, value, onValueChange, ...viewProps }: RootProps) => {
    const nativeID = React.useId()
    const [triggerPosition, setTriggerPosition] = React.useState<LayoutPosition | null>(null)
    const [contentLayout, setContentLayout] = React.useState<LayoutRectangle | null>(null)

    const Component = asChild ? Slot.View : View
    return (
        <RootContext.Provider
            value={{
                value,
                onValueChange,
                nativeID,
                contentLayout,
                setContentLayout,
                setTriggerPosition,
                triggerPosition,
            }}
        >
            <Component ref={ref} role="navigation" {...viewProps} />
        </RootContext.Provider>
    )
}

Root.displayName = 'NavigationMenuRoot.Native'

function useRootContext() {
    const context = React.useContext(RootContext)
    if (!context) {
        throw new Error(
            'NavigationMenu compound components cannot be rendered outside the NavigationMenu component',
        )
    }
    return context
}

const List = ({ ref, asChild, ...viewProps }: ListProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="menubar" {...viewProps} />
}

List.displayName = 'NavigationMenuList.Native'

const ItemContext = React.createContext<(ItemProps & { nativeID: string }) | null>(null)

const Item = ({ ref, asChild, value, ...viewProps }: ItemProps) => {
    const nativeID = React.useId()

    const Component = asChild ? Slot.View : View

    return (
        <ItemContext.Provider
            value={{
                value,
                nativeID,
            }}
        >
            <Component ref={ref} role="menuitem" {...viewProps} />
        </ItemContext.Provider>
    )
}

Item.displayName = 'NavigationMenuItem.Native'

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
    ...props
}: TriggerProps) => {
    const triggerRef = React.useRef<View>(null)
    const { value, onValueChange, setTriggerPosition } = useRootContext()
    const { value: menuValue } = useItemContext()

    React.useImperativeHandle(
        ref,
        () => {
            if (!triggerRef.current) {
                return new View({})
            }
            return triggerRef.current
        },
        [triggerRef.current],
    )

    function onPress(ev: GestureResponderEvent) {
        if (disabled) return
        triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
            setTriggerPosition({ width, pageX, pageY: pageY, height })
        })

        onValueChange(menuValue === value ? '' : menuValue)
        onPressProp?.(ev)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Component
            ref={triggerRef}
            aria-disabled={disabled ?? undefined}
            role="button"
            onPress={onPress}
            disabled={disabled ?? undefined}
            aria-expanded={value === menuValue}
            {...props}
        />
    )
}

Trigger.displayName = 'NavigationMenuTrigger.Native'

/**
 * @warning when using a custom `<PortalHost />`, you will have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }: PortalProps) {
    const navigationMenu = useRootContext()
    const item = useItemContext()

    if (!navigationMenu.triggerPosition) {
        return null
    }

    if (!forceMount && navigationMenu.value !== item.value) return null

    return (
        <RNPPortal hostName={hostName} name={`${navigationMenu.nativeID}_portal_provider`}>
            <RootContext.Provider
                value={navigationMenu}
                key={`RootContext_${navigationMenu.nativeID}_portal_provider`}
            >
                <ItemContext.Provider value={item}>{children}</ItemContext.Provider>
            </RootContext.Provider>
        </RNPPortal>
    )
}

/**
 * @info `position`, `top`, `left`, and `maxWidth` style properties are controlled internally. Opt out of this behavior by setting `disablePositioningStyle` to `true`.
 */
const Content = ({
    ref,
    asChild = false,
    forceMount,
    align = 'center',
    side = 'bottom',
    sideOffset = 0,
    alignOffset = 0,
    avoidCollisions = true,
    onLayout: onLayoutProp,
    insets,
    style,
    disablePositioningStyle,
    ...props
}: ContentProps) => {
    const {
        value,
        onValueChange,
        triggerPosition,
        setTriggerPosition,
        contentLayout,
        setContentLayout,
    } = useRootContext()
    const { value: menuValue, nativeID } = useItemContext()

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setTriggerPosition(null)
            setContentLayout(null)
            onValueChange('')
            return true
        })

        return () => {
            setContentLayout(null)
            backHandler.remove()
        }
    }, [])

    const positionStyle = useRelativePosition({
        align,
        avoidCollisions,
        triggerPosition,
        contentLayout,
        alignOffset,
        insets,
        sideOffset,
        side,
        disablePositioningStyle,
    })

    function onLayout(event: LayoutChangeEvent) {
        setContentLayout(event.nativeEvent.layout)
        onLayoutProp?.(event)
    }

    if (!forceMount && value !== menuValue) return null

    const Component = asChild ? Slot.View : View

    return (
        <Component
            ref={ref}
            role="menu"
            nativeID={nativeID}
            aria-modal={true}
            style={[positionStyle, style]}
            onLayout={onLayout}
            onStartShouldSetResponder={onStartShouldSetResponder}
            {...props}
        />
    )
}

Content.displayName = 'NavigationMenuContent.Native'

const Link = ({ ref, asChild, ...props }: LinkProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} role="link" {...props} />
}

Link.displayName = 'NavigationMenuLink.Native'

const Viewport = ({ ref, ...props }: ViewportProps) => {
    return <View ref={ref} {...props} />
}

Viewport.displayName = 'NavigationMenuViewport.Native'

const Indicator = ({ ref, asChild, ...props }: IndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return <Component ref={ref} {...props} />
}

Indicator.displayName = 'NavigationMenuIndicator.Native'

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

function onStartShouldSetResponder() {
    return true
}
