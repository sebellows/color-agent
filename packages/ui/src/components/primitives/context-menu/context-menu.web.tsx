import React from 'react'
import { GestureResponderEvent, Text, View } from 'react-native'

import { ContextMenu } from 'radix-ui'

import { useAugmentedRef, useControllableState, useIsomorphicLayoutEffect } from '../../../hooks'
import { EmptyGestureResponderEvent } from '../../../utils/empty-gesture-responder-event'
import { Pressable } from '../pressable'
import { Slot } from '../slot'
import type {
    CheckboxItemProps,
    ContentProps,
    GroupProps,
    ItemIndicatorProps,
    ItemProps,
    LabelProps,
    OverlayProps,
    PortalProps,
    RadioGroupProps,
    RadioItemProps,
    RootProps,
    SeparatorProps,
    SubContentProps,
    SubProps,
    SubTriggerProps,
    TriggerProps,
} from './context-menu.types'

const ContextMenuContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
} | null>(null)

const Root = ({ ref, asChild, onOpenChange: onOpenChangeProp, ...viewProps }: RootProps) => {
    const [open, setOpen] = React.useState(false)

    function onOpenChange(value: boolean) {
        setOpen(value)
        onOpenChangeProp?.(value)
    }

    const Component = asChild ? Slot.View : View

    return (
        <ContextMenuContext.Provider value={{ open, onOpenChange }}>
            <ContextMenu.Root onOpenChange={onOpenChange}>
                <Component ref={ref} {...viewProps} />
            </ContextMenu.Root>
        </ContextMenuContext.Provider>
    )
}

Root.displayName = 'ContextMenuRoot.Web'

function useRootContext() {
    const context = React.useContext(ContextMenuContext)
    if (!context) {
        throw new Error(
            'ContextMenu compound components cannot be rendered outside the ContextMenu component',
        )
    }
    return context
}

const Trigger = ({ ref, asChild, disabled = false, ...props }: TriggerProps) => {
    const { open } = useRootContext()
    const augmentedRef = useAugmentedRef({
        ref,
        methods: {
            open() {
                console.warn('Warning: `open()` is only for Native platforms')
            },
            close() {
                console.warn('Warning: `close()` is only for Native platforms')
            },
        },
    })

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return
        const augRef = augmentedRef.current as unknown as HTMLDivElement
        augRef.dataset.state = open ? 'open' : 'closed'
    }, [open])

    useIsomorphicLayoutEffect(() => {
        if (!augmentedRef.current) return

        const augRef = augmentedRef.current as unknown as HTMLDivElement

        augRef.dataset.disabled = disabled ? 'true' : undefined
    }, [disabled])

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <ContextMenu.Trigger disabled={disabled ?? undefined} asChild>
            <Component ref={augmentedRef} disabled={disabled} {...props} />
        </ContextMenu.Trigger>
    )
}

Trigger.displayName = 'ContextMenuTrigger.Web'

function Portal({ forceMount, container, children }: PortalProps) {
    return <ContextMenu.Portal forceMount={forceMount} container={container} children={children} />
}

const Overlay = ({ ref, asChild, ...props }: OverlayProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} {...props} />
}

Overlay.displayName = 'ContextMenuOverlay.Web'

const ContextMenuContentContext = React.createContext<{
    close: () => void
} | null>(null)

const Content = ({
    ref,
    asChild = false,
    forceMount,
    align: _align,
    side: _side,
    sideOffset: _sideOffset,
    alignOffset = 0,
    avoidCollisions = true,
    insets,
    loop = true,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    collisionBoundary,
    sticky,
    hideWhenDetached,
    ...props
}: ContentProps) => {
    const itemRef = React.useRef<HTMLDivElement>(null)

    function close() {
        itemRef.current?.click()
    }

    const Component = asChild ? Slot.View : View

    return (
        <ContextMenuContentContext.Provider value={{ close }}>
            <ContextMenu.Content
                forceMount={forceMount}
                alignOffset={alignOffset}
                avoidCollisions={avoidCollisions}
                collisionPadding={insets}
                loop={loop}
                onCloseAutoFocus={onCloseAutoFocus}
                onEscapeKeyDown={onEscapeKeyDown}
                onPointerDownOutside={onPointerDownOutside}
                onFocusOutside={onFocusOutside}
                onInteractOutside={onInteractOutside}
                collisionBoundary={collisionBoundary}
                sticky={sticky}
                hideWhenDetached={hideWhenDetached}
            >
                <Component ref={ref} {...props} />
                <ContextMenu.Item
                    ref={itemRef}
                    aria-hidden
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: -999999999 }}
                    aria-disabled
                    tabIndex={-1}
                    hidden
                />
            </ContextMenu.Content>
        </ContextMenuContentContext.Provider>
    )
}

Content.displayName = 'ContextMenuContent.Web'

function useContextMenuContentContext() {
    const context = React.useContext(ContextMenuContentContext)
    if (!context) {
        throw new Error(
            'ContextMenu compound components cannot be rendered outside the ContextMenu component',
        )
    }
    return context
}

const Item = ({
    ref,
    asChild,
    textValue,
    closeOnPress = true,
    onPress: onPressProp,
    ...props
}: ItemProps) => {
    const { close } = useContextMenuContentContext()

    function onKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent)

            if (closeOnPress) close()
        }
    }

    function onPress(event: GestureResponderEvent) {
        onPressProp?.(event)
        if (closeOnPress) close()
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <ContextMenu.Item
            textValue={textValue}
            disabled={props.disabled ?? undefined}
            onSelect={closeOnPress ? undefined : onSelected}
            asChild
        >
            <Component ref={ref} role="button" onPress={onPress} onKeyDown={onKeyDown} {...props} />
        </ContextMenu.Item>
    )
}

Item.displayName = 'ContextMenuItem.Web'

const Group = ({ ref, asChild, ...props }: GroupProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <ContextMenu.Group asChild>
            <Component ref={ref} {...props} />
        </ContextMenu.Group>
    )
}

Group.displayName = 'ContextMenuGroup.Web'

const Label = ({ ref, asChild, ...props }: LabelProps) => {
    const Component = asChild ? Slot.Text : Text
    return (
        <ContextMenu.Label asChild>
            <Component ref={ref} {...props} />
        </ContextMenu.Label>
    )
}

Label.displayName = 'ContextMenuLabel.Web'

const CheckboxItem = ({
    ref,
    asChild,
    checked,
    onCheckedChange,
    textValue,
    disabled = false,
    closeOnPress = true,
    onPress: onPressProp,
    onKeyDown: onKeyDownProp,
    ...props
}: CheckboxItemProps) => {
    const { close } = useContextMenuContentContext()

    function onKeyDown(event: React.KeyboardEvent) {
        onKeyDownProp?.(event)
        if (event.key === 'Enter' || event.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent)
            onCheckedChange?.(!checked)
            if (closeOnPress) {
                close()
            }
        }
    }

    function onPress(event: GestureResponderEvent) {
        onPressProp?.(event)
        onCheckedChange?.(!checked)
        if (closeOnPress) close()
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <ContextMenu.CheckboxItem
            textValue={textValue}
            checked={checked}
            onCheckedChange={onCheckedChange}
            onSelect={closeOnPress ? undefined : onSelected}
            disabled={disabled ?? undefined}
            asChild
        >
            <Component
                ref={ref}
                disabled={disabled}
                // @ts-expect-error web only
                onKeyDown={onKeyDown}
                onPress={onPress}
                role="button"
                {...props}
            />
        </ContextMenu.CheckboxItem>
    )
}

CheckboxItem.displayName = 'ContextMenuCheckboxItem.Web'

const ContextMenuRadioGroupContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
} | null>(null)

const RadioGroup = ({ ref, asChild, value, onValueChange, ...props }: RadioGroupProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <ContextMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
            <ContextMenu.RadioGroup value={value} onValueChange={onValueChange} asChild>
                <Component ref={ref} {...props} />
            </ContextMenu.RadioGroup>
        </ContextMenuRadioGroupContext.Provider>
    )
}

RadioGroup.displayName = 'ContextMenuRadioGroup.Web'

function useContextMenuRadioGroupContext() {
    const context = React.useContext(ContextMenuRadioGroupContext)
    if (!context) {
        throw new Error(
            'ContextMenu compound components cannot be rendered outside the ContextMenu component',
        )
    }
    return context
}

const RadioItem = ({
    ref,
    asChild,
    value,
    textValue,
    closeOnPress = true,
    onPress: onPressProp,
    onKeyDown: onKeyDownProp,
    ...props
}: RadioItemProps) => {
    const { onValueChange } = useContextMenuRadioGroupContext()
    const { close } = useContextMenuContentContext()

    function onKeyDown(event: React.KeyboardEvent) {
        onKeyDownProp?.(event)
        if (event.key === 'Enter' || event.key === ' ') {
            onValueChange?.(value)
            onPressProp?.(EmptyGestureResponderEvent)
            if (closeOnPress) close()
        }
    }

    function onPress(event: GestureResponderEvent) {
        onValueChange?.(value)
        onPressProp?.(event)
        if (closeOnPress) close()
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <ContextMenu.RadioItem
            value={value}
            textValue={textValue}
            disabled={props.disabled ?? undefined}
            onSelect={closeOnPress ? undefined : onSelected}
            asChild
        >
            <Component
                ref={ref}
                // @ts-expect-error web only
                onKeyDown={onKeyDown}
                onPress={onPress}
                {...props}
            />
        </ContextMenu.RadioItem>
    )
}

RadioItem.displayName = 'ContextMenuRadioItem.Web'

const ItemIndicator = ({ ref, asChild, forceMount, ...props }: ItemIndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <ContextMenu.ItemIndicator forceMount={forceMount} asChild>
            <Component ref={ref} {...props} />
        </ContextMenu.ItemIndicator>
    )
}

ItemIndicator.displayName = 'ContextMenuItemIndicator.Web'

const Separator = ({ ref, asChild, decorative, ...props }: SeparatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <ContextMenu.Separator asChild>
            <Component ref={ref} {...props} />
        </ContextMenu.Separator>
    )
}

Separator.displayName = 'ContextMenuSeparator.Web'

const ContextMenuSubContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
} | null>(null)

const Sub = ({
    ref,
    asChild,
    defaultOpen,
    open: openProp,
    onOpenChange: onOpenChangeProp,
    ...props
}: SubProps) => {
    const [open = false, onOpenChange] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChangeProp,
    })

    const Component = asChild ? Slot.View : View

    return (
        <ContextMenuSubContext.Provider value={{ open, onOpenChange }}>
            <ContextMenu.Sub open={open} onOpenChange={onOpenChange}>
                <Component ref={ref} {...props} />
            </ContextMenu.Sub>
        </ContextMenuSubContext.Provider>
    )
}

Sub.displayName = 'ContextMenuSub.Web'

function useSubContext() {
    const context = React.useContext(ContextMenuSubContext)
    if (!context) {
        throw new Error(
            'ContextMenu compound components cannot be rendered outside the ContextMenu component',
        )
    }
    return context
}

const SubTrigger = ({
    ref,
    asChild,
    textValue,
    disabled = false,
    onPress: onPressProp,
    ...props
}: SubTriggerProps) => {
    const { onOpenChange } = useSubContext()

    function onPress(event: GestureResponderEvent) {
        onOpenChange(true)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <ContextMenu.SubTrigger disabled={disabled ?? undefined} textValue={textValue} asChild>
            <Component ref={ref} onPress={onPress} {...props} />
        </ContextMenu.SubTrigger>
    )
}

SubTrigger.displayName = 'ContextMenuSubTrigger.Web'

const SubContent = ({ ref, asChild = false, forceMount, ...props }: SubContentProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <ContextMenu.Portal>
            <ContextMenu.SubContent forceMount={forceMount}>
                <Component ref={ref} {...props} />
            </ContextMenu.SubContent>
        </ContextMenu.Portal>
    )
}

Content.displayName = 'ContextMenuContent.Web'

export {
    CheckboxItem,
    Content,
    Group,
    Item,
    ItemIndicator,
    Label,
    Overlay,
    Portal,
    RadioGroup,
    RadioItem,
    Root,
    Separator,
    Sub,
    SubContent,
    SubTrigger,
    Trigger,
    useRootContext,
    useSubContext,
}

function onSelected(event: Event) {
    event.preventDefault()
}
