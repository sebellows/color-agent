import * as React from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import {
    getBorder,
    getPaddingX,
    getPaddingY,
    getRingOffsetStyles,
    getSizeVariant,
    typography,
} from '../../design-system/design-system.utils'
import { TypographyDefinition } from '../../design-system/design-tokens/utils'
import { isNative, isWeb } from '../../utils'
import * as SelectPrimitive from '../primitives/select'
import { Icon } from './icon'
import { LabelProps } from './label'
import { uiStyles } from './styles'
import { WithPortalHost, WithThemeStyleProps } from './util.types'

type Option = SelectPrimitive.Option

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const { animated, content, item, label, overlay, popper, separator } = uiStyles

const SelectTrigger = ({
    ref,
    style,
    children,
    ...props
}: WithThemeStyleProps<SelectPrimitive.TriggerProps>) => (
    <SelectPrimitive.Trigger
        ref={ref}
        style={[styles.trigger, style as StyleProp<ViewStyle>]}
        {...props}
    >
        <>{children}</>
        <Icon
            name="chevron-down"
            size={16}
            aria-hidden={true}
            color="fg"
            style={{ opacity: 0.5 }}
        />
    </SelectPrimitive.Trigger>
)
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * Platform: WEB ONLY
 */
const SelectScrollUpButton = ({ style, ...props }: SelectPrimitive.ScrollButtonProps) => {
    if (Platform.OS !== 'web') {
        return null
    }
    return (
        <SelectPrimitive.ScrollUpButton
            // TODO: fix `any` type
            style={[styles.scrollButton, style] as any}
            {...props}
        >
            <Icon name="chevron-up" color="fg" size={14} />
        </SelectPrimitive.ScrollUpButton>
    )
}

/**
 * Platform: WEB ONLY
 */
const SelectScrollDownButton = ({
    style,
    ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>) => {
    if (Platform.OS !== 'web') {
        return null
    }
    return (
        <SelectPrimitive.ScrollDownButton
            // TODO: fix `any` type
            style={[styles.scrollButton, style] as any}
            {...props}
        >
            <Icon name="chevron-down" color="fg" size={14} />
        </SelectPrimitive.ScrollDownButton>
    )
}

type SelectContentProps = WithThemeStyleProps<WithPortalHost<SelectPrimitive.ContentProps>>

const SelectContent = ({
    ref,
    style,
    children,
    position = 'popper',
    portalHost,
    side = 'top',
    ...props
}: SelectContentProps) => {
    const { open } = SelectPrimitive.useRootContext()

    return (
        <SelectPrimitive.Portal hostName={portalHost}>
            <SelectPrimitive.Overlay style={overlay.main}>
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <SelectPrimitive.Content
                        ref={ref}
                        style={
                            [
                                content.main(props),
                                popper.main({ usePopper: position === 'popper', ref }),
                                animated.fadeToggle({ open }),
                                style,
                            ] as SelectContentProps['style']
                        }
                        position={position}
                        {...props}
                    >
                        <SelectScrollUpButton />
                        <SelectPrimitive.Viewport
                            style={styles.viewport({ usePopper: position === 'popper' })}
                        >
                            {children}
                        </SelectPrimitive.Viewport>
                        <SelectScrollDownButton />
                    </SelectPrimitive.Content>
                </Animated.View>
            </SelectPrimitive.Overlay>
        </SelectPrimitive.Portal>
    )
}
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = ({ ref, style, ...props }: LabelProps) => (
    <SelectPrimitive.Label
        ref={ref}
        style={[label.main({ color: 'componentFg', ...props })]}
        {...props}
    />
)
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = ({ ref, style, children, ...props }: SelectPrimitive.ItemProps) => (
    <SelectPrimitive.Item
        ref={ref}
        style={[
            item.main({ justifyContent: 'flex-start', disabled: props?.disabled }),
            style as StyleProp<ViewStyle>,
        ]}
        {...props}
    >
        <View style={styles.indicatorWrapper}>
            <SelectPrimitive.ItemIndicator>
                <Icon name="check" size={16} color="componentFg" />
            </SelectPrimitive.ItemIndicator>
        </View>
        <SelectPrimitive.ItemText style={styles.itemText} />
    </SelectPrimitive.Item>
)
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = ({ ref, style, ...props }: SelectPrimitive.SeparatorProps) => (
    <SelectPrimitive.Separator ref={ref} style={[separator.main(), style]} {...props} />
)
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

const styles = StyleSheet.create(theme => ({
    indicatorWrapper: {
        height: getSizeVariant(14).height,
        position: 'absolute',
        left: isWeb ? theme.space.default : 14,
        paddingTop: isNative ? theme.space.px : undefined,
        ...theme.utils.flexCenter,
    },
    itemText: Object.assign({}, typography(theme, 'bodySmallMedium') as TypographyDefinition),
    viewport: ({ usePopper }) => ({
        padding: theme.space.xxs,
        ...(usePopper ?
            {
                width: '100%',
                _web: {
                    height: 'var(--radix-select-trigger-height)',
                    minWidth: 'var(--radix-select-trigger-width)',
                },
            }
        :   {}),
    }),
    scrollButton: {
        ...theme.utils.flexCenter,
        ...getPaddingY(theme, 'xxs'),
        _web: {
            cursor: 'default',
        },
    },
    trigger: {
        ...theme.utils.flexCenter,
        justifyContent: 'space-between',
        backgroundColor: theme.colors.componentBg,
        borderRadius: theme.radii.md,
        ...getBorder(theme, true, { borderColor: theme.colors.line3 }),
        ...getSizeVariant(isWeb ? 40 : 48),
        ...getPaddingX(theme, 'sm'),
        ...getPaddingY(theme, 'default'),
        _disabled: {
            opacity: 0.5,
        },
        _web: {
            ...getRingOffsetStyles(theme),
            _disabled: {
                cursor: 'not-allowed',
            },
        },
    },
}))

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    type Option,
}
