import { Platform } from 'react-native'

export const isWeb = Platform.OS === 'web'
export const isServer = isWeb && typeof window === 'undefined'
export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
export const isNative = Platform.OS !== 'web'
