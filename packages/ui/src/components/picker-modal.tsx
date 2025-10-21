import { useEffect, useRef, useState, type RefObject } from 'react'
import {
    AccessibilityProps,
    Animated,
    Easing,
    Modal,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from 'react-native'

import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

import { announceForAccessibility } from '../utils/a11y'
import { Checkbox } from './form/checkbox'
import { Radio } from './form/radio-input'
import { Spacer } from './layout/spacer'
import { Stack } from './layout/stack'
import { Text } from './text'

type Option = { label: string; value: string }

type BaseProps = {
    label: string
    options: Option[]
    isVisible: boolean
    onClose: () => void
}

type SingleValueProps = {
    multiple?: false
    selected: string
    onConfirm: (option: string) => void
}

type MultipleValueProps = {
    multiple: true
    selected: string[]
    onConfirm: (option: string[]) => void
}

type Props = AccessibilityProps & BaseProps & (SingleValueProps | MultipleValueProps)

type AnimatedPickerProps = {
    backdropAnimation: RefObject<Animated.Value>
    contentAnimation: RefObject<Animated.Value>
}

export function PickerModal({
    accessibilityHint = 'Allows you to pick an option from the list',
    accessibilityLabel = 'Picker modal',
    isVisible,
    onClose,
    ...rest
}: Props) {
    const backdropAnimation = useRef(new Animated.Value(isVisible ? 1 : 0))
    const contentAnimation = useRef(new Animated.Value(isVisible ? 1 : 0))

    function animateOpen(callback?: () => void) {
        Animated.parallel([
            Animated.timing(backdropAnimation.current, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(contentAnimation.current, {
                toValue: 1,
                duration: 300,
                easing: Easing.bezier(0.215, 0.61, 0.355, 1.0),
                useNativeDriver: true,
            }),
        ]).start(callback)
    }

    function animateClose(callback?: () => void) {
        Animated.parallel([
            Animated.timing(backdropAnimation.current, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(contentAnimation.current, {
                toValue: 0,
                duration: 200,
                easing: Easing.bezier(0.215, 0.61, 0.355, 1.0),
                useNativeDriver: true,
            }),
        ]).start(callback)
    }

    function handleClose() {
        animateClose(() => requestAnimationFrame(() => onClose()))
    }

    useEffect(() => {
        if (isVisible) animateOpen()
    }, [isVisible])

    return (
        <Modal
            animationType="none"
            transparent
            visible={isVisible}
            onRequestClose={handleClose}
            accessible
            accessibilityViewIsModal
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        >
            {rest.multiple ?
                <MultiplePicker
                    {...rest}
                    onClose={handleClose}
                    backdropAnimation={backdropAnimation}
                    contentAnimation={contentAnimation}
                />
            :   <SinglePicker
                    {...rest}
                    onClose={handleClose}
                    backdropAnimation={backdropAnimation}
                    contentAnimation={contentAnimation}
                />
            }
        </Modal>
    )
}

function PickerLayout({
    children,
    backdropAnimation,
    contentAnimation,
    onClose,
}: {
    children: React.ReactNode
    backdropAnimation: RefObject<Animated.Value>
    contentAnimation: RefObject<Animated.Value>
    onClose: () => void
}) {
    const dimensions = useWindowDimensions()
    const insets = useSafeAreaInsets()

    return (
        <View style={styles.wrapper}>
            <TouchableWithoutFeedback onPress={onClose} accessible={false}>
                <Animated.View style={[styles.backdrop, { opacity: backdropAnimation.current }]} />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    styles.content,
                    {
                        maxHeight: dimensions.height - insets.bottom - insets.top,
                        opacity: contentAnimation.current,
                        transform: [
                            {
                                translateY: contentAnimation.current.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [300, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                {children}
            </Animated.View>
        </View>
    )
}

type SinglePickerProps = Omit<BaseProps, 'isVisible'> & SingleValueProps & AnimatedPickerProps

function SinglePicker({
    label,
    options,
    selected: initialSelected,
    onClose,
    onConfirm,
    backdropAnimation,
    contentAnimation,
}: SinglePickerProps) {
    const [selected, setSelected] = useState(initialSelected)

    function handleSelect(value: string) {
        setSelected(value)
        setTimeout(() => {
            onConfirm(value)
            announceForAccessibility({ message: `Closing with ${value}` })
            requestAnimationFrame(() => onClose())
        }, 200)
    }

    return (
        <PickerLayout
            onClose={onClose}
            backdropAnimation={backdropAnimation}
            contentAnimation={contentAnimation}
        >
            <ScrollView accessibilityRole="list">
                <Stack axis="y" spacing="default">
                    <Text variant="bodySmallSemiBold">{label}</Text>
                    <FlashList
                        data={options}
                        extraData={selected} // Trigger re-render on selected change
                        keyExtractor={item => item.value}
                        ItemSeparatorComponent={() => <Spacer size="sm" />}
                        renderItem={({ item: opt }) => (
                            <Radio
                                label={opt.label}
                                value={opt.value}
                                checked={selected === opt.value}
                                onChange={() => handleSelect(opt.value)}
                            />
                        )}
                    />
                </Stack>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onClose}
                    accessibilityRole="button"
                >
                    <Text variant="bodyBold">Close</Text>
                </TouchableOpacity>
            </View>
        </PickerLayout>
    )
}

type MultiplePickerProps = Omit<BaseProps, 'isVisible'> & MultipleValueProps & AnimatedPickerProps

function MultiplePicker({
    label,
    options,
    selected: initialSelected,
    onClose,
    onConfirm,
    backdropAnimation,
    contentAnimation,
}: MultiplePickerProps) {
    const [selected, setSelected] = useState<string[]>(initialSelected)

    function toggle(value: string) {
        setSelected(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
        )
    }

    function handleDone() {
        onConfirm(selected)
        announceForAccessibility({
            message: `Closing with ${selected.join(', ')}`,
        })
        requestAnimationFrame(() => onClose())
    }

    return (
        <PickerLayout
            onClose={onClose}
            backdropAnimation={backdropAnimation}
            contentAnimation={contentAnimation}
        >
            <ScrollView accessibilityRole="list">
                <Stack axis="y" spacing="default">
                    <Text variant="bodySmallSemiBold">{label}</Text>
                    <FlashList
                        data={options}
                        extraData={selected} // Trigger re-render on selected change
                        keyExtractor={item => item.value}
                        ItemSeparatorComponent={() => <Spacer size="sm" />}
                        renderItem={({ item: opt }) => (
                            <Checkbox
                                key={opt.value}
                                label={opt.label}
                                value={opt.value}
                                checked={selected.includes(opt.value)}
                                onChange={() => toggle(opt.value)}
                            />
                        )}
                    />
                </Stack>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onClose}
                    accessibilityRole="button"
                >
                    <Text variant="body">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDone}
                    accessibilityRole="button"
                >
                    <Text variant="bodyBold">Done</Text>
                </TouchableOpacity>
            </View>
        </PickerLayout>
    )
}

const styles = StyleSheet.create(theme => ({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        ...theme.utils.absoluteFill,
    },
    content: {
        backgroundColor: theme.colors.bg,
        boxShadow: theme.boxShadows.soft3,
        padding: theme.space.md,
        borderTopLeftRadius: theme.radii.md,
        borderTopRightRadius: theme.radii.md,
        zIndex: 2,
    },
    footer: {
        flexDirection: 'row',
    },
    actionButton: {
        flex: 1,
        paddingTop: theme.space.default,
        paddingBottom: theme.space.md,
        ...theme.utils.flexCenter,
    },
}))
