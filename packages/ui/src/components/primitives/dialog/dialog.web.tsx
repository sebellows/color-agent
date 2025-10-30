import React from 'react'
import { Pressable, Text, View, type GestureResponderEvent } from 'react-native'

import { Dialog } from 'radix-ui'

import { useAugmentedRef, useControllableState, useIsomorphicLayoutEffect } from '../hooks'
import { Slot } from '../slot'
import type {
    CloseProps,
    ContentProps,
    DescriptionProps,
    OverlayProps,
    PortalProps,
    RootContext,
    RootProps,
    TitleProps,
    TriggerProps,
} from './dialog.types'

const DialogContext = React.createContext<RootContext | null>(null)

const Root = ({
    ref,
    asChild,
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

    const Component = asChild ? Slot.View : View

    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
                <Component ref={ref} {...viewProps} />
            </Dialog.Root>
        </DialogContext.Provider>
    )
}

Root.displayName = 'DialogRoot.Web'

function useRootContext() {
    const context = React.useContext(DialogContext)
    if (!context) {
        throw new Error(
            'Dialog compound components cannot be rendered outside the Dialog component',
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
    const augmentedRef = useAugmentedRef({ ref })
    const { onOpenChange, open } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        onPressProp?.(event)
        onOpenChange(!open)
    }

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return
        const augRef = augmentedRef.current as unknown as HTMLButtonElement
        augRef.dataset.state = open ? 'open' : 'closed'
        augRef.type = 'button'
    }, [open])

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Dialog.Trigger disabled={disabled ?? undefined} asChild>
            <Component
                ref={augmentedRef}
                onPress={onPress}
                role="button"
                disabled={disabled}
                {...props}
            />
        </Dialog.Trigger>
    )
}

Trigger.displayName = 'DialogTrigger.Web'

function Portal({ forceMount, container, children }: PortalProps) {
    return <Dialog.Portal forceMount={forceMount} children={children} container={container} />
}

const Overlay = ({ ref, asChild, forceMount, ...props }: OverlayProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Dialog.Overlay forceMount={forceMount}>
            <Component ref={ref} {...props} />
        </Dialog.Overlay>
    )
}

Overlay.displayName = 'DialogOverlay.Web'

const Content = ({
    ref,
    asChild,
    forceMount,
    onOpenAutoFocus,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onInteractOutside,
    onPointerDownOutside,
    ...props
}: ContentProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <Dialog.Content
            onOpenAutoFocus={onOpenAutoFocus}
            onCloseAutoFocus={onCloseAutoFocus}
            onEscapeKeyDown={onEscapeKeyDown}
            onInteractOutside={onInteractOutside}
            onPointerDownOutside={onPointerDownOutside}
            forceMount={forceMount}
        >
            <Component ref={ref} {...props} />
        </Dialog.Content>
    )
}

Content.displayName = 'DialogContent.Web'

const Close = ({ ref, asChild, onPress: onPressProp, disabled, ...props }: CloseProps) => {
    const augmentedRef = useAugmentedRef({ ref })
    const { onOpenChange, open } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        onPressProp?.(event)
        onOpenChange(!open)
    }

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return
        const augRef = augmentedRef.current as unknown as HTMLButtonElement
        augRef.type = 'button'
    }, [])

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <>
            <Dialog.Close disabled={disabled ?? undefined} asChild>
                <Component
                    ref={augmentedRef}
                    onPress={onPress}
                    role="button"
                    disabled={disabled}
                    {...props}
                />
            </Dialog.Close>
        </>
    )
}

Close.displayName = 'DialogClose.Web'

const Title = ({ ref, asChild, ...props }: TitleProps) => {
    const Component = asChild ? Slot.Text : Text

    return (
        <Dialog.Title asChild>
            <Component ref={ref} {...props} />
        </Dialog.Title>
    )
}

Title.displayName = 'DialogTitle.Web'

const Description = ({ ref, asChild, ...props }: DescriptionProps) => {
    const Component = asChild ? Slot.Text : Text

    return (
        <Dialog.Description asChild>
            <Component ref={ref} {...props} />
        </Dialog.Description>
    )
}

Description.displayName = 'DialogDescription.Web'

export { Close, Content, Description, Overlay, Portal, Root, Title, Trigger, useRootContext }
