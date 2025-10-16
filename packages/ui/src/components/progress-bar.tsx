import { useEffect, type JSX } from 'react'
import { View } from 'react-native'

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
    /** The current step of the form. */
    step: number
    /** The total number of steps in the form. */
    totalSteps: number
    /** The height of the progress bar. */
    height?: number
    /** Whether the progress bar should animate (default: false). */
    animated?: boolean
}

/**
 * Renders a progress bar for a multi-step form.
 */
export function ProgressBar({
    step,
    totalSteps,
    height = 12,
    animated = true,
}: Props): JSX.Element {
    const progress = Math.min(Math.max((step / totalSteps) * 100, 0), 100)

    const progressAnim = useSharedValue(0)

    useEffect(() => {
        progressAnim.value = withTiming(progress, {
            duration: animated ? 200 : 0,
        })
    }, [step])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progressAnim.value}%`,
        }
    })

    return (
        <View
            style={[styles.progressContainer, { height }]}
            accessible
            accessibilityRole="progressbar"
            accessibilityValue={{ now: step, min: 0, max: totalSteps }}
        >
            <Animated.View style={[styles.progress, { height }, animatedStyle]} />
        </View>
    )
}

const styles = StyleSheet.create(theme => ({
    progressContainer: {
        borderRadius: theme.radii.full,
        backgroundColor: theme.colors.bgMutedHover,
    },
    progress: {
        backgroundColor: theme.colors.primary.bg,
        borderRadius: theme.radii.full,
    },
}))
