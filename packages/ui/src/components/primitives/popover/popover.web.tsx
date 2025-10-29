import * as React from 'react'
import { Pressable, View, type GestureResponderEvent } from 'react-native'

import { Popover } from 'radix-ui'

import { useAugmentedRef, useIsomorphicLayoutEffect } from '../../../hooks'
import { Slot } from '../slot'
import type {
    CloseProps,
    ContentProps,
    OverlayProps,
    PortalProps,
    RootProps,
    TriggerProps,
} from './popover.types'

const RootContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
} | null>(null)

const Root = ({
    ref,
    asChild,
    onOpenChange: onOpenChangeProp,
    ...viewProps
}: RootProps & { onOpenChange?: (open: boolean) => void }) => {
    const [open, setOpen] = React.useState(false)

    function onOpenChange(value: boolean) {
        setOpen(value)
        onOpenChangeProp?.(value)
    }

    const Component = asChild ? Slot.View : View

    return (
        <RootContext.Provider value={{ open, onOpenChange }}>
            <Popover.Root open={open} onOpenChange={onOpenChange}>
                <Component ref={ref} {...viewProps} />
            </Popover.Root>
        </RootContext.Provider>
    )
}

Root.displayName = 'PopoverRoot.Web'

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
    role: _role,
    disabled,
    ...props
}: TriggerProps) => {
    const { onOpenChange, open } = useRootContext()
    const augmentedRef = useAugmentedRef({
        ref,
        methods: {
            open() {
                onOpenChange(true)
            },
            close() {
                onOpenChange(false)
            },
        },
    })

    function onPress(ev: GestureResponderEvent) {
        if (onPressProp) {
            onPressProp(ev)
        }
        onOpenChange(!open)
    }

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLButtonElement
            augRef.dataset.state = open ? 'open' : 'closed'
            augRef.type = 'button'
        }
    }, [open])

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Popover.Trigger disabled={disabled ?? undefined} asChild>
            <Component
                ref={augmentedRef}
                onPress={onPress}
                role="button"
                disabled={disabled}
                {...props}
            />
        </Popover.Trigger>
    )
}

Trigger.displayName = 'PopoverTrigger.Web'

function Portal({ forceMount, container, children }: PortalProps) {
    return <Popover.Portal forceMount={forceMount} children={children} container={container} />
}

const Overlay = ({ ref, asChild, forceMount, ...props }: OverlayProps) => {
    const Component = asChild ? Slot.Pressable : Pressable
    return <Component ref={ref} {...props} />
}

Overlay.displayName = 'PopoverOverlay.Web'

const Content = ({
    ref,
    asChild = false,
    forceMount,
    align = 'start',
    side = 'bottom',
    sideOffset = 0,
    alignOffset = 0,
    avoidCollisions = true,
    insets: _insets,
    disablePositioningStyle: _disablePositioningStyle,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onInteractOutside,
    onPointerDownOutside,
    onOpenAutoFocus,
    ...props
}: ContentProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Popover.Content
            onCloseAutoFocus={onCloseAutoFocus}
            onEscapeKeyDown={onEscapeKeyDown}
            onInteractOutside={onInteractOutside}
            onPointerDownOutside={onPointerDownOutside}
            forceMount={forceMount}
            align={align}
            side={side}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            avoidCollisions={avoidCollisions}
            onOpenAutoFocus={onOpenAutoFocus}
        >
            <Component ref={ref} {...props} />
        </Popover.Content>
    )
}

Content.displayName = 'PopoverContent.Web'

const Close = ({ ref, asChild, onPress: onPressProp, disabled, ...props }: CloseProps) => {
    const augmentedRef = useAugmentedRef({ ref })
    const { onOpenChange, open } = useRootContext()

    function onPress(ev: GestureResponderEvent) {
        if (onPressProp) {
            onPressProp(ev)
        }
        onOpenChange(!open)
    }

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLButtonElement
            augRef.type = 'button'
        }
    }, [])

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <>
            <Popover.Close disabled={disabled ?? undefined} asChild>
                <Component
                    ref={augmentedRef}
                    onPress={onPress}
                    role="button"
                    disabled={disabled}
                    {...props}
                />
            </Popover.Close>
        </>
    )
}

Close.displayName = 'PopoverClose.Web'

export { Close, Content, Overlay, Portal, Root, Trigger, useRootContext }
