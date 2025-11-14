import * as React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'

import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { typography } from '../../design-system/design-system.utils'
import { RNText } from '../../types'
import { isWeb } from '../../utils'
import * as ContextMenuPrimitive from '../primitives/context-menu'
import { Icon } from './icon'
import { TextStyleContext } from './text'

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = ({
    ref,
    style,
    inset,
    children,
    ...props
}: ContextMenuPrimitive.SubTriggerProps) => {
    const { open } = ContextMenuPrimitive.useSubContext()
    const iconName =
        isWeb ? 'chevron-right'
        : open ? 'chevron-up'
        : 'chevron-down'

    return (
        <TextStyleContext.Provider value={styles.subtriggerContext({ open })}>
            <ContextMenuPrimitive.SubTrigger
                ref={ref}
                style={[styles.subtrigger({ inset, open }), style as StyleProp<ViewStyle>]}
                {...props}
            >
                <>{children}</>
                <Icon name={iconName} size={18} color="fg" style={styles.subtriggerIcon} />
            </ContextMenuPrimitive.SubTrigger>
        </TextStyleContext.Provider>
    )
}
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = ({ ref, style, ...props }: ContextMenuPrimitive.SubContentProps) => {
    const { open } = ContextMenuPrimitive.useSubContext()
    return (
        <ContextMenuPrimitive.SubContent
            ref={ref}
            style={[styles.subContent({ open }), style as StyleProp<ViewStyle>]}
            {...props}
        />
    )
}
ContextMenuSubContent.displayName = ContextMenuSub.displayName

const ContextMenuContent = ({
    ref,
    style,
    overlayStyle,
    portalHost,
    ...props
}: ContextMenuPrimitive.ContentProps & {
    overlayStyle?: StyleProp<ViewStyle>
    portalHost?: string
}) => {
    return (
        <ContextMenuPrimitive.Portal hostName={portalHost}>
            <ContextMenuPrimitive.Overlay style={[overlayStyle, styles.overlay]}>
                <ContextMenuPrimitive.Content
                    ref={ref}
                    style={[styles.content, style] as ContextMenuPrimitive.ContentProps['style']}
                    {...props}
                />
            </ContextMenuPrimitive.Overlay>
        </ContextMenuPrimitive.Portal>
    )
}
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = ({
    ref,
    style,
    inset,
    ...props
}: ContextMenuPrimitive.ItemProps & { inset?: boolean }) => {
    return (
        <TextStyleContext.Provider value={styles.itemContext}>
            <ContextMenuPrimitive.Item
                ref={ref}
                style={[
                    styles.item({ disabled: props?.disabled, inset }),
                    style as StyleProp<ViewStyle>,
                ]}
                {...props}
            />
        </TextStyleContext.Provider>
    )
}
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = ({
    ref,
    style,
    children,
    ...props
}: ContextMenuPrimitive.CheckboxItemProps) => {
    const { theme } = useUnistyles()

    return (
        <ContextMenuPrimitive.CheckboxItem
            ref={ref}
            style={[styles.checkbox({ disabled: props?.disabled }), style as StyleProp<ViewStyle>]}
            {...props}
        >
            <View style={styles.checkboxIndicator}>
                <ContextMenuPrimitive.ItemIndicator>
                    <Icon name="check" size={14} color={theme.colors.fg} />
                </ContextMenuPrimitive.ItemIndicator>
            </View>
            <>{children}</>
        </ContextMenuPrimitive.CheckboxItem>
    )
}
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = ({
    ref,
    style,
    children,
    ...props
}: ContextMenuPrimitive.RadioItemProps) => (
    <ContextMenuPrimitive.RadioItem
        ref={ref}
        style={[styles.radio({ disabled: props?.disabled }), style as StyleProp<ViewStyle>]}
        {...props}
    >
        <View style={styles.radioIndicator}>
            <ContextMenuPrimitive.ItemIndicator>
                <View style={styles.indicatorInner} />
            </ContextMenuPrimitive.ItemIndicator>
        </View>
        <>{children}</>
    </ContextMenuPrimitive.RadioItem>
)
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = ({
    ref,
    style,
    inset,
    ...props
}: ContextMenuPrimitive.LabelProps & { inset?: boolean }) => (
    <ContextMenuPrimitive.Label ref={ref} style={[styles.label({ inset }), style]} {...props} />
)
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = ({ ref, style, ...props }: ContextMenuPrimitive.SeparatorProps) => (
    <ContextMenuPrimitive.Separator ref={ref} style={[styles.separator, style]} {...props} />
)
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({ style, ...props }: React.ComponentPropsWithoutRef<RNText>) => {
    return <Text style={[styles.shortcut, style]} {...props} />
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

const styles = StyleSheet.create(theme => ({
    separator: {
        height: 1,
        marginLeft: 0 - theme.space.xxs,
        marginTop: theme.space.xxs,
        marginBottom: theme.space.xxs,
        backgroundColor: theme.colors.line2,
    },
    shortcut: {
        marginLeft: 'auto',
        color: theme.colors.fgMuted,
        ...typography(theme, 'labelSmall'),
    },
    label: ({ inset }) => ({
        ...typography(theme, 'bodySmallSemiBold'),
        paddingLeft: inset ? theme.space.lg : theme.space.default,
        paddingRight: theme.space.default,
        paddingTop: theme.space.xs,
        paddingBottom: theme.space.xs,
        _web: {
            cursor: 'default',
        },
    }),
    radio: ({ disabled }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        borderRadius: theme.radii.sm,
        paddingLeft: theme.space.lg,
        paddingRight: theme.space.xs,
        paddingTop: theme.space.xs,
        opacity: disabled ? 0.5 : undefined,
        pointerEvents: disabled ? 'none' : undefined,
        _active: {
            backgroundColor: theme.colors.accent.bg,
        },
        _web: {
            cursor: 'default',
            outline: 'none',
            _focus: {
                backgroundColor: theme.colors.accent.bg,
            },
        },
    }),
    radioIndicator: {
        ...theme.utils.flexCenter,
        position: 'absolute',
        left: theme.space.xxs,
        width: 14,
        height: 14,
    },
    indicatorInner: {
        backgroundColor: theme.colors.fg,
        width: 8,
        height: 8,
        borderRadius: theme.radii.full,
    },
    checkbox: ({ disabled }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        borderRadius: theme.radii.sm,
        paddingLeft: theme.space.lg,
        paddingRight: theme.space.xs,
        paddingTop: theme.space.xs,
        opacity: disabled ? 0.5 : undefined,
        pointerEvents: disabled ? 'none' : undefined,
        _active: {
            backgroundColor: theme.colors.accent.bg,
        },
        _web: {
            cursor: 'default',
            outline: 'none',
            _focus: {
                backgroundColor: theme.colors.accent.bg,
            },
        },
    }),
    checkboxIndicator: {
        ...theme.utils.flexCenter,
        position: 'absolute',
        left: theme.space.xxs,
        width: 14,
        height: 14,
    },
    item: ({ disabled, inset }) => ({
        ...theme.utils.flexCenter,
        position: 'relative',
        borderRadius: theme.radii.sm,
        gap: theme.gap(2),
        paddingLeft: inset ? theme.space.default : theme.space.xxs,
        paddingRight: theme.space.xxs,
        paddingTop: theme.space.xxs,
        paddingBottom: theme.space.xxs,
        opacity: disabled ? 0.5 : undefined,
        pointerEvents: disabled ? 'none' : undefined,
        _web: {
            cursor: 'default',
            outline: 'none',
            _active: {
                backgroundColor: theme.colors.accent.bg,
            },
            _focus: {
                backgroundColor: theme.colors.accent.bg,
            },
            _hover: {
                backgroundColor: theme.colors.accent.bg,
            },
        },
    }),
    itemContext: {
        userSelect: 'none',
        color: theme.colors.componentFg,
        ...typography(theme, 'bodySmall'),
        _focus: {
            color: theme.colors.accent.fg,
        },
    },
    overlay: {
        ...(isWeb ? theme.utils.absoluteFill : {}),
    },
    content: {
        zIndex: theme.zIndices[50],
        minWidth: 128,
        overflow: 'hidden',
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.line2,
        backgroundColor: theme.colors.componentBg,
        boxShadow: theme.boxShadows.md,
    },
    subContent: ({ open }: { open?: boolean }) => ({
        zIndex: theme.zIndices[50],
        minWidth: 128,
        overflow: 'hidden',
        backgroundColor: theme.colors.componentBg,
        borderColor: theme.colors.line2,
        borderWidth: 1,
        borderRadius: theme.radii.md,
        padding: theme.space.xxs,
        boxShadow: theme.boxShadows.md,
    }),
    subtriggerContext: ({ open }: { open?: boolean }) => ({
        // select-none text-sm native:text-lg text-primary
        color: open ? theme.colors.accent.fg : theme.colors.primary.fg,
        userSelect: 'none',
        ...typography(theme, 'body'),
    }),
    subtrigger: ({ inset, open }: { inset?: boolean; open?: boolean }) => ({
        ...theme.utils.flexCenter,
        display: 'flex',
        flexDirection: 'row',
        gap: theme.gap(2),
        backgroundColor: open ? theme.colors.accent.bg : undefined,
        borderRadius: theme.radii.sm,
        paddingLeft: inset ? theme.space.xl : theme.space.default,
        paddingRight: theme.space.default,
        userSelect: 'none',
        _active: {
            backgroundColor: theme.colors.accent.bg,
        },
        _hover: {
            backgroundColor: theme.colors.accent.bg,
        },
        _web: {
            cursor: 'default',
            outline: 'none',
            _focus: {
                backgroundColor: theme.colors.accent.bg,
            },
        },
    }),
    subtriggerIcon: {
        marginLeft: 'auto',
    },
}))

export {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuTrigger,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
}
