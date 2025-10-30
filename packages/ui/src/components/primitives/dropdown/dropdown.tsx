import React from 'react'
import {
    BackHandler,
    Text,
    View,
    type GestureResponderEvent,
    type LayoutChangeEvent,
    type LayoutRectangle,
} from 'react-native'

import { useAugmentedRef, useControllableState, useRelativePosition } from '../hooks'
import { LayoutPosition } from '../hooks/use-relative-position'
import { Portal as RNPPortal } from '../portal'
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
} from './dropdown.types'

interface IRootContext {
    open: boolean
    onOpenChange: (open: boolean) => void
    triggerPosition: LayoutPosition | null
    setTriggerPosition: (triggerPosition: LayoutPosition | null) => void
    contentLayout: LayoutRectangle | null
    setContentLayout: (contentLayout: LayoutRectangle | null) => void
    nativeID: string
}

const RootContext = React.createContext<IRootContext | null>(null)

const Root = ({ ref, asChild, onOpenChange: onOpenChangeProp, ...viewProps }: RootProps) => {
    const nativeID = React.useId()
    const [triggerPosition, setTriggerPosition] = React.useState<LayoutPosition | null>(null)
    const [contentLayout, setContentLayout] = React.useState<LayoutRectangle | null>(null)
    const [open, setOpen] = React.useState(false)

    function onOpenChange(open: boolean) {
        setOpen(open)
        onOpenChangeProp?.(open)
    }

    const Component = asChild ? Slot.View : View
    return (
        <RootContext.Provider
            value={{
                open,
                onOpenChange,
                contentLayout,
                setContentLayout,
                nativeID,
                setTriggerPosition,
                triggerPosition,
            }}
        >
            <Component ref={ref} {...viewProps} />
        </RootContext.Provider>
    )
}

Root.displayName = 'DropdownMenuRoot.Native'

function useRootContext() {
    const context = React.useContext(RootContext)
    if (!context) {
        throw new Error(
            'DropdownMenu compound components cannot be rendered outside the DropdownMenu component',
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
    const { open, onOpenChange, setTriggerPosition } = useRootContext()

    const augmentedRef = useAugmentedRef({
        ref,
        methods: {
            open: () => {
                onOpenChange(true)
                augmentedRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
                    setTriggerPosition({ width, pageX, pageY: pageY, height })
                })
            },
            close: () => {
                setTriggerPosition(null)
                onOpenChange(false)
            },
        },
    })

    function onPress(event: GestureResponderEvent) {
        if (disabled) return
        augmentedRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
            setTriggerPosition({ width, pageX, pageY: pageY, height })
        })
        const newValue = !open
        onOpenChange(newValue)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={augmentedRef}
            aria-disabled={disabled ?? undefined}
            role="button"
            onPress={onPress}
            disabled={disabled ?? undefined}
            aria-expanded={open}
            {...props}
        />
    )
}

Trigger.displayName = 'DropdownMenuTrigger.Native'

/**
 * @warning when using a custom `<PortalHost />`, you might have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }: PortalProps) {
    const value = useRootContext()

    if (!value.triggerPosition || (!forceMount && !value.open)) return null

    return (
        <RNPPortal hostName={hostName} name={`${value.nativeID}_portal`}>
            <RootContext.Provider value={value}>{children}</RootContext.Provider>
        </RNPPortal>
    )
}

const Overlay = ({
    ref,
    asChild,
    forceMount,
    onPress: OnPressProp,
    closeOnPress = true,
    ...props
}: OverlayProps) => {
    const { open, onOpenChange, setContentLayout, setTriggerPosition } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        if (closeOnPress) {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
        }
        OnPressProp?.(event)
    }

    if (!forceMount && !open) return null

    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} onPress={onPress} {...props} />
}
Overlay.displayName = 'DropdownMenuOverlay.Native'

/**
 * @info `position`, `top`, `left`, and `maxWidth` style properties are controlled internally.
 * Opt out of this behavior by setting `disablePositioningStyle` to `true`.
 */
const Content = ({
    ref,
    asChild = false,
    forceMount,
    align = 'start',
    side = 'bottom',
    sideOffset = 0,
    alignOffset = 0,
    avoidCollisions = true,
    onLayout: onLayoutProp,
    insets,
    style,
    disablePositioningStyle,
    ...props
}: ContentProps) => {
    const {
        open,
        onOpenChange,
        nativeID,
        triggerPosition,
        setTriggerPosition,
        contentLayout,
        setContentLayout,
    } = useRootContext()

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
            return true
        })

        return () => {
            setContentLayout(null)
            backHandler.remove()
        }
    }, [])

    const positionStyle = useRelativePosition({
        align,
        avoidCollisions,
        triggerPosition,
        contentLayout,
        alignOffset,
        insets,
        sideOffset,
        side,
        disablePositioningStyle,
    })

    function onLayout(event: LayoutChangeEvent) {
        setContentLayout(event.nativeEvent.layout)
        onLayoutProp?.(event)
    }

    if (!forceMount && !open) return null

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <Component
            ref={ref}
            role="menu"
            nativeID={nativeID}
            aria-modal={true}
            style={[positionStyle, style]}
            onLayout={onLayout}
            {...props}
        />
    )
}

Content.displayName = 'DropdownMenuContent.Native'

const Item = ({
    ref,
    asChild,
    textValue,
    onPress: onPressProp,
    disabled = false,
    closeOnPress = true,
    ...props
}: ItemProps) => {
    const { onOpenChange, setTriggerPosition, setContentLayout } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        if (closeOnPress) {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
        }
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={ref}
            role="menuitem"
            onPress={onPress}
            disabled={disabled}
            aria-valuetext={textValue}
            aria-disabled={!!disabled}
            accessibilityState={{ disabled: !!disabled }}
            {...props}
        />
    )
}

Item.displayName = 'DropdownMenuItem.Native'

const Group = ({ ref, asChild, ...props }: GroupProps) => {
    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role="group" {...props} />
}

Group.displayName = 'DropdownMenuGroup.Native'

const Label = ({ ref, asChild, ...props }: LabelProps) => {
    const Component = asChild ? Slot.Text : Text

    return <Component ref={ref} {...props} />
}

Label.displayName = 'DropdownMenuLabel.Native'

type FormItemContext =
    | { checked: boolean }
    | {
          value: string | undefined
          onValueChange: (value: string) => void
      }

const FormItemContext = React.createContext<FormItemContext | null>(null)

const CheckboxItem = ({
    ref,
    asChild,
    checked,
    onCheckedChange,
    textValue,
    onPress: onPressProp,
    closeOnPress = true,
    disabled = false,
    ...props
}: CheckboxItemProps) => {
    const { onOpenChange, setContentLayout, setTriggerPosition } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        onCheckedChange(!checked)
        if (closeOnPress) {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
        }
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <FormItemContext.Provider value={{ checked }}>
            <Component
                ref={ref}
                role="checkbox"
                aria-checked={checked}
                onPress={onPress}
                disabled={disabled}
                aria-disabled={!!disabled}
                aria-valuetext={textValue}
                accessibilityState={{ disabled: !!disabled }}
                {...props}
            />
        </FormItemContext.Provider>
    )
}

CheckboxItem.displayName = 'DropdownMenuCheckboxItem.Native'

function useFormItemContext() {
    const context = React.useContext(FormItemContext)
    if (!context) {
        throw new Error(
            'CheckboxItem or RadioItem compound components cannot be rendered outside of a CheckboxItem or RadioItem component',
        )
    }
    return context
}

const RadioGroup = ({ ref, asChild, value, onValueChange, ...props }: RadioGroupProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <FormItemContext.Provider value={{ value, onValueChange }}>
            <Component ref={ref} role="radiogroup" {...props} />
        </FormItemContext.Provider>
    )
}

RadioGroup.displayName = 'DropdownMenuRadioGroup.Native'

type BothFormItemContext = Exclude<FormItemContext, { checked: boolean }> & {
    checked: boolean
}

const RadioItemContext = React.createContext({} as { itemValue: string })

const RadioItem = ({
    ref,
    asChild,
    value: itemValue,
    textValue,
    onPress: onPressProp,
    disabled = false,
    closeOnPress = true,
    ...props
}: RadioItemProps) => {
    const { onOpenChange, setContentLayout, setTriggerPosition } = useRootContext()

    const { value, onValueChange } = useFormItemContext() as BothFormItemContext

    function onPress(event: GestureResponderEvent) {
        onValueChange(itemValue)

        if (closeOnPress) {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
        }

        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <RadioItemContext.Provider value={{ itemValue }}>
            <Component
                ref={ref}
                onPress={onPress}
                role="radio"
                aria-checked={value === itemValue}
                disabled={disabled ?? false}
                accessibilityState={{
                    disabled: disabled ?? false,
                    checked: value === itemValue,
                }}
                aria-valuetext={textValue}
                {...props}
            />
        </RadioItemContext.Provider>
    )
}

RadioItem.displayName = 'DropdownMenuRadioItem.Native'

function useItemIndicatorContext() {
    return React.useContext(RadioItemContext)
}

const ItemIndicator = ({ ref, asChild, forceMount, ...props }: ItemIndicatorProps) => {
    const { itemValue } = useItemIndicatorContext()
    const { checked, value } = useFormItemContext() as BothFormItemContext

    if (!forceMount && ((itemValue == null && !checked) || value !== itemValue)) return null

    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role="presentation" {...props} />
}

ItemIndicator.displayName = 'DropdownMenuItemIndicator.Native'

const Separator = ({ ref, asChild, decorative, ...props }: SeparatorProps) => {
    const Component = asChild ? Slot.View : View

    return <Component role={decorative ? 'presentation' : 'separator'} ref={ref} {...props} />
}

Separator.displayName = 'DropdownMenuSeparator.Native'

const SubContext = React.createContext<{
    nativeID: string
    open: boolean
    onOpenChange: (value: boolean) => void
} | null>(null)

const Sub = ({
    ref,
    asChild,
    defaultOpen,
    open: openProp,
    onOpenChange: onOpenChangeProp,
    ...props
}: SubProps) => {
    const nativeID = React.useId()
    const [open = false, onOpenChange] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChangeProp,
    })

    const Component = asChild ? Slot.View : View

    return (
        <SubContext.Provider
            value={{
                nativeID,
                open,
                onOpenChange,
            }}
        >
            <Component ref={ref} {...props} />
        </SubContext.Provider>
    )
}

Sub.displayName = 'DropdownMenuSub.Native'

function useSubContext() {
    const context = React.useContext(SubContext)
    if (!context) {
        throw new Error('Sub compound components cannot be rendered outside of a Sub component')
    }

    return context
}

const SubTrigger = ({
    ref,
    asChild,
    textValue,
    onPress: onPressProp,
    disabled = false,
    ...props
}: SubTriggerProps) => {
    const { nativeID, open, onOpenChange } = useSubContext()

    function onPress(event: GestureResponderEvent) {
        onOpenChange(!open)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={ref}
            aria-valuetext={textValue}
            role="menuitem"
            aria-expanded={open}
            accessibilityState={{ expanded: open, disabled: !!disabled }}
            nativeID={nativeID}
            onPress={onPress}
            disabled={disabled}
            aria-disabled={!!disabled}
            {...props}
        />
    )
}

SubTrigger.displayName = 'DropdownMenuSubTrigger.Native'

const SubContent = ({ ref, asChild = false, forceMount, ...props }: SubContentProps) => {
    const { open, nativeID } = useSubContext()

    if (!forceMount && !open) return null

    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} role="group" aria-labelledby={nativeID} {...props} />
}

Content.displayName = 'DropdownMenuContent.Native'

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
