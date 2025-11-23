import { Platform, View, ViewStyle } from 'react-native'

import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { getSizeVariant } from '../../design-system/design-system.utils'
import * as ProgressPrimitive from '../primitives/progress'

const Progress = ({
    ref,
    style,
    value,
    indicatorStyle,
    ...props
}: ProgressPrimitive.RootProps & {
    indicatorStyle?: ViewStyle
}) => {
    return (
        <ProgressPrimitive.Root ref={ref} style={[styles.container, style]} {...props}>
            <Indicator value={value} style={indicatorStyle} />
        </ProgressPrimitive.Root>
    )
}
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

function Indicator({ value, style }: { value: number | undefined | null; style?: ViewStyle }) {
    const progress = useDerivedValue(() => value ?? 0)

    const indicator = useAnimatedStyle(() => {
        return {
            width: withSpring(
                `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
                { overshootClamping: true },
            ),
        }
    })

    if (Platform.OS === 'web') {
        return (
            <View
                style={[styles.indicatorWeb, { transform: `translateX(-${100 - (value ?? 0)}%)` }]}
            >
                <ProgressPrimitive.Indicator style={[{ width: '100%', height: '100%' }, style]} />
            </View>
        )
    }

    return (
        <ProgressPrimitive.Indicator asChild>
            <Animated.View style={[indicator, styles.indicator, style]} />
        </ProgressPrimitive.Indicator>
    )
}

const styles = StyleSheet.create(theme => ({
    indicator: {
        backgroundColor: theme.colors.fg,
        height: '100%',
    },
    indicatorWeb: {
        backgroundColor: theme.colors.primary.bg,
        height: '100%',
        width: '100%',
        _web: {
            flex: 1,
            transition: 'all',
        },
    },
    container: {
        // 'relative h-4 w-full overflow-hidden rounded-full bg-secondary'
        position: 'relative',
        height: getSizeVariant(16).height,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: theme.colors.accent.bg,
        borderRadius: theme.radii.full,
    },
}))
