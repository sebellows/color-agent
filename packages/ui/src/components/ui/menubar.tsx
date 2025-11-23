import * as React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { getBorder, getSizeVariant } from '../../design-system/design-system.utils'
import { SizeToken } from '../../design-system/design-tokens/sizes'
import { Color, Space } from '../../theme/theme.types'
import { isWeb } from '../../utils'
import * as MenubarPrimitive from '../primitives/menubar'
import { Icon } from './icon'
import { uiStyles } from './styles'
import { TextStyleContext } from './text'
import { WithThemeStyleProps } from './util.types'

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const {
    animated,
    checkbox,
    content,
    item,
    label,
    radio,
    separator,
    shortcut,
    trigger,
    subtrigger,
} = uiStyles

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
            style={[trigger.main({ isActive: value === itemValue }), style as StyleProp<ViewStyle>]}
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
        <TextStyleContext.Provider value={subtrigger.textContext({ open })}>
            <MenubarPrimitive.SubTrigger
                ref={ref}
                style={[subtrigger.main({ open, inset }), style as StyleProp<ViewStyle>]}
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
}: WithThemeStyleProps<MenubarPrimitive.SubContentProps>) => {
    const { open } = MenubarPrimitive.useSubContext()
    return (
        <MenubarPrimitive.SubContent
            ref={ref}
            style={[
                content.main({ padding: 'xxs', zIndex: '50', ...props }),
                animated.toggleSubcontent({ open }),
                style,
            ]}
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
    const { value } = MenubarPrimitive.useRootContext()
    const { value: itemValue } = MenubarPrimitive.useMenuContext()

    return (
        <MenubarPrimitive.Portal hostName={portalHost}>
            <MenubarPrimitive.Content
                ref={ref}
                style={
                    [
                        content.main({ padding: 'xxs', zIndex: '50', ...props }),
                        animated.toggle({ open: value === itemValue }),
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
    <TextStyleContext.Provider value={item.textContext}>
        <MenubarPrimitive.Item
            ref={ref}
            style={[item.main({ disabled: props?.disabled, inset }), style as StyleProp<ViewStyle>]}
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
        style={[checkbox.main(props), style as StyleProp<ViewStyle>]}
        checked={checked}
        {...props}
    >
        <View style={checkbox.indicator({ size })}>
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
        style={[radio.main(props), style as StyleProp<ViewStyle>]}
        {...props}
    >
        <View style={radio.indicator({ size })}>
            <MenubarPrimitive.ItemIndicator>
                <View
                    style={radio.indicatorInner({ size: indicatorSize, color: indicatorColor })}
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
    <MenubarPrimitive.Label ref={ref} style={[label.main({ inset }), style]} {...props} />
)
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = ({
    ref,
    gap,
    style,
    ...props
}: MenubarPrimitive.SeparatorProps & { gap?: Space }) => (
    <MenubarPrimitive.Separator ref={ref} style={[separator.main({ gap }), style]} {...props} />
)
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({ style, ...props }: React.ComponentPropsWithoutRef<typeof Text>) => {
    return <Text style={[shortcut.main, style]} {...props} />
}
MenubarShortcut.displayName = 'MenubarShortcut'

const styles = StyleSheet.create(theme => ({
    container: ({ height }) => ({
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
