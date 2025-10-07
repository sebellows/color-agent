import { Platform, useWindowDimensions } from 'react-native'

import {
    useAccessibilityInfo,
    useAppState,
    useDeviceOrientation,
} from '@react-native-community/hooks'
import { isNumber } from 'es-toolkit/compat'
import { UnistylesBreakpoints, UnistylesRuntime, UnistylesThemes } from 'react-native-unistyles'

import breakpoints from './theme/design-tokens/breakpoints'

interface GlobalStoreValue {
    boldTextEnabled: boolean
    reduceMotion: boolean
    reduceTransparency: boolean
    screenReaderEnabled: boolean
    dimensions: { width: number; height: number }
    pixelDensity: number
    fontScale: number
    orientation: 'portrait' | 'landscape'
    isAndroid: boolean
    isIOS: boolean
    isWeb: boolean
    getBreakpoint: () => keyof UnistylesBreakpoints | undefined
    isMobile: () => boolean
    isTablet: () => boolean
    isDesktop: () => boolean
    isActive: () => boolean
    isInBackground: () => boolean
    isInactive: () => boolean
    colorScheme: () => 'light' | 'dark' | 'unspecified'
    themeName: () => keyof UnistylesThemes | undefined
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

export const useGlobals = (): GlobalStoreValue => {
    const { width, height, scale: pixelDensity, fontScale } = useWindowDimensions()
    const {
        boldTextEnabled = false,
        reduceMotionEnabled: reduceMotion = false,
        reduceTransparencyEnabled: reduceTransparency = false,
        screenReaderEnabled = false,
    } = useAccessibilityInfo()
    const appStatus = useAppState()
    const platform = Platform.OS

    /**
     * UnistylesRuntime also tracks `orientation`.
     * NOTE: Unistyles does not read user preferences and is not a 1-to-1 with
     * React Native's `Appearance` module.
     */
    const orientation = useDeviceOrientation()

    return {
        dimensions: { width, height },
        pixelDensity,
        fontScale,
        orientation,
        boldTextEnabled,
        reduceMotion,
        reduceTransparency,
        screenReaderEnabled,
        isAndroid: platform === 'android',
        isIOS: platform === 'ios',
        isWeb: platform === 'web',
        getBreakpoint: () => UnistylesRuntime.breakpoint,
        isMobile: () =>
            isNumber(UnistylesRuntime.breakpoint) &&
            UnistylesRuntime.breakpoint < breakpoints.phone,
        isTablet: () =>
            isNumber(UnistylesRuntime.breakpoint) &&
            UnistylesRuntime.breakpoint < breakpoints.tablet,
        isDesktop: () =>
            isNumber(UnistylesRuntime.breakpoint) &&
            UnistylesRuntime.breakpoint < breakpoints.desktop,
        isActive: () => appStatus === 'active',
        isInactive: () => appStatus === 'inactive',
        isInBackground: () => appStatus === 'background',
        colorScheme: () => UnistylesRuntime.colorScheme,
        themeName: () => UnistylesRuntime.themeName,
    }
}
