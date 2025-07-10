import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
    withRepeat,
} from 'react-native-reanimated'

import { Theme } from '@ui/theme'
import { ColorProps, useTheme } from '@shopify/restyle'
import { AnimatedBox, Box, BoxProps } from '../box/box'
import { useThemeSize } from '../../resolvers/size-resolver'
import { PlatformEnv } from '../../types'

const sizeAliases = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
    '3xl': 96,
}

type SizeAlias = keyof typeof sizeAliases

type SpinnerProps = {
    color?: ColorProps<Theme>['color']
    size?: keyof Theme['sizes'] | SizeAlias
} & BoxProps

export const Spinner = ({
    color = 'accent.bg-primary',
    size = 'md',
    zIndex = '10',
    ...props
}: SpinnerProps) => {
    const theme = useTheme<Theme>()

    const rotation = useSharedValue(0)

    const { resolveSizeProps } = useThemeSize(PlatformEnv.mobile)

    const spinnerSize = React.useMemo(() => {
        const sizeValue = size in sizeAliases ? sizeAliases[size as SizeAlias] : size
        return resolveSizeProps(sizeValue)
    }, [size, resolveSizeProps])

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${rotation.value * 360}deg`,
                },
            ],
        }
    })

    React.useEffect(() => {
        rotation.value = withRepeat(
            withTiming(1, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
        )
    }, [rotation, rotation.value])

    return (
        <Box flex={1} justifyContent="center" alignItems="center" zIndex={zIndex} {...props}>
            <AnimatedBox
                {...spinnerSize}
                borderRadius="full"
                borderColor={color}
                borderBottomColor="transparent"
                position="absolute"
                style={animatedStyles}
            ></AnimatedBox>
        </Box>
    )
}
