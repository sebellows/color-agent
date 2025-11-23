import { StyleProp, View, ViewStyle } from 'react-native'

import Animated, {
    Extrapolation,
    FadeInLeft,
    FadeOutLeft,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import {
    getBorder,
    getColor,
    getPaddingX,
    getPaddingY,
    getSizeVariant,
    typography,
} from '../../design-system/design-system.utils'
import { isNative, isWeb } from '../../utils'
import * as NavigationMenuPrimitive from '../primitives/navigation-menu'
import { createGroupContext } from './group.context'
import { Icon } from './icon'
import { uiStyles } from './styles'
import { WithPortalHost } from './util.types'

const NavigationMenu = ({ ref, style, children, ...props }: NavigationMenuPrimitive.RootProps) => (
    <NavigationMenuPrimitive.Root ref={ref} style={[styles.container, style]} {...props}>
        {children}
        {isWeb && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
)
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = ({ ref, style, ...props }: NavigationMenuPrimitive.ListProps) => {
    const { GroupProvider } = createGroupContext()

    return (
        <GroupProvider flexDirection="row" space="xxs">
            <NavigationMenuPrimitive.List ref={ref} style={[styles.list, style]} {...props} />
        </GroupProvider>
    )
}
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = StyleSheet.create(theme => ({
    trigger: {
        ...theme.utils.flexCenter,
        backgroundColor: theme.colors.bg,
        borderRadius: theme.radii.md,
        height: getSizeVariant(isWeb ? 12 : 14).height,
        ...getPaddingY(theme, 'default'),
        ...getPaddingX(theme, isWeb ? 'md' : 'sm'),
        ...typography(theme, 'bodySmallMedium'),
        _active: {
            backgroundColor: getColor(theme, 'accent.bg'),
            color: getColor(theme, 'accent.fg'),
        },
        _disabled: {
            opacity: 0.5,
        },
        _web: {
            display: 'inline-flex',
            width: 'max-content',
            _focus: {
                backgroundColor: getColor(theme, 'accent.bg'),
                color: getColor(theme, 'accent.fg'),
            },
            _hover: {
                backgroundColor: getColor(theme, 'accent.bg'),
                color: getColor(theme, 'accent.fg'),
            },
            _disabled: {
                pointerEvents: 'none',
            },
            _classNames: ['transition-colors'],
        },
    },
}))

const NavigationMenuTrigger = ({
    ref,
    style,
    children,
    ...props
}: NavigationMenuPrimitive.TriggerProps) => {
    const { value } = NavigationMenuPrimitive.useRootContext()
    const { value: itemValue } = NavigationMenuPrimitive.useItemContext()

    const progress = useDerivedValue(() =>
        value === itemValue ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 }),
    )
    const chevronStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${progress.value * 180}deg` }],
        opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP),
    }))

    return (
        <NavigationMenuPrimitive.Trigger
            ref={ref}
            style={[
                styles.trigger({ isActive: value === itemValue }),
                style as StyleProp<ViewStyle>,
            ]}
            {...props}
        >
            <>{children}</>
            <Animated.View style={chevronStyle}>
                <Icon
                    name="chevron-down"
                    size={12}
                    color="fg"
                    style={styles.triggerIcon}
                    aria-hidden={true}
                />
            </Animated.View>
        </NavigationMenuPrimitive.Trigger>
    )
}
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = ({
    ref,
    style,
    children,
    portalHost,
    ...props
}: WithPortalHost<NavigationMenuPrimitive.ContentProps>) => {
    const { value } = NavigationMenuPrimitive.useRootContext()
    const { value: itemValue } = NavigationMenuPrimitive.useItemContext()

    return (
        <NavigationMenuPrimitive.Portal hostName={portalHost}>
            <NavigationMenuPrimitive.Content
                ref={ref}
                style={
                    [
                        styles.content,
                        uiStyles.animated.slideToggle({ open: value === itemValue, dir: 'left' }),
                        style,
                    ] as NavigationMenuPrimitive.ContentProps['style']
                }
                {...props}
            >
                <Animated.View
                    entering={isNative ? FadeInLeft : undefined}
                    exiting={isNative ? FadeOutLeft : undefined}
                >
                    {children}
                </Animated.View>
            </NavigationMenuPrimitive.Content>
        </NavigationMenuPrimitive.Portal>
    )
}
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = ({
    ref,
    style,
    ...props
}: NavigationMenuPrimitive.ViewportProps) => {
    return (
        <View style={styles.viewport}>
            <View style={[styles.viewportInner, style]} ref={ref} {...props}>
                <NavigationMenuPrimitive.Viewport />
            </View>
        </View>
    )
}
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = ({
    ref,
    style,
    ...props
}: NavigationMenuPrimitive.IndicatorProps) => {
    const { value } = NavigationMenuPrimitive.useRootContext()
    const { value: itemValue } = NavigationMenuPrimitive.useItemContext()

    return (
        <NavigationMenuPrimitive.Indicator
            ref={ref}
            style={[
                styles.indicator,
                uiStyles.animated.fadeToggle({ active: value === itemValue }),
                style,
            ]}
            {...props}
        >
            <View style={styles.indicatorInner} />
        </NavigationMenuPrimitive.Indicator>
    )
}
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

const styles = StyleSheet.create((theme, rt) => ({
    indicatorInner: {
        backgroundColor: theme.colors.line2,
        borderTopLeftRadius: theme.radii.sm,
        boxShadow: theme.boxShadows.md,
        position: 'relative',
        top: '60%',
        ...getSizeVariant(8),
        _web: {
            _classNames: 'rotate-45',
        },
    },
    indicator: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        top: '100%',
        height: 6,
        zIndex: 1,
        overflow: 'hidden',
    },
    viewportInner: {
        position: 'relative',
        marginTop: theme.space.xs,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: theme.colors.componentBg,
        borderRadius: theme.radii.md,
        boxShadow: theme.boxShadows.lg,
        color: theme.colors.componentFg,
        ...getBorder(theme),
        _web: {
            height: `${rt.screen.height}px`,
            transformOrigin: 'top center',
            _classNames: 'zoom-in-90',
        },
    },
    viewport: {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: '100%',
    },
    content: {
        width: '100%',
        ...(isNative ?
            {
                backgroundColor: theme.colors.componentBg,
                color: theme.colors.componentFg,
                ...getBorder(theme, true),
                borderRadius: theme.radii.lg,
                boxShadow: theme.boxShadows.lg,
                overflow: 'hidden',
            }
        :   {}),
    },
    triggerIcon: {
        // 'relative text-foreground h-3 w-3 web:transition web:duration-200'
        position: 'relative',
        _web: {
            transitionDuration: '200ms',
            _classNames: ['transition-colors', 'ease-in-out'],
        },
    },
    trigger: ({ isActive }: { isActive?: boolean }) => ({
        ...theme.utils.flexCenter,
        borderRadius: theme.radii.md,
        height: getSizeVariant(isWeb ? 40 : 48).height,
        gap: theme.gap('xs'),
        ...getPaddingX(theme, isWeb ? 'sm' : 'md'),
        ...getPaddingY(theme, 'default'),
        ...typography(theme, 'bodySmallMedium'),
        backgroundColor: isActive ? theme.colors.accent.bg : undefined,
        _active: {
            backgroundColor: theme.colors.accent.bg,
        },
        _web: {
            display: 'inline-flex',
            width: 'max-content',
            transitionProperty:
                'color, background-color, border-color, text-decoration-color, fill, stroke',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms',
            _focus: {
                outline: 'none',
                backgroundColor: theme.colors.accent.bg,
                color: theme.colors.accent.fg,
            },
            _hover: {
                backgroundColor: theme.colors.accent.bg,
                color: theme.colors.accent.fg,
            },
            _disabled: {
                pointerEvents: 'none',
                opacity: 0.5,
            },
        },
    }),
    list: {
        ...theme.utils.flexCenter,
        flexGrow: 1,
        gap: theme.gap('xxs'),
        _web: {
            listStyle: 'none',
        },
    },
    container: {
        ...theme.utils.flexCenter,
        position: 'relative',
        zIndex: theme.zIndices['10'],
        _web: {
            maxWidth: 'max-content',
        },
    },
}))

export {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
}
