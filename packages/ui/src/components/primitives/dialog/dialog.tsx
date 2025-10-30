import * as React from 'react'
import { BackHandler, GestureResponderEvent, Pressable, Text, View } from 'react-native'

import { useControllableState } from '../hooks'
import { Portal as RNPPortal } from '../portal'
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

const DialogContext = React.createContext<(RootContext & { nativeID: string }) | null>(null)

const Root = ({
    ref,
    asChild,
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
        <DialogContext.Provider
            value={{
                open,
                onOpenChange,
                nativeID,
            }}
        >
            <Component ref={ref} {...viewProps} />
        </DialogContext.Provider>
    )
}

Root.displayName = 'DialogRoot.Native'

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
    disabled = false,
    ...props
}: TriggerProps) => {
    const { open, onOpenChange } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        if (disabled) return
        const newValue = !open
        onOpenChange(newValue)
        onPressProp?.(event)
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

Trigger.displayName = 'DialogTrigger.Native'

/**
 * @warning when using a custom `<PortalHost />`, you might have to adjust the
 * Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }: PortalProps) {
    const value = useRootContext()

    if (!forceMount && !value.open) return null

    return (
        <RNPPortal hostName={hostName} name={`${value.nativeID}_portal`}>
            <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
        </RNPPortal>
    )
}

const Overlay = ({
    ref,
    asChild,
    forceMount,
    closeOnPress = true,
    onPress: onPressProp,
    ...props
}: OverlayProps) => {
    const { open, onOpenChange } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        if (closeOnPress) {
            onOpenChange(!open)
        }
        onPressProp?.(event)
    }

    if (!forceMount && !open) return null

    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} onPress={onPress} {...props} />
}

Overlay.displayName = 'DialogOverlay.Native'

const Content = ({ ref, asChild, forceMount, ...props }: ContentProps) => {
    const { open, nativeID, onOpenChange } = useRootContext()

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            onOpenChange(false)
            return true
        })

        return () => {
            backHandler.remove()
        }
    }, [])

    if (!forceMount && !open) return null

    const Component = asChild ? Slot.View : View
    return (
        <Component
            ref={ref}
            role="dialog"
            nativeID={nativeID}
            aria-labelledby={`${nativeID}_label`}
            aria-describedby={`${nativeID}_desc`}
            aria-modal={true}
            onStartShouldSetResponder={onStartShouldSetResponder}
            {...props}
        />
    )
}

Content.displayName = 'DialogContent.Native'

const Close = ({ ref, asChild, onPress: onPressProp, disabled = false, ...props }: CloseProps) => {
    const { onOpenChange } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        if (disabled) return
        onOpenChange(false)
        onPressProp?.(event)
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

Close.displayName = 'DialogClose.Native'

const Title = ({ ref, ...props }: TitleProps) => {
    const { nativeID } = useRootContext()

    return <Text ref={ref} role="heading" nativeID={`${nativeID}_label`} {...props} />
}

Title.displayName = 'DialogTitle.Native'

const Description = ({ ref, ...props }: DescriptionProps) => {
    const { nativeID } = useRootContext()

    return <Text ref={ref} nativeID={`${nativeID}_desc`} {...props} />
}

Description.displayName = 'DialogDescription.Native'

export { Close, Content, Description, Overlay, Portal, Root, Title, Trigger, useRootContext }

function onStartShouldSetResponder() {
    return true
}
