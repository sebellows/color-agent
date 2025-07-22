import React, { createContext } from 'react'
import {
    useColorScheme,
    useWindowDimensions,
    ColorSchemeName,
    Platform,
    Appearance,
} from 'react-native'
import { useAccessibilityInfo, useDeviceOrientation } from '@react-native-community/hooks'
import { create } from './tailwind/create-tailwind'
import { AppContext, BaseTheme, Style, Utilities } from './tailwind/types'
import { useResponsive } from './tailwind/lib/useResponsive'
import { generateTheme } from './generate-theme'

const lightTheme = generateTheme('light')
const darkTheme = generateTheme('dark')

export type ThemeVariant = 'light' | 'dark'

export const ThemeContext = createContext((_classNames: string): Style => ({}))

interface Props extends AppContext {
    utilities: Utilities
}

/**
 * To select a component based on the current platform, use the `Platform.select` method.
 * This method allows you to define different components for different platforms.
 *
 * For example:
 * ```ts
 * const MyComponent = Platform.select({
 *   ios: () => <IOSComponent />,
 *   android: () => <AndroidComponent />,
 *   native: () => <ComponentForNative />,
 *   default: () => <ComponentForWeb />,
 * })()
 * ```
 */

export const ThemeProvider = <Theme extends BaseTheme>({
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

    return <ThemeContext.Provider value={tailwind}>{children}</ThemeContext.Provider>
}

export const useTailwind = () => {
    const context = React.useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

// import React from 'react'
// import { ThemeProvider as RestyleProvider } from '@shopify/restyle'

// import { generateTheme } from './generate-theme'

// const lightTheme = generateTheme('light')
// const darkTheme = generateTheme('dark')

// export type ThemeVariant = 'light' | 'dark'

// export function ThemeProvider({
//     children,
//     themeVariant,
// }: {
//     children: React.ReactNode
//     themeVariant?: ThemeVariant
// }) {
//     return (
//         <RestyleProvider theme={themeVariant === 'dark' ? darkTheme : lightTheme}>
//             {children}
//         </RestyleProvider>
//     )
// }
