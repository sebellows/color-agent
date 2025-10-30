import * as React from 'react'
import { Text, View, type GestureResponderEvent } from 'react-native'

import { Pressable } from '../pressable'
import { Slot } from '../slot'
import type {
    ActionProps,
    CloseProps,
    DescriptionProps,
    RootProps,
    TitleProps,
} from './toast.types'

interface RootContext extends RootProps {
    nativeID: string
}
const ToastContext = React.createContext<RootContext | null>(null)

const Root = ({
    ref,
    asChild,
    type = 'foreground',
    open,
    onOpenChange,
    ...viewProps
}: RootProps) => {
    const nativeID = React.useId()

    if (!open) return null

    const Component = asChild ? Slot.View : View

    return (
        <ToastContext.Provider
            value={{
                open,
                onOpenChange,
                type,
                nativeID,
            }}
        >
            <Component
                ref={ref}
                role="status"
                aria-live={type === 'foreground' ? 'assertive' : 'polite'}
                {...viewProps}
            />
        </ToastContext.Provider>
    )
}

Root.displayName = 'ToastRoot'

function useToastContext() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('Toast compound components cannot be rendered outside the Toast component')
    }
    return context
}

const Close = ({ ref, asChild, onPress: onPressProp, disabled = false, ...props }: CloseProps) => {
    const { onOpenChange } = useToastContext()

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

Close.displayName = 'ToastClose'

const Action = ({
    ref,
    asChild,
    onPress: onPressProp,
    disabled = false,
    ...props
}: ActionProps) => {
    const { onOpenChange } = useToastContext()

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

Action.displayName = 'ToastAction'

const Title = ({ ref, asChild, ...props }: TitleProps) => {
    const { nativeID } = useToastContext()

    const Component = asChild ? Slot.Text : Text
    return <Component ref={ref} role="heading" nativeID={`${nativeID}_label`} {...props} />
}

Title.displayName = 'ToastTitle'

const Description = ({ ref, asChild, ...props }: DescriptionProps) => {
    const { nativeID } = useToastContext()

    const Component = asChild ? Slot.Text : Text

    return <Component ref={ref} nativeID={`${nativeID}_desc`} {...props} />
}

Description.displayName = 'ToastDescription'

export { Action, Close, Description, Root, Title }
