import * as React from 'react'
import { Pressable, Text, View, type GestureResponderEvent } from 'react-native'

import { AlertDialog } from 'radix-ui'

import { useAugmentedRef, useControllableState, useIsomorphicLayoutEffect } from '../../../hooks'
import { Slot } from '../slot'
import type {
    ActionProps,
    CancelProps,
    ContentProps,
    DescriptionProps,
    OverlayProps,
    PortalProps,
    RootContext,
    RootProps,
    TitleProps,
    TriggerProps,
} from './alert-dialog.types'

const AlertDialogContext = React.createContext<RootContext | null>(null)

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
        <AlertDialogContext.Provider
            value={{
                open,
                onOpenChange,
            }}
        >
            <AlertDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
                <Component ref={ref} {...viewProps} />
            </AlertDialog.Root>
        </AlertDialogContext.Provider>
    )
}

Root.displayName = 'AlertDialogRoot.Web'

function useRootContext() {
    const context = React.useContext(AlertDialogContext)
    if (!context) {
        throw new Error(
            'AlertDialog compound components cannot be rendered outside the AlertDialog component',
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
    const augmentedRef = useAugmentedRef({ ref })
    const { open, onOpenChange } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        onPressProp?.(event)
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
        <AlertDialog.Trigger disabled={disabled ?? undefined} asChild>
            <Component
                ref={ref}
                aria-disabled={disabled ?? undefined}
                role="button"
                onPress={onPress}
                disabled={disabled}
                {...props}
            />
        </AlertDialog.Trigger>
    )
}

Trigger.displayName = 'AlertDialogTrigger.Web'

function Portal({ forceMount, container, children }: PortalProps) {
    return <AlertDialog.Portal forceMount={forceMount} children={children} container={container} />
}

const Overlay = ({ ref, asChild, forceMount, ...props }: OverlayProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <AlertDialog.Overlay forceMount={forceMount}>
            <Component ref={ref} {...props} />
        </AlertDialog.Overlay>
    )
}

Overlay.displayName = 'AlertDialogOverlay.Web'

const Content = ({
    ref,
    asChild,
    forceMount,
    onOpenAutoFocus,
    onCloseAutoFocus,
    onEscapeKeyDown,
    ...props
}: ContentProps) => {
    const augmentedRef = useAugmentedRef({ ref })
    const { open } = useRootContext()

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLDivElement
            augRef.dataset.state = open ? 'open' : 'closed'
        }
    }, [open])

    const Component = asChild ? Slot.View : View
    return (
        <AlertDialog.Content
            onOpenAutoFocus={onOpenAutoFocus}
            onCloseAutoFocus={onCloseAutoFocus}
            onEscapeKeyDown={onEscapeKeyDown}
            forceMount={forceMount}
            asChild
        >
            <Component ref={augmentedRef} {...props} />
        </AlertDialog.Content>
    )
}

Content.displayName = 'AlertDialogContent.Web'

const Cancel = ({
    ref,
    asChild,
    onPress: onPressProp,
    disabled = false,
    ...props
}: CancelProps) => {
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
            <AlertDialog.Cancel disabled={disabled ?? undefined} asChild>
                <Component
                    ref={augmentedRef}
                    onPress={onPress}
                    role="button"
                    disabled={disabled}
                    {...props}
                />
            </AlertDialog.Cancel>
        </>
    )
}

Cancel.displayName = 'AlertDialogClose.Web'

const Action = ({
    ref,
    asChild,
    onPress: onPressProp,
    disabled = false,
    ...props
}: ActionProps) => {
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
            <AlertDialog.Action disabled={disabled ?? undefined} asChild>
                <Component
                    ref={augmentedRef}
                    onPress={onPress}
                    role="button"
                    disabled={disabled}
                    {...props}
                />
            </AlertDialog.Action>
        </>
    )
}

Action.displayName = 'AlertDialogAction.Web'

const Title = ({ ref, asChild, ...props }: TitleProps) => {
    const Component = asChild ? Slot.Text : Text
    return (
        <AlertDialog.Title asChild>
            <Component ref={ref} {...props} />
        </AlertDialog.Title>
    )
}

Title.displayName = 'AlertDialogTitle.Web'

const Description = ({ ref, asChild, ...props }: DescriptionProps) => {
    const Component = asChild ? Slot.Text : Text
    return (
        <AlertDialog.Description asChild>
            <Component ref={ref} {...props} />
        </AlertDialog.Description>
    )
}

Description.displayName = 'AlertDialogDescription.Web'

export {
    Action,
    Cancel,
    Content,
    Description,
    Overlay,
    Portal,
    Root,
    Title,
    Trigger,
    useRootContext,
}
