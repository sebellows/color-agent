import * as React from 'react'
import { GestureResponderEvent, Pressable, Text, View } from 'react-native'

import { Menubar } from 'radix-ui'

import { useAugmentedRef, useControllableState, useIsomorphicLayoutEffect } from '../hooks'
import { EmptyGestureResponderEvent } from '../primitive.utils'
import { Slot } from '../slot'
import type {
    CheckboxItemProps,
    ContentProps,
    GroupProps,
    ItemIndicatorProps,
    ItemProps,
    LabelProps,
    MenuProps,
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
} from './menubar.types'

const RootContext = React.createContext<RootProps | null>(null)

const Root = ({ ref, asChild, value, onValueChange, ...viewProps }: RootProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <RootContext.Provider value={{ value, onValueChange }}>
            <Menubar.Root value={value} onValueChange={onValueChange}>
                <Component ref={ref} {...viewProps} />
            </Menubar.Root>
        </RootContext.Provider>
    )
}

Root.displayName = 'MenubarRoot.Web'

function useRootContext() {
    const context = React.useContext(RootContext)
    if (!context) {
        throw new Error(
            'Menubar compound components cannot be rendered outside the Menubar component',
        )
    }
    return context
}

const MenuContext = React.createContext<MenuProps | null>(null)

const Menu = ({ ref, asChild, value, ...viewProps }: MenuProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <MenuContext.Provider value={{ value }}>
            <Menubar.Menu value={value}>
                <Component ref={ref} {...viewProps} />
            </Menubar.Menu>
        </MenuContext.Provider>
    )
}

Menu.displayName = 'MenubarMenu.Web'

function useMenuContext() {
    const context = React.useContext(MenuContext)
    if (!context) {
        throw new Error(
            'Menubar compound components cannot be rendered outside the Menubar component',
        )
    }
    return context
}

const Trigger = ({ ref, asChild, disabled = false, ...props }: TriggerProps) => {
    const augmentedRef = useAugmentedRef({ ref })
    const { value: menuValue } = useMenuContext()
    const { value } = useRootContext()

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLDivElement
            augRef.dataset.state = value && menuValue === value ? 'open' : 'closed'
        }
    }, [value && menuValue])

    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLDivElement
            if (disabled) {
                augRef.dataset.disabled = 'true'
            } else {
                augRef.dataset.disabled = undefined
            }
        }
    }, [disabled])

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Menubar.Trigger disabled={disabled ?? undefined} asChild>
            <Component ref={augmentedRef} disabled={disabled} {...props} />
        </Menubar.Trigger>
    )
}

Trigger.displayName = 'MenubarTrigger.Web'

function Portal({ forceMount, container, children }: PortalProps) {
    return <Menubar.Portal forceMount={forceMount} container={container} children={children} />
}

const Overlay = ({ ref, asChild, ...props }: OverlayProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} {...props} />
}

Overlay.displayName = 'MenubarOverlay.Web'

const MenubarContentContext = React.createContext<{
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
    loop,
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
        <MenubarContentContext.Provider value={{ close }}>
            <Menubar.Content
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
                <Menubar.Item
                    ref={itemRef}
                    aria-hidden
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: -999999999 }}
                    aria-disabled
                    tabIndex={-1}
                    hidden
                />
            </Menubar.Content>
        </MenubarContentContext.Provider>
    )
}

Content.displayName = 'MenubarContent.Web'

function useMenubarContentContext() {
    const context = React.useContext(MenubarContentContext)
    if (!context) {
        throw new Error(
            'MenubarContent compound components cannot be rendered outside the MenubarContent component',
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
    const { close } = useMenubarContentContext()

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
        <Menubar.Item
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
        </Menubar.Item>
    )
}

Item.displayName = 'MenubarItem.Web'

const Group = ({ ref, asChild, ...props }: GroupProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <Menubar.Group asChild>
            <Component ref={ref} {...props} />
        </Menubar.Group>
    )
}

Group.displayName = 'MenubarGroup.Web'

const Label = ({ ref, asChild, ...props }: LabelProps) => {
    const Component = asChild ? Slot.Text : Text
    return (
        <Menubar.Label asChild>
            <Component ref={ref} {...props} />
        </Menubar.Label>
    )
}

Label.displayName = 'MenubarLabel.Web'

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
        <Menubar.CheckboxItem
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
        </Menubar.CheckboxItem>
    )
}

CheckboxItem.displayName = 'MenubarCheckboxItem.Web'

const MenubarRadioGroupContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
} | null>(null)

const RadioGroup = ({ ref, asChild, value, onValueChange, ...props }: RadioGroupProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <MenubarRadioGroupContext.Provider value={{ value, onValueChange }}>
            <Menubar.RadioGroup value={value} onValueChange={onValueChange} asChild>
                <Component ref={ref} {...props} />
            </Menubar.RadioGroup>
        </MenubarRadioGroupContext.Provider>
    )
}

RadioGroup.displayName = 'MenubarRadioGroup.Web'

function useMenubarRadioGroupContext() {
    const context = React.useContext(MenubarRadioGroupContext)
    if (!context) {
        throw new Error(
            'MenubarRadioGroup compound components cannot be rendered outside the MenubarRadioGroup component',
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
    const { onValueChange } = useMenubarRadioGroupContext()
    const { close } = useMenubarContentContext()

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
        <Menubar.RadioItem
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
        </Menubar.RadioItem>
    )
}

RadioItem.displayName = 'MenubarRadioItem.Web'

const ItemIndicator = ({ ref, asChild, forceMount, ...props }: ItemIndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Menubar.ItemIndicator forceMount={forceMount} asChild>
            <Component ref={ref} {...props} />
        </Menubar.ItemIndicator>
    )
}

ItemIndicator.displayName = 'MenubarItemIndicator.Web'

const Separator = ({ ref, asChild, decorative, ...props }: SeparatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Menubar.Separator asChild>
            <Component ref={ref} {...props} />
        </Menubar.Separator>
    )
}

Separator.displayName = 'MenubarSeparator.Web'

const MenubarSubContext = React.createContext<{
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
        <MenubarSubContext.Provider value={{ open, onOpenChange }}>
            <Menubar.Sub open={open} onOpenChange={onOpenChange}>
                <Component ref={ref} {...props} />
            </Menubar.Sub>
        </MenubarSubContext.Provider>
    )
}

Sub.displayName = 'MenubarSub.Web'

function useSubContext() {
    const context = React.useContext(MenubarSubContext)
    if (!context) {
        throw new Error(
            'MenubarSub compound components cannot be rendered outside the MenubarSub component',
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
        <Menubar.SubTrigger disabled={disabled ?? undefined} textValue={textValue} asChild>
            <Component ref={ref} onPress={onPress} {...props} />
        </Menubar.SubTrigger>
    )
}

SubTrigger.displayName = 'MenubarSubTrigger.Web'

const SubContent = ({ ref, asChild = false, forceMount, ...props }: SubContentProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Menubar.Portal>
            <Menubar.SubContent forceMount={forceMount}>
                <Component ref={ref} {...props} />
            </Menubar.SubContent>
        </Menubar.Portal>
    )
}

Content.displayName = 'MenubarContent.Web'

export {
    CheckboxItem,
    Content,
    Group,
    Item,
    ItemIndicator,
    Label,
    Menu,
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
    useMenuContext,
    useRootContext,
    useSubContext,
}

function onSelected(event: Event) {
    event.preventDefault()
}
