import * as React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { getBorder, getSizeVariant } from '../../design-system/design-system.utils'
import { SizeToken } from '../../design-system/design-tokens/sizes'
import { Color, Space } from '../../theme/theme.types'
import { isWeb } from '../../utils'
import * as MenubarPrimitive from '../primitives/menubar'
import { Icon } from './icon'
import { ThemeStyleProps, uiStyles } from './styles'
import { TextStyleContext } from './text'

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = ({
    ref,
    height = isWeb ? 40 : 48,
    style,
    ...props
}: MenubarPrimitive.RootProps & { height?: SizeToken }) => (
    <MenubarPrimitive.Root ref={ref} style={[styles.container({ height }), style]} {...props} />
)
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = ({ ref, style, ...props }: MenubarPrimitive.TriggerProps) => {
    const { value } = MenubarPrimitive.useRootContext()
    const { value: itemValue } = MenubarPrimitive.useMenuContext()

    return (
        <MenubarPrimitive.Trigger
            ref={ref}
            style={[
                uiStyles.trigger({ isActive: value === itemValue }),
                style as StyleProp<ViewStyle>,
            ]}
            {...props}
        />
    )
}
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = ({
    ref,
    style,
    inset,
    children,
    ...props
}: MenubarPrimitive.SubTriggerProps & { inset?: boolean }) => {
    const { open } = MenubarPrimitive.useSubContext()
    const iconName =
        isWeb ? 'chevron-right'
        : open ? 'chevron-up'
        : 'chevron-down'
    return (
        <TextStyleContext.Provider value={uiStyles.subtriggerContext({ open })}>
            <MenubarPrimitive.SubTrigger
                ref={ref}
                style={[uiStyles.subtrigger({ open, inset }), style as StyleProp<ViewStyle>]}
                {...props}
            >
                <>{children}</>
                <Icon name={iconName} size={18} color="fg" style={{ marginLeft: 'auto' }} />
            </MenubarPrimitive.SubTrigger>
        </TextStyleContext.Provider>
    )
}
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = ({
    ref,
    style,
    ...props
}: MenubarPrimitive.SubContentProps & ThemeStyleProps) => {
    // const { open } = MenubarPrimitive.useSubContext()
    // 'z-50 min-w-[8rem] overflow-hidden rounded-md border mt-1 border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
    // open ?
    //     'web:animate-in web:fade-in-0 web:zoom-in-95'
    // :   'web:animate-out web:fade-out-0 web:zoom-out ',
    return (
        <MenubarPrimitive.SubContent
            ref={ref}
            style={[uiStyles.card({ padding: 'xxs', zIndex: '50', ...props }), style]}
            {...props}
        />
    )
}
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = ({
    ref,
    style,
    portalHost,
    ...props
}: MenubarPrimitive.ContentProps & { portalHost?: string }) => {
    // const { value } = MenubarPrimitive.useRootContext()
    // const { value: itemValue } = MenubarPrimitive.useMenuContext()
    return (
        <MenubarPrimitive.Portal hostName={portalHost}>
            <MenubarPrimitive.Content
                ref={ref}
                style={
                    [
                        uiStyles.card({ padding: 'xxs', zIndex: '50', ...props }),
                        style,
                    ] as MenubarPrimitive.ContentProps['style']
                }
                {...props}
            />
        </MenubarPrimitive.Portal>
    )
}
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = ({
    ref,
    style,
    inset,
    ...props
}: MenubarPrimitive.ItemProps & { inset?: boolean }) => (
    <TextStyleContext.Provider value={uiStyles.itemContext}>
        <MenubarPrimitive.Item
            ref={ref}
            style={[
                uiStyles.item({ disabled: props?.disabled, inset }),
                style as StyleProp<ViewStyle>,
            ]}
            {...props}
        />
    </TextStyleContext.Provider>
)
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = ({
    ref,
    style,
    children,
    checked,
    size = 14,
    ...props
}: MenubarPrimitive.CheckboxItemProps & { size?: SizeToken }) => (
    <MenubarPrimitive.CheckboxItem
        ref={ref}
        style={[uiStyles.checkbox(props), style as StyleProp<ViewStyle>]}
        checked={checked}
        {...props}
    >
        <View style={uiStyles.checkboxIndicator({ size })}>
            <MenubarPrimitive.ItemIndicator>
                <Icon name="check" size={size} color="fg" />
            </MenubarPrimitive.ItemIndicator>
        </View>
        <>{children}</>
    </MenubarPrimitive.CheckboxItem>
)
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = ({
    ref,
    size = 14,
    indicatorColor,
    indicatorSize = 8,
    style,
    children,
    ...props
}: MenubarPrimitive.RadioItemProps & {
    size?: SizeToken
    indicatorSize?: SizeToken
    indicatorColor?: Color
}) => (
    <MenubarPrimitive.RadioItem
        ref={ref}
        style={[uiStyles.radio(props), style as StyleProp<ViewStyle>]}
        {...props}
    >
        <View style={uiStyles.radioIndicator({ size })}>
            <MenubarPrimitive.ItemIndicator>
                <View
                    style={uiStyles.indicatorInner({ size: indicatorSize, color: indicatorColor })}
                />
            </MenubarPrimitive.ItemIndicator>
        </View>
        <>{children}</>
    </MenubarPrimitive.RadioItem>
)
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = ({
    ref,
    style,
    inset,
    ...props
}: MenubarPrimitive.LabelProps & { inset?: boolean }) => (
    <MenubarPrimitive.Label ref={ref} style={[uiStyles.label({ inset }), style]} {...props} />
)
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = ({
    ref,
    gap,
    style,
    ...props
}: MenubarPrimitive.SeparatorProps & { gap?: Space }) => (
    <MenubarPrimitive.Separator ref={ref} style={[uiStyles.separator({ gap }), style]} {...props} />
)
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({ style, ...props }: React.ComponentPropsWithoutRef<typeof Text>) => {
    return <Text style={[uiStyles.shortcut, style]} {...props} />
}
MenubarShortcut.displayName = 'MenubarShortcut'

const styles = StyleSheet.create(theme => ({
    container: ({ height }) => ({
        // 'flex flex-row h-10 native:h-12 items-center space-x-1 rounded-md border border-border bg-background p-1'
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: getSizeVariant(height).height,
        backgroundColor: theme.colors.bg,
        borderRadius: theme.radii.md,
        ...getBorder(theme, true),
        padding: theme.space.xxs,
    }),
}))

export {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarPortal,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
}
