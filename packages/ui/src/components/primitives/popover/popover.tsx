import * as React from 'react'
import {
    BackHandler,
    View,
    type GestureResponderEvent,
    type LayoutChangeEvent,
    type LayoutRectangle,
} from 'react-native'

import { useAugmentedRef, useRelativePosition } from '../../../hooks'
import { LayoutPosition } from '../../../hooks/use-relative-position'
import { Portal as RNPPortal } from '../portal'
import { Pressable } from '../pressable'
import { Slot } from '../slot'
import type {
    CloseProps,
    ContentProps,
    OverlayProps,
    PortalProps,
    RootProps,
    TriggerProps,
} from './popover.types'

interface IRootContext {
    open: boolean
    onOpenChange: (open: boolean) => void
    triggerPosition: LayoutPosition | null
    setTriggerPosition: (triggerPosition: LayoutPosition | null) => void
    contentLayout: LayoutRectangle | null
    setContentLayout: (contentLayout: LayoutRectangle | null) => void
    nativeID: string
}

const RootContext = React.createContext<IRootContext | null>(null)

const Root = ({ ref, asChild, onOpenChange: onOpenChangeProp, ...viewProps }: RootProps) => {
    const nativeID = React.useId()
    const [triggerPosition, setTriggerPosition] = React.useState<LayoutPosition | null>(null)
    const [contentLayout, setContentLayout] = React.useState<LayoutRectangle | null>(null)
    const [open, setOpen] = React.useState(false)

    function onOpenChange(value: boolean) {
        setOpen(value)
        onOpenChangeProp?.(value)
    }

    const Component = asChild ? Slot.View : View
    return (
        <RootContext.Provider
            value={{
                open,
                onOpenChange,
                contentLayout,
                nativeID,
                setContentLayout,
                setTriggerPosition,
                triggerPosition,
            }}
        >
            <Component ref={ref} {...viewProps} />
        </RootContext.Provider>
    )
}

Root.displayName = 'PopoverRoot.Native'

function useRootContext() {
    const context = React.useContext(RootContext)
    if (!context) {
        throw new Error(
            'Popover compound components cannot be rendered outside the Popover component',
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
    const { onOpenChange, open, setTriggerPosition } = useRootContext()

    const augmentedRef = useAugmentedRef({
        ref,
        methods: {
            open: () => {
                onOpenChange(true)
                augmentedRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
                    setTriggerPosition({ width, pageX, pageY: pageY, height })
                })
            },
            close: () => {
                setTriggerPosition(null)
                onOpenChange(false)
            },
        },
    })

    function onPress(ev: GestureResponderEvent) {
        if (disabled) return
        augmentedRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
            setTriggerPosition({ width, pageX, pageY: pageY, height })
        })
        onOpenChange(!open)
        onPressProp?.(ev)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Component
            ref={augmentedRef}
            aria-disabled={disabled ?? undefined}
            role="button"
            onPress={onPress}
            disabled={disabled ?? undefined}
            {...props}
        />
    )
}

Trigger.displayName = 'PopoverTrigger.Native'

/**
 * @warning when using a custom `<PortalHost />`, you might have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }: PortalProps) {
    const value = useRootContext()

    if (!value.triggerPosition) {
        return null
    }

    if (!forceMount) {
        if (!value.open) {
            return null
        }
    }

    return (
        <RNPPortal hostName={hostName} name={`${value.nativeID}_portal`}>
            <RootContext.Provider value={value}>{children}</RootContext.Provider>
        </RNPPortal>
    )
}

const Overlay = ({
    ref,
    asChild,
    forceMount,
    onPress: OnPressProp,
    closeOnPress = true,
    ...props
}: OverlayProps) => {
    const { open, onOpenChange, setTriggerPosition, setContentLayout } = useRootContext()

    function onPress(ev: GestureResponderEvent) {
        if (closeOnPress) {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
        }
        OnPressProp?.(ev)
    }

    if (!forceMount) {
        if (!open) {
            return null
        }
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return <Component ref={ref} onPress={onPress} {...props} />
}

Overlay.displayName = 'PopoverOverlay.Native'

/**
 * @info `position`, `top`, `left`, and `maxWidth` style properties are controlled internally. Opt out of this behavior by setting `disablePositioningStyle` to `true`.
 */
const Content = ({
    ref,
    asChild = false,
    forceMount,
    align = 'start',
    side = 'bottom',
    sideOffset = 0,
    alignOffset = 0,
    avoidCollisions = true,
    onLayout: onLayoutProp,
    insets,
    style,
    disablePositioningStyle,
    onOpenAutoFocus: _onOpenAutoFocus,
    ...props
}: ContentProps) => {
    const {
        open,
        onOpenChange,
        contentLayout,
        nativeID,
        setContentLayout,
        setTriggerPosition,
        triggerPosition,
    } = useRootContext()

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
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

    if (!forceMount && !open) return null

    const Component = asChild ? Slot.View : View

    return (
        <Component
            ref={ref}
            role="dialog"
            nativeID={nativeID}
            aria-modal={true}
            style={[positionStyle, style]}
            onLayout={onLayout}
            onStartShouldSetResponder={onStartShouldSetResponder}
            {...props}
        />
    )
}

Content.displayName = 'PopoverContent.Native'

const Close = ({ ref, asChild, onPress: onPressProp, disabled = false, ...props }: CloseProps) => {
    const { onOpenChange, setContentLayout, setTriggerPosition } = useRootContext()

    function onPress(ev: GestureResponderEvent) {
        if (disabled) return
        setTriggerPosition(null)
        setContentLayout(null)
        onOpenChange(false)
        onPressProp?.(ev)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={ref}
            aria-disabled={disabled ?? undefined}
            role="button"
            onPress={onPress}
            disabled={disabled ?? undefined}
            {...props}
        />
    )
}

Close.displayName = 'PopoverClose.Native'

export { Close, Content, Overlay, Portal, Root, Trigger, useRootContext }

function onStartShouldSetResponder() {
    return true
}
