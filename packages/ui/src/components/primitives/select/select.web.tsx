import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { Slot } from '@ui/components/primitives/slot'
import { useAugmentedRef, useControllableState, useIsomorphicLayoutEffect } from '@ui/hooks'
import { Select } from 'radix-ui'

import {
    SelectContentProps,
    SelectGroupProps,
    SelectItemIndicatorProps,
    SelectItemProps,
    SelectItemTextProps,
    SelectLabelProps,
    SelectOverlayProps,
    SelectPortalProps,
    SelectRootProps,
    SelectScrollButtonProps,
    SelectSeparatorProps,
    SelectTriggerProps,
    SelectValueProps,
    SelectViewportProps,
    SharedRootContext,
} from './select.types'

/**************************************************
 * Select
 **************************************************/

interface SelectContextValue extends SharedRootContext {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

const Root = ({
    ref,
    asChild,
    value: valueProp,
    defaultValue,
    onValueChange: onValueChangeProp,
    onOpenChange: onOpenChangeProp,
    ...viewProps
}: SelectRootProps) => {
    const [value, onValueChange] = useControllableState({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onValueChangeProp,
    })
    const [open, setOpen] = React.useState(false)

    function onOpenChange(value: boolean) {
        setOpen(value)
        onOpenChangeProp?.(value)
    }

    function onStrValueChange(val: string) {
        onValueChange({ value: val, label: val })
    }

    const Component = asChild ? Slot.View : View

    return (
        <SelectContext.Provider
            value={{
                value,
                onValueChange,
                open,
                onOpenChange,
            }}
        >
            <Select.Root
                value={value?.value}
                defaultValue={defaultValue?.value}
                onValueChange={onStrValueChange}
                open={open}
                onOpenChange={onOpenChange}
            >
                <Component ref={ref} {...viewProps} />
            </Select.Root>
        </SelectContext.Provider>
    )
}

Root.displayName = 'Select.Web'

function useSelectContext() {
    const context = React.useContext(SelectContext)
    if (!context) {
        throw new Error(
            'Select compound components cannot be rendered outside the Select component',
        )
    }
    return context
}

/**************************************************
 * Select Trigger
 **************************************************/

const Trigger = ({ ref, asChild, role: _role, disabled = false, ...props }: SelectTriggerProps) => {
    const { open, onOpenChange } = useSelectContext()

    const augmentedRef = useAugmentedRef({
        ref: ref!,
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
        if (augmentedRef.current) {
            const augRef = augmentedRef.current as unknown as HTMLButtonElement
            augRef.dataset.state = open ? 'open' : 'closed'
            augRef.type = 'button'
        }
    }, [open])

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Select.Trigger disabled={disabled ?? undefined} asChild>
            <Component ref={augmentedRef} role="button" disabled={disabled} {...props} />
        </Select.Trigger>
    )
}

Trigger.displayName = 'SelectTrigger.Web'

/**************************************************
 * Select Value
 **************************************************/

const Value = ({ ref, asChild, placeholder, children, ...props }: SelectValueProps) => {
    return (
        <Slot.Text ref={ref} {...props}>
            <Select.Value placeholder={placeholder}>{children}</Select.Value>
        </Slot.Text>
    )
}

Value.displayName = 'SelectValue.Web'

/**************************************************
 * Select Portal
 **************************************************/

function Portal({ container, children }: SelectPortalProps) {
    return <Select.Portal children={children} container={container} />
}

Portal.displayName = 'SelectPortal.Web'

/**************************************************
 * Select Overlay
 **************************************************/

const Overlay = ({ ref, asChild, forceMount, children, ...props }: SelectOverlayProps) => {
    const { open } = useSelectContext()

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <>
            {open && <Component ref={ref} {...props} />}
            {children as React.ReactNode}
        </>
    )
}

Overlay.displayName = 'SelectOverlay.Web'

/**************************************************
 * Select Content
 **************************************************/

const Content = ({
    ref,
    asChild = false,
    forceMount,
    align = 'start',
    side = 'bottom',
    position = 'popper',
    sideOffset = 0,
    alignOffset = 0,
    avoidCollisions = true,
    disablePositioningStyle: _disablePositioningStyle,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onInteractOutside: _onInteractOutside,
    onPointerDownOutside,
    ...props
}: SelectContentProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Select.Content
            onCloseAutoFocus={onCloseAutoFocus}
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            align={align}
            side={side}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            avoidCollisions={avoidCollisions}
            position={position}
        >
            <Component ref={ref} {...props} />
        </Select.Content>
    )
}

Content.displayName = 'SelectContent.Web'

/**************************************************
 * Select Item
 **************************************************/

const SelectItemContext = React.createContext<{
    itemValue: string
    label: string
} | null>(null)

const Item = ({
    ref,
    asChild,
    closeOnPress = true,
    label,
    value,
    children,
    ...props
}: SelectItemProps) => {
    return (
        <SelectItemContext.Provider value={{ itemValue: value, label: label }}>
            <Slot.Pressable ref={ref} {...props}>
                <Select.Item textValue={label} value={value} disabled={props.disabled ?? undefined}>
                    <>{children as React.ReactNode}</>
                </Select.Item>
            </Slot.Pressable>
        </SelectItemContext.Provider>
    )
}

Item.displayName = 'SelectItem.Web'

function useItemContext() {
    const context = React.useContext(SelectItemContext)
    if (!context) {
        throw new Error(
            'SelectItem compound components cannot be rendered outside of a SelectItem component',
        )
    }
    return context
}

/**************************************************
 * Select Item Text
 **************************************************/

const ItemText = ({ ref, asChild, ...props }: SelectItemTextProps) => {
    const { label } = useItemContext()

    const Component = asChild ? Slot.Text : Text

    return (
        <Select.ItemText asChild>
            <Component ref={ref} {...props}>
                {label}
            </Component>
        </Select.ItemText>
    )
}

ItemText.displayName = 'SelectItemText.Web'

/**************************************************
 * Select Item Indicator
 **************************************************/

const ItemIndicator = ({ ref, asChild, forceMount, ...props }: SelectItemIndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Select.ItemIndicator asChild>
            <Component ref={ref} {...props} />
        </Select.ItemIndicator>
    )
}

ItemIndicator.displayName = 'SelectItemIndicator.Web'

/**************************************************
 * Select Group
 **************************************************/

const Group = ({ ref, asChild, ...props }: SelectGroupProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <Select.Group asChild>
            <Component ref={ref} {...props} />
        </Select.Group>
    )
}

Group.displayName = 'SelectGroup.Web'

/**************************************************
 * Select Label
 **************************************************/

const Label = ({ ref, asChild, ...props }: SelectLabelProps) => {
    const Component = asChild ? Slot.Text : Text
    return (
        <Select.Label asChild>
            <Component ref={ref} {...props} />
        </Select.Label>
    )
}

Label.displayName = 'SelectLabel.Web'

/**************************************************
 * Select Separator
 **************************************************/

const Separator = ({ ref, asChild, decorative, ...props }: SelectSeparatorProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <Select.Separator asChild>
            <Component ref={ref} {...props} />
        </Select.Separator>
    )
}

Separator.displayName = 'SelectSeparator.Web'

const ScrollUpButton = (props: SelectScrollButtonProps) => {
    return <Select.ScrollUpButton {...props} />
}
ScrollUpButton.displayName = 'SelectScrollUpButton.Native'

const ScrollDownButton = (props: SelectScrollButtonProps) => {
    return <Select.ScrollDownButton {...props} />
}
ScrollDownButton.displayName = 'SelectScrollDownButton.Native'

const Viewport = (props: SelectViewportProps) => {
    return <Select.Viewport {...props} />
}
Viewport.displayName = 'SelectViewport.Native'

export {
    Root,
    Content,
    Group,
    Item,
    ItemIndicator,
    ItemText,
    Label,
    Overlay,
    Portal,
    ScrollDownButton,
    ScrollUpButton,
    Separator,
    Trigger,
    Value,
    Viewport,
}
