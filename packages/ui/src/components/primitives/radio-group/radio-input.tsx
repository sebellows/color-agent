import { useEffect, useMemo, useRef } from 'react'
import { AccessibilityProps, Animated, PixelRatio, TouchableOpacity, View } from 'react-native'

import { Text } from '@ui/components/text'
import { StyleSheet } from 'react-native-unistyles'

type Props = AccessibilityProps & {
    onChange: (value: string) => void
    value: string
    checked: boolean
    label: string
}

export function Radio({
    onChange,
    checked,
    value,
    label,
    accessibilityHint = 'Double tap to select this option',
    accessibilityLabel: _accessibilityLabel,
    ...props
}: Props) {
    function onPress() {
        onChange(value)
    }

    styles.useVariants({ checked })

    const accessibilityLabel = useMemo(
        () => _accessibilityLabel ?? `Radio option: ${label}`,
        [_accessibilityLabel, label],
    )

    return (
        <TouchableOpacity
            {...props}
            style={styles.wrapper}
            onPress={onPress}
            activeOpacity={0.8}
            accessible
            accessibilityRole="radio"
            accessibilityState={{ checked }}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        >
            <View style={styles.radioOuter}>{checked && <RadioInner />}</View>
            <Text variant={checked ? 'bodyBold' : 'body'}>{label}</Text>
        </TouchableOpacity>
    )
}

function RadioInner() {
    const scale = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return <Animated.View style={[styles.radioCircle, { transform: [{ scale }] }]} />
}

const styles = StyleSheet.create(theme => ({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        position: 'relative',
        width: 24,
        height: 24,
        backgroundColor: 'transparent',
        borderRadius: theme.radii.full,
        borderWidth: PixelRatio.roundToNearestPixel(1.5), // match checkbox
        marginRight: theme.space.sm,
        borderColor: theme.colors.line1,
        variants: {
            checked: {
                true: {
                    borderColor: theme.colors.primary.bg,
                },
            },
        },
    },
    radioCircle: {
        position: 'absolute',
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
        borderRadius: theme.radii.full,
        backgroundColor: theme.colors.primary.bg,
    },
}))
