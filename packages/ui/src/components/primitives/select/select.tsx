import React from 'react'
import {
    BackHandler,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    Pressable,
    Text,
    View,
} from 'react-native'

import { Icon as UiIcon } from '../../ui/icon'
import {
    useAugmentedRef,
    useControllableState,
    useRelativePosition,
    type LayoutPosition,
} from '../hooks'
import { Portal as RNPortal } from '../portal'
import { Slot } from '../slot'
import {
    ContentProps,
    GroupProps,
    IconProps,
    ItemIndicatorProps,
    ItemProps,
    ItemTextProps,
    LabelProps,
    OverlayProps,
    PortalProps,
    RootProps,
    ScrollButtonProps,
    SeparatorProps,
    SharedRootContext,
    TriggerProps,
    ValueProps,
    ViewportProps,
} from './select.types'

/**************************************************
 * Select
 **************************************************/

interface ContextValue extends SharedRootContext {
    open: boolean
    onOpenChange: (open: boolean) => void
    triggerPosition: LayoutPosition | null
    setTriggerPosition: (triggerPosition: LayoutPosition | null) => void
    contentLayout: LayoutRectangle | null
    setContentLayout: (contentLayout: LayoutRectangle | null) => void
    nativeID: string
}

const SelectContext = React.createContext<ContextValue | null>(null)

const Root = ({
    ref,
    asChild,
    value: valueProp,
    defaultValue,
    onValueChange: onValueChangeProp,
    onOpenChange: onOpenChangeProp,
    disabled,
    ...viewProps
}: RootProps) => {
    const nativeID = React.useId()
    const [value, onValueChange] = useControllableState({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onValueChangeProp,
    })
    const [triggerPosition, setTriggerPosition] = React.useState<LayoutPosition | null>(null)
    const [contentLayout, setContentLayout] = React.useState<LayoutRectangle | null>(null)
    const [open, setOpen] = React.useState(false)

    function onOpenChange(value: boolean) {
        setOpen(value)
        onOpenChangeProp?.(value)
    }

    const Component = asChild ? Slot.View : View
    return (
        <SelectContext.Provider
            value={{
                value,
                onValueChange,
                open,
                onOpenChange,
                disabled,
                contentLayout,
                nativeID,
                setContentLayout,
                setTriggerPosition,
                triggerPosition,
            }}
        >
            <Component ref={ref} {...viewProps} />
        </SelectContext.Provider>
    )
}

Root.displayName = 'Select.Native'

function useRootContext() {
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

const Trigger = ({
    ref,
    asChild,
    onPress: onPressProp,
    disabled = false,
    ...props
}: TriggerProps) => {
    const { open, onOpenChange, disabled: disabledRoot, setTriggerPosition } = useRootContext()

    const augmentedRef = useAugmentedRef({
        ref: ref!,
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
        onOpenChange(!open)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={augmentedRef}
            aria-disabled={disabled ?? undefined}
            role="combobox"
            onPress={onPress}
            disabled={disabled ?? disabledRoot}
            aria-expanded={open}
            {...props}
        />
    )
}

Trigger.displayName = 'SelectTrigger.Native'

/**************************************************
 * Select Value
 **************************************************/

const Value = ({ ref, asChild, placeholder, ...props }: ValueProps) => {
    const { value } = useRootContext()

    const Component = asChild ? Slot.Text : Text

    return (
        <Component ref={ref} {...props}>
            {value?.label ?? placeholder}
        </Component>
    )
}

Value.displayName = 'SelectValue.Native'

/**************************************************
 * Select Icon
 **************************************************/

const Icon = ({
    ref,
    asChild,
    name,
    color,
    size,
    style: iconStyle,
    selectIconWrapperStyle,
    ...props
}: IconProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Component aria-hidden style={selectIconWrapperStyle} {...props}>
            <UiIcon name={name} color={color} size={size} style={iconStyle} />
        </Component>
    )
}

Icon.displayName = 'SelectIcon.Native'

/**************************************************
 * Select Portal
 **************************************************/

function Portal({ forceMount, hostName, children }: PortalProps) {
    const value = useRootContext()

    if (!value.triggerPosition || (!forceMount && !value.open)) return null

    return (
        <RNPortal hostName={hostName} name={`${value.nativeID}_portal`}>
            <SelectContext.Provider value={value}>{children}</SelectContext.Provider>
        </RNPortal>
    )
}

Portal.displayName = 'SelectPortal.Native'

/**************************************************
 * Select Overlay
 **************************************************/

const Overlay = ({
    ref,
    asChild,
    forceMount,
    onPress: OnPressProp,
    closeOnPress = true,
    ...props
}: OverlayProps) => {
    const { open, onOpenChange, setTriggerPosition, setContentLayout } = useRootContext()

    function onPress(event: GestureResponderEvent) {
        if (closeOnPress) {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
        }
        OnPressProp?.(event)
    }

    if (!forceMount) {
        if (!open) {
            return null
        }
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} onPress={onPress} {...props} />
}

Overlay.displayName = 'SelectOverlay.Native'

/**************************************************
 * Select Content
 **************************************************/

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
    position: _position,
    ...props
}: ContentProps) => {
    const {
        open,
        onOpenChange,
        contentLayout,
        nativeID,
        triggerPosition,
        setContentLayout,
        setTriggerPosition,
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

    if (!forceMount) {
        if (!open) {
            return null
        }
    }

    const Component = asChild ? Slot.View : View

    return (
        <Component
            ref={ref}
            role="list"
            nativeID={nativeID}
            aria-modal={true}
            style={[positionStyle, style]}
            onLayout={onLayout}
            onStartShouldSetResponder={onStartShouldSetResponder}
            {...props}
        />
    )
}

Content.displayName = 'SelectContent.Native'

function onStartShouldSetResponder() {
    return true
}

/**************************************************
 * Select Item
 **************************************************/

const ItemContext = React.createContext<{
    itemValue: string
    label: string
} | null>(null)

const Item = ({
    ref,
    asChild,
    value: itemValue,
    label,
    onPress: onPressProp,
    disabled = false,
    closeOnPress = true,
    ...props
}: ItemProps) => {
    const { onOpenChange, value, onValueChange, setTriggerPosition, setContentLayout } =
        useRootContext()

    function onPress(event: GestureResponderEvent) {
        if (closeOnPress) {
            setTriggerPosition(null)
            setContentLayout(null)
            onOpenChange(false)
        }

        onValueChange({ value: itemValue, label })
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable
    return (
        <ItemContext.Provider value={{ itemValue, label }}>
            <Component
                ref={ref}
                role="option"
                onPress={onPress}
                disabled={disabled}
                aria-checked={value?.value === itemValue}
                aria-valuetext={label}
                aria-disabled={!!disabled}
                accessibilityState={{
                    disabled: !!disabled,
                    checked: value?.value === itemValue,
                }}
                {...props}
            />
        </ItemContext.Provider>
    )
}

Item.displayName = 'SelectItem.Native'

function useItemContext() {
    const context = React.useContext(ItemContext)
    if (!context) {
        throw new Error(
            'SelectItem compound components cannot be rendered outside of a Item component',
        )
    }
    return context
}

/**************************************************
 * Select Item Text
 **************************************************/

const ItemText = ({ ref, asChild, ...props }: ItemTextProps) => {
    const { label } = useItemContext()

    const Component = asChild ? Slot.Text : Text

    return (
        <Component ref={ref} {...props}>
            {label}
        </Component>
    )
}

ItemText.displayName = 'SelectItemText.Native'

/**************************************************
 * Select Item Indicator
 **************************************************/

const ItemIndicator = ({ ref, asChild, forceMount, ...props }: ItemIndicatorProps) => {
    const { itemValue } = useItemContext()
    const { value } = useRootContext()

    if (!forceMount) {
        if (value?.value !== itemValue) {
            return null
        }
    }
    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role="presentation" {...props} />
}

ItemIndicator.displayName = 'SelectItemIndicator.Native'

/**************************************************
 * Select Group
 **************************************************/

const Group = ({ ref, asChild, ...props }: GroupProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role="group" {...props} />
}

Group.displayName = 'SelectGroup.Native'

/**************************************************
 * Select Label
 **************************************************/

const Label = ({ ref, asChild, ...props }: LabelProps) => {
    const Component = asChild ? Slot.Text : Text
    return <Component ref={ref} {...props} />
}

Label.displayName = 'SelectLabel.Native'

/**************************************************
 * Select Separator
 **************************************************/

const Separator = ({ ref, asChild, ...props }: SeparatorProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} {...props} />
}

Separator.displayName = 'SelectSeparator.Native'

const ScrollUpButton = ({ children }: ScrollButtonProps) => {
    return <>{children}</>
}
ScrollUpButton.displayName = 'SelectScrollUpButton.Native'

const ScrollDownButton = ({ children }: ScrollButtonProps) => {
    return <>{children}</>
}
ScrollDownButton.displayName = 'SelectScrollDownButton.Native'

const Viewport = ({ children }: ViewportProps) => {
    return <>{children}</>
}
Viewport.displayName = 'SelectViewport.Native'

export {
    Root,
    Content,
    Group,
    Icon,
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
    useRootContext,
}
