import { Platform } from 'react-native'

import { isFunction } from 'es-toolkit'

/**
 * Taken from react-native-reanimated
 * @see {@link https://github.com/software-mansion/react-native-reanimated/blob/main/packages/react-native-reanimated/src/common/constants/platform.ts}
 */
function isWindowAvailable() {
    // the window object is unavailable when building the server portion of a site that uses SSG
    // this function shouldn't be used to conditionally render components
    // https://www.joshwcomeau.com/react/the-perils-of-rehydration/
    // @ts-ignore Fallback if `window` is undefined.
    return typeof window !== 'undefined'
}

export const isWeb = Platform.OS === 'web'
export const isServer = isWeb && typeof window === 'undefined'
export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
export const isNative = Platform.OS !== 'web'

export const IS_WINDOW_AVAILABLE = isWindowAvailable()

export function isReducedMotionEnabled() {
    return isWeb && IS_WINDOW_AVAILABLE ?
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        :   false
}

export const IS_REDUCED_MOTION_ENABLED = isReducedMotionEnabled()

export const callAll =
    (...fns: ((...args: any[]) => any)[]) =>
    (...args: any[]) => {
        fns.forEach(fn => isFunction(fn) && fn(...args))
    }
