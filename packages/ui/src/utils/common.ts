import { Platform } from 'react-native'

import { isFunction } from 'es-toolkit'

export const isWeb = Platform.OS === 'web'
export const isServer = isWeb && typeof window === 'undefined'
export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
export const isNative = Platform.OS !== 'web'

export const callAll =
    (...fns: ((...args: any[]) => any)[]) =>
    (...args: any[]) => {
        fns.forEach(fn => isFunction(fn) && fn(...args))
    }
