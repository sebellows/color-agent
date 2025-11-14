import * as React from 'react'
import { Platform, Pressable, StyleProp, View } from 'react-native'

import Animated, {
    Extrapolation,
    FadeIn,
    FadeOutUp,
    interpolate,
    LayoutAnimationConfig,
    LinearTransition,
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import * as AccordionPrimitive from '../primitives/accordion'
import { Icon } from './icon'
import { TextStyleContext } from './text'

const Accordion = ({ ref, children, ...props }: AccordionPrimitive.RootProps) => {
    return (
        <LayoutAnimationConfig skipEntering>
            <AccordionPrimitive.Root ref={ref} {...props} asChild={Platform.OS !== 'web'}>
                <Animated.View layout={LinearTransition.duration(200)}>{children}</Animated.View>
            </AccordionPrimitive.Root>
        </LayoutAnimationConfig>
    )
}
Accordion.displayName = AccordionPrimitive.Root.displayName

const AccordionItem = ({ ref, style, value, ...props }: AccordionPrimitive.ItemProps) => {
    return (
        <Animated.View style={styles.itemWrapper} layout={LinearTransition.duration(200)}>
            <AccordionPrimitive.Item
                ref={ref}
                style={[styles.item, style]}
                value={value}
                {...props}
            />
        </Animated.View>
    )
}
AccordionItem.displayName = AccordionPrimitive.Item.displayName

const Trigger = Platform.OS === 'web' ? View : Pressable

const AccordionTrigger = ({ ref, style, children, ...props }: AccordionPrimitive.TriggerProps) => {
    const { isExpanded } = AccordionPrimitive.useItemContext()

    const progress = useDerivedValue(() =>
        isExpanded ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 }),
    )
    const chevronStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${progress.value * 180}deg` }],
        opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP),
    }))

    return (
        // "native:text-lg font-medium web:group-hover:underline"
        <TextStyleContext.Provider value={styles.context}>
            <AccordionPrimitive.Header style={styles.header}>
                <AccordionPrimitive.Trigger ref={ref} {...props} asChild>
                    <Trigger style={styles.trigger}>
                        <>{children}</>
                        <Animated.View style={chevronStyle}>
                            <Icon
                                name="chevron-down"
                                size={18}
                                color="fg"
                                style={styles.arrowIcon}
                            />
                        </Animated.View>
                    </Trigger>
                </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
        </TextStyleContext.Provider>
    )
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = ({
    ref,
    style,
    children,
    ...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Content>) => {
    const { isExpanded } = AccordionPrimitive.useItemContext()
    return (
        <TextStyleContext.Provider value={{ variant: 'body' }}>
            <AccordionPrimitive.Content style={styles.content({ isExpanded })} ref={ref} {...props}>
                <InnerContent style={styles.innerContent}>{children}</InnerContent>
            </AccordionPrimitive.Content>
        </TextStyleContext.Provider>
    )
}

function InnerContent({ children, style }: { children: React.ReactNode; style?: StyleProp<any> }) {
    if (Platform.OS === 'web') {
        return <View style={[styles.innerContent, style]}>{children}</View>
    }
    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOutUp.duration(200)}
            style={[styles.innerContent, style]}
        >
            {children}
        </Animated.View>
    )
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName

const styles = StyleSheet.create(theme => ({
    context: {
        fontSize: theme.fontSizes['lead'],
        fontWeight: 500,
    },
    header: {
        flex: 1,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.space.sm,

        _web: {
            flex: 1,
            transitionProperty: 'all',
            transitionDuration: '200ms',
            outlineStyle: 'none',
            ':focus-visible': {
                boxShadow: `0 0 0 1px ${theme.colors.bgMuted}`,
            },
        },
    },
    itemWrapper: {
        overflow: 'hidden',
    },
    item: {
        borderBottom: 1,
        borderColor: theme.colors.line2,
    },
    content: ({ isExpanded }) => ({
        overflow: 'hidden',
        fontSize: theme.fontSizes.bodySmall,
        variants: {
            isExpanded: {
                true: {
                    height: 'auto',
                    opacity: 1,
                    paddingTop: theme.space.sm,
                },
                false: {
                    height: 0,
                    opacity: 0,
                    paddingTop: 0,
                },
            },
        },
        _web: {
            transitionProperty: 'all',
            transitionDuration: '200ms',
            animate: isExpanded ? 'accordion-down 0.2s ease-out' : 'accordion-up 0.2s ease-out',
        },
    }),
    innerContent: {
        paddingBottom: theme.space.md,
    },
    arrowIcon: {
        flexShrink: 0,
    },
}))

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
