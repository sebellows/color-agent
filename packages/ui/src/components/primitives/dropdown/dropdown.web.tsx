import * as React from 'react'
import { GestureResponderEvent, Pressable, Text, View } from 'react-native'

import { DropdownMenu } from 'radix-ui'

import { useAugmentedRef, useControllableState, useIsomorphicLayoutEffect } from '../../../hooks'
import { EmptyGestureResponderEvent } from '../../../utils/empty-gesture-responder-event'
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
} from './dropdown.types'

const DropdownMenuContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
} | null>(null)

const Root = ({ ref, asChild, onOpenChange: onOpenChangeProp, ...viewProps }: RootProps) => {
    const [open, setOpen] = React.useState(false)

    function onOpenChange(open: boolean) {
        setOpen(open)
        onOpenChangeProp?.(open)
    }

    const Component = asChild ? Slot.View : View
    return (
        <DropdownMenuContext.Provider value={{ open, onOpenChange }}>
            <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
                <Component ref={ref} {...viewProps} />
            </DropdownMenu.Root>
        </DropdownMenuContext.Provider>
    )
}

Root.displayName = 'DropdownMenuRoot.Web'

function useRootContext() {
    const context = React.useContext(DropdownMenuContext)
    if (!context) {
        throw new Error(
            'DropdownMenu compound components cannot be rendered outside the DropdownMenu component',
        )
    }
    return context
}

const Trigger = ({ ref, asChild, disabled = false, ...props }: TriggerProps) => {
    const { open, onOpenChange } = useRootContext()
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
        <DropdownMenu.Trigger disabled={disabled ?? undefined} asChild>
            <Component ref={augmentedRef} {...props} />
        </DropdownMenu.Trigger>
    )
}

Trigger.displayName = 'DropdownMenuTrigger.Web'

function Portal({ forceMount, container, children }: PortalProps) {
    return <DropdownMenu.Portal forceMount={forceMount} container={container} children={children} />
}

const Overlay = ({ ref, asChild, ...props }: OverlayProps) => {
    const Component = asChild ? Slot.Pressable : Pressable
    return <Component ref={ref} {...props} />
}

Overlay.displayName = 'DropdownMenuOverlay.Web'

const DropdownMenuContentContext = React.createContext<{
    close: () => void
} | null>(null)

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

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <DropdownMenuContentContext.Provider value={{ close }}>
            <DropdownMenu.Content
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
                align={align}
                side={side}
                sideOffset={sideOffset}
            >
                <Component ref={ref} {...props} />
                <DropdownMenu.Item
                    ref={itemRef}
                    aria-hidden
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: -999999999 }}
                    aria-disabled
                    tabIndex={-1}
                    hidden
                />
            </DropdownMenu.Content>
        </DropdownMenuContentContext.Provider>
    )
}

Content.displayName = 'DropdownMenuContent.Web'

function useDropdownMenuContentContext() {
    const context = React.useContext(DropdownMenuContentContext)
    if (!context) {
        throw new Error(
            'DropdownMenu compound components cannot be rendered outside the DropdownMenu component',
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
    onKeyDown: onKeyDownProp,
    ...props
}: ItemProps) => {
    const { close } = useDropdownMenuContentContext()

    function onKeyDown(event: React.KeyboardEvent) {
        onKeyDownProp?.(event)

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
        <DropdownMenu.Item
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
        </DropdownMenu.Item>
    )
}

Item.displayName = 'DropdownMenuItem.Web'

const Group = ({ ref, asChild, ...props }: GroupProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <DropdownMenu.Group asChild>
            <Component ref={ref} {...props} />
        </DropdownMenu.Group>
    )
}

Group.displayName = 'DropdownMenuGroup.Web'

const Label = ({ ref, asChild, ...props }: LabelProps) => {
    const Component = asChild ? Slot.Text : Text

    return (
        <DropdownMenu.Label asChild>
            <Component ref={ref} {...props} />
        </DropdownMenu.Label>
    )
}

Label.displayName = 'DropdownMenuLabel.Web'

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
    const { close } = useDropdownMenuContentContext()

    function onKeyDown(event: React.KeyboardEvent) {
        onKeyDownProp?.(event)

        if (event.key === 'Enter' || event.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent)
            onCheckedChange?.(!checked)

            if (closeOnPress) close()
        }
    }

    function onPress(event: GestureResponderEvent) {
        onPressProp?.(event)
        onCheckedChange?.(!checked)

        if (closeOnPress) close()
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <DropdownMenu.CheckboxItem
            textValue={textValue}
            checked={checked}
            onCheckedChange={onCheckedChange}
            onSelect={closeOnPress ? undefined : onSelected}
            disabled={disabled ?? undefined}
            asChild
        >
            <Component
                ref={ref}
                // @ts-expect-error web only
                onKeyDown={onKeyDown}
                onPress={onPress}
                role="button"
                {...props}
            />
        </DropdownMenu.CheckboxItem>
    )
}

CheckboxItem.displayName = 'DropdownMenuCheckboxItem.Web'

const DropdownMenuRadioGroupContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
} | null>(null)

const RadioGroup = ({ ref, asChild, value, onValueChange, ...props }: RadioGroupProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <DropdownMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
            <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange} asChild>
                <Component ref={ref} {...props} />
            </DropdownMenu.RadioGroup>
        </DropdownMenuRadioGroupContext.Provider>
    )
}

RadioGroup.displayName = 'DropdownMenuRadioGroup.Web'

function useDropdownMenuRadioGroupContext() {
    const context = React.useContext(DropdownMenuRadioGroupContext)
    if (!context) {
        throw new Error(
            'DropdownMenuRadioGroup compound components cannot be rendered outside the DropdownMenuRadioGroup component',
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
    const { onValueChange } = useDropdownMenuRadioGroupContext()
    const { close } = useDropdownMenuContentContext()

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
        <DropdownMenu.RadioItem
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
        </DropdownMenu.RadioItem>
    )
}

RadioItem.displayName = 'DropdownMenuRadioItem.Web'

const ItemIndicator = ({ ref, asChild, forceMount, ...props }: ItemIndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <DropdownMenu.ItemIndicator forceMount={forceMount} asChild>
            <Component ref={ref} {...props} />
        </DropdownMenu.ItemIndicator>
    )
}

ItemIndicator.displayName = 'DropdownMenuItemIndicator.Web'

const Separator = ({ ref, asChild, decorative, ...props }: SeparatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <DropdownMenu.Separator asChild>
            <Component ref={ref} {...props} />
        </DropdownMenu.Separator>
    )
}

Separator.displayName = 'DropdownMenuSeparator.Web'

const DropdownMenuSubContext = React.createContext<{
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
        <DropdownMenuSubContext.Provider value={{ open, onOpenChange }}>
            <DropdownMenu.Sub open={open} onOpenChange={onOpenChange}>
                <Component ref={ref} {...props} />
            </DropdownMenu.Sub>
        </DropdownMenuSubContext.Provider>
    )
}

Sub.displayName = 'DropdownMenuSub.Web'

function useSubContext() {
    const context = React.useContext(DropdownMenuSubContext)
    if (!context) {
        throw new Error(
            'DropdownMenu compound components cannot be rendered outside the DropdownMenu component',
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
        <DropdownMenu.SubTrigger disabled={disabled ?? undefined} textValue={textValue} asChild>
            <Component ref={ref} onPress={onPress} {...props} />
        </DropdownMenu.SubTrigger>
    )
}

SubTrigger.displayName = 'DropdownMenuSubTrigger.Web'

const SubContent = ({ ref, asChild = false, forceMount, ...props }: SubContentProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <DropdownMenu.Portal>
            <DropdownMenu.SubContent forceMount={forceMount}>
                <Component ref={ref} {...props} />
            </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
    )
}

Content.displayName = 'DropdownMenuContent.Web'

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
