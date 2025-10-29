import * as React from 'react'
import { Pressable, View } from 'react-native'

import { HoverCard } from 'radix-ui'

import { useAugmentedRef } from '../../../hooks'
import { Slot } from '../slot'
import type {
    ContentProps,
    OverlayProps,
    PortalProps,
    RootProps,
    SharedRootContext,
    TriggerProps,
} from './hover-card.types'

const HoverCardContext = React.createContext<SharedRootContext | null>(null)

const Root = ({
    ref,
    asChild,
    openDelay,
    closeDelay,
    onOpenChange: onOpenChangeProp,
    ...viewProps
}: RootProps) => {
    const [open, setOpen] = React.useState(false)

    function onOpenChange(value: boolean) {
        setOpen(value)
        onOpenChangeProp?.(value)
    }

    const Component = asChild ? Slot.View : View

    return (
        <HoverCardContext.Provider value={{ open, onOpenChange }}>
            <HoverCard.Root
                open={open}
                onOpenChange={onOpenChange}
                openDelay={openDelay}
                closeDelay={closeDelay}
            >
                <Component ref={ref} {...viewProps} />
            </HoverCard.Root>
        </HoverCardContext.Provider>
    )
}

Root.displayName = 'HoverCardRoot.Web'

function useRootContext() {
    const context = React.useContext(HoverCardContext)
    if (!context) {
        throw new Error(
            'HoverCard compound components cannot be rendered outside the HoverCard component',
        )
    }
    return context
}

const Trigger = ({ ref, asChild, ...props }: TriggerProps) => {
    const { onOpenChange } = useRootContext()

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

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <HoverCard.Trigger asChild>
            <Component ref={augmentedRef} {...props} />
        </HoverCard.Trigger>
    )
}

Trigger.displayName = 'HoverCardTrigger.Web'

function Portal({ forceMount, container, children }: PortalProps) {
    return <HoverCard.Portal forceMount={forceMount} container={container} children={children} />
}

const Overlay = ({ ref, asChild, ...props }: OverlayProps) => {
    const Component = asChild ? Slot.Pressable : Pressable
    return <Component ref={ref} {...props} />
}

Overlay.displayName = 'HoverCardOverlay.Web'

const Content = ({
    ref,
    asChild = false,
    forceMount,
    align,
    side,
    sideOffset,
    alignOffset = 0,
    avoidCollisions = true,
    insets,
    loop: _loop,
    onCloseAutoFocus: _onCloseAutoFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    collisionBoundary,
    sticky,
    hideWhenDetached,
    ...props
}: ContentProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <HoverCard.Content
            forceMount={forceMount}
            alignOffset={alignOffset}
            avoidCollisions={avoidCollisions}
            collisionPadding={insets}
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            onFocusOutside={onFocusOutside}
            onInteractOutside={onInteractOutside}
            collisionBoundary={collisionBoundary}
            sticky={sticky}
            hideWhenDetached={hideWhenDetached}
            align={align}
            side={side}
            sideOffset={sideOffset}
        >
            <Component ref={ref} {...props} />
        </HoverCard.Content>
    )
}

Content.displayName = 'HoverCardContent.Web'

export { Content, Overlay, Portal, Root, Trigger, useRootContext }
