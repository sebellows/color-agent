import React, { createContext } from 'react'
import {
    useColorScheme,
    useWindowDimensions,
    ColorSchemeName,
    Platform,
    Appearance,
} from 'react-native'
import { useAccessibilityInfo, useDeviceOrientation } from '@react-native-community/hooks'
import { create } from './create-tailwind'
import { AppContext, BaseTheme, Style, Utilities } from './types'
import { useResponsive } from './lib/useResponsive'

export const TailwindContext = createContext((_classNames: string): Style => ({}))

interface Props extends AppContext {
    utilities: Utilities
}

export const TailwindProvider = <Theme extends BaseTheme>({
    utilities,
    theme,
    children,
}: React.PropsWithChildren<Props>) => {
    const nativeColorScheme = useColorScheme()
    const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(nativeColorScheme)
    const { width, height, scale: pixelDensity, fontScale } = useWindowDimensions()
    const { reduceMotionEnabled: reduceMotion } = useAccessibilityInfo()
    const orientation = useDeviceOrientation()
    const platform = Platform.OS
    const breakpoint = useResponsive(theme.breakpoints)

    const tailwind = React.useMemo(() => {
        return create(utilities, {
            breakpoint,
            colorScheme,
            fontScale,
            height,
            orientation,
            pixelDensity,
            platform,
            reduceMotion,
            theme,
            width,
        })
    }, [
        breakpoint,
        colorScheme,
        fontScale,
        height,
        orientation,
        pixelDensity,
        reduceMotion,
        theme,
        width,
        utilities,
    ])

    React.useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
            setColorScheme(newColorScheme)
        })

        return () => subscription.remove()
    }, [setColorScheme])

    return <TailwindContext.Provider value={tailwind}>{children}</TailwindContext.Provider>
}

export const useTailwind = () => {
    const context = React.useContext(TailwindContext)
    if (!context) {
        throw new Error('useTailwind must be used within a TailwindProvider')
    }
    return context
}
