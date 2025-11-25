import * as React from 'react'
import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native'

import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { getBorder, getSizeVariant, typography } from '../../design-system/design-system.utils'
import { SizeToken } from '../../design-system/design-tokens/sizes'
import { RNText } from '../../types'
import { isWeb } from '../../utils'
import * as DropdownMenuPrimitive from '../primitives/dropdown'
import { Icon } from './icon'
import { UiLabelProps, uiStyles } from './styles'
import { TextStyleContext } from './text'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = ({
    ref,
    style,
    inset,
    children,
    ...props
}: DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean
}) => {
    const { open } = DropdownMenuPrimitive.useSubContext()
    const iconName =
        Platform.OS === 'web' ? 'chevron-right'
        : open ? 'chevron-up'
        : 'chevron-down'
    return (
        <TextStyleContext.Provider value={styles.subtriggerWrapper({ open })}>
            <DropdownMenuPrimitive.SubTrigger
                ref={ref}
                style={styles.subtrigger({ inset, open })}
                {...props}
            >
                <>{children}</>
                <Icon name={iconName} color="fg" size={18} style={{ marginLeft: 'auto' }} />
            </DropdownMenuPrimitive.SubTrigger>
        </TextStyleContext.Provider>
    )
}
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = ({
    ref,
    style,
    ...props
}: DropdownMenuPrimitive.SubContentProps) => {
    const { open } = DropdownMenuPrimitive.useSubContext()

    return (
        <DropdownMenuPrimitive.SubContent
            ref={ref}
            style={[styles.subcontent({ open }), style as StyleProp<ViewStyle>]}
            {...props}
        />
    )
}
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.Sub.displayName

const DropdownMenuContent = ({
    ref,
    style,
    overlayWebProps: _overlayWebProps = {},
    overlayStyle,
    portalHost,
    ...props
}: DropdownMenuPrimitive.ContentProps & {
    overlayStyle?: StyleProp<ViewStyle>
    overlayWebProps?: { className?: string }
    portalHost?: string
}) => {
    const { theme } = useUnistyles()
    // const { open } = DropdownMenuPrimitive.useRootContext()
    const overlayProps = isWeb ? _overlayWebProps : {}

    return (
        <DropdownMenuPrimitive.Portal hostName={portalHost}>
            <DropdownMenuPrimitive.Overlay
                style={[overlayStyle, theme.utils.absoluteFill]}
                {...overlayProps}
            >
                <DropdownMenuPrimitive.Content
                    ref={ref}
                    style={[styles.content, style] as DropdownMenuPrimitive.ContentProps['style']}
                    {...props}
                />
            </DropdownMenuPrimitive.Overlay>
        </DropdownMenuPrimitive.Portal>
    )
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = ({
    ref,
    style,
    inset,
    ...props
}: DropdownMenuPrimitive.ItemProps & {
    inset?: boolean
}) => (
    <TextStyleContext.Provider value={styles.itemContext}>
        <DropdownMenuPrimitive.Item
            ref={ref}
            style={[
                styles.item({ disabled: props.disabled, inset }),
                style as StyleProp<ViewStyle>,
            ]}
            {...props}
        />
    </TextStyleContext.Provider>
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = ({
    ref,
    style,
    children,
    checked,
    iconSize = 14,
    ...props
}: DropdownMenuPrimitive.CheckboxItemProps & { iconSize?: SizeToken | number }) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        style={[styles.toggleInputWrapper, style] as StyleProp<ViewStyle>}
        checked={checked}
        {...props}
    >
        <View style={[uiStyles.checkbox.main(), getSizeVariant(iconSize)]}>
            <DropdownMenuPrimitive.ItemIndicator style={uiStyles.checkbox.indicator()}>
                <Icon name="check" size={iconSize} color="fg" />
            </DropdownMenuPrimitive.ItemIndicator>
        </View>
        <>{children}</>
    </DropdownMenuPrimitive.CheckboxItem>
)
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = ({
    ref,
    iconSize = 14,
    style,
    children,
    ...props
}: DropdownMenuPrimitive.RadioItemProps & { iconSize?: SizeToken | number }) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        style={[uiStyles.radio.main(), style] as StyleProp<ViewStyle>}
        {...props}
    >
        <View style={[uiStyles.radio.indicator(), getSizeVariant(iconSize)]}>
            <DropdownMenuPrimitive.ItemIndicator>
                <View style={uiStyles.radio.indicatorInner() as ViewStyle} />
            </DropdownMenuPrimitive.ItemIndicator>
        </View>
        <>{children}</>
    </DropdownMenuPrimitive.RadioItem>
)
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = ({
    ref,
    style,
    ...props
}: UiLabelProps<DropdownMenuPrimitive.LabelProps>) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        style={[
            uiStyles.label.main(props) as UiLabelProps<DropdownMenuPrimitive.LabelProps>['style'],
            style,
        ]}
        {...props}
    />
)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = ({ ref, style, ...props }: DropdownMenuPrimitive.SeparatorProps) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        style={[uiStyles.separator.main, style] as StyleProp<ViewStyle>}
        {...props}
    />
)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ style, ...props }: React.ComponentPropsWithoutRef<RNText>) => {
    return <Text style={[uiStyles.shortcut.main, style]} {...props} />
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

const styles = StyleSheet.create(theme => ({
    toggleInputItem: {
        ...theme.utils.flexCenter,
        position: 'absolute',
        left: theme.space.default,
    },
    toggleInputWrapper: ({ disabled }) => ({
        // 'relative flex flex-row web:cursor-default items-center web:group rounded-sm py-1.5 native:py-2 pl-8 pr-2 web:outline-none web:focus:bg-accent active:bg-accent',
        // props.disabled && 'web:pointer-events-none opacity-50',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        borderRadius: theme.radii.sm,
        opacity: disabled ? 0.5 : 1,
        paddingLeft: theme.space.lg,
        paddingRight: theme.space.default,
        paddingTop: theme.space.xs,
        paddingBottom: theme.space.xs,
        _active: {
            backgroundColor: theme.colors.accent.bg,
        },
        _focus: {
            backgroundColor: theme.colors.accent.bg,
        },
        _hover: {
            backgroundColor: theme.colors.accent.bg,
        },
        _web: {
            outline: 'none',
            pointerEvents: disabled ? 'none' : undefined,
        },
    }),
    item: ({ disabled, inset }) => ({
        // 'relative flex flex-row web:cursor-default gap-2 items-center rounded-sm px-2 py-1.5 native:py-2 web:outline-none web:focus:bg-accent active:bg-accent web:hover:bg-accent group'
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        gap: theme.gap(2),
        borderRadius: theme.radii.sm,
        opacity: disabled ? 0.5 : 1,
        paddingLeft: inset ? theme.space.lg : theme.space.default,
        paddingRight: theme.space.default,
        paddingTop: theme.space.xs,
        paddingBottom: theme.space.xs,
        _active: {
            backgroundColor: theme.colors.accent.bg,
        },
        _focus: {
            backgroundColor: theme.colors.accent.bg,
        },
        _hover: {
            backgroundColor: theme.colors.accent.bg,
        },
        _web: {
            outline: 'none',
            pointerEvents: disabled ? 'none' : undefined,
        },
    }),
    itemContext: {
        // select-none text-sm native:text-lg text-popover-foreground web:group-focus:text-accent-foreground
        userSelect: 'none',
        color: theme.colors.componentFg,
        ...typography(theme, 'body'),
        _focus: {
            color: theme.colors.accent.actionDefault,
        },
    },
    content: ({ open }) => ({
        // open ?
        //     'web:animate-in web:fade-in-0 web:zoom-in-95'
        // :   'web:animate-out web:fade-out-0 web:zoom-out-95',
        zIndex: theme.zIndices['50'],
        minWidth: 128,
        overflow: 'hidden',
        borderRadius: theme.radii.md,
        marginTop: theme.space.xxs,
        backgroundColor: theme.colors.componentBg,
        padding: theme.space.xxs,
        boxShadow: theme.boxShadows.md,
        ...getBorder(theme, true),
        _web: {
            _classNames:
                open ?
                    ['fade-in', 'zoom-in', 'zoom-in-95']
                :   ['fade-out', 'zoom-out', 'zoom-out-95'],
        },
    }),
    subcontent: ({ open }) => ({
        // open ?
        //     'web:animate-in web:fade-in-0 web:zoom-in-95'
        // :   'web:animate-out web:fade-out-0 web:zoom-out ',
        zIndex: theme.zIndices['50'],
        minWidth: 128,
        overflow: 'hidden',
        borderRadius: theme.radii.md,
        marginTop: theme.space.xxs,
        backgroundColor: theme.colors.componentBg,
        padding: theme.space.xxs,
        boxShadow: theme.boxShadows.md,
        ...getBorder(theme, true),
        _web: {
            _classNames: open ? ['fade-in', 'zoom-in', 'zoom-in-95'] : ['fade-out', 'zoom-out'],
        },
    }),
    subtriggerWrapper: ({ open }) => ({
        color: open ? theme.colors.primary.actionDefault : theme.colors.accent.actionDefault,
        userSelect: 'none',
        ...typography(theme, 'labelSmall'),
    }),
    subtrigger: ({ inset, open }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: open ? theme.colors.accent.actionDefault : undefined,
        borderRadius: theme.radii.sm,
        gap: theme.gap(2),
        paddingLeft: inset ? theme.space.lg : theme.space.default,
        paddingRight: theme.space.default,
        paddingTop: theme.space.xs,
        paddingBottom: theme.space.xs,
        userSelect: 'none',
        _active: {
            backgroundColor: theme.colors.accent.actionDefault,
        },
        _focus: {
            backgroundColor: theme.colors.accent.actionDefault,
        },
        _hover: {
            backgroundColor: theme.colors.accent.actionDefault,
        },
        _web: {
            cursor: 'default',
            outline: 'none',
        },
    }),
}))

export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
}
