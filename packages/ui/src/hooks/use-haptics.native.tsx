import React, { createContext, ReactNode, useContext } from 'react'
import { Platform } from 'react-native'

import { assertUnreachable } from '@coloragent/utils'
import { isFunction, noop } from 'es-toolkit'
import { get } from 'es-toolkit/compat'
import {
    impactAsync,
    ImpactFeedbackStyle,
    notificationAsync,
    NotificationFeedbackType,
    selectionAsync,
} from 'expo-haptics'
import { Get, Paths, ValueOf } from 'type-fest'

const HAPTICS_ENABLED = Platform.OS === 'ios'

interface HapticsContextValue {
    enabled: boolean
}

const HapticsContext = createContext<HapticsContextValue>({ enabled: true })

interface HapticsProviderProps {
    enabled: boolean
    children: ReactNode
}

export function HapticsProvider({ children, enabled = HAPTICS_ENABLED }: HapticsProviderProps) {
    return <HapticsContext.Provider value={{ enabled }}>{children}</HapticsContext.Provider>
}

function useHapticsContext(): HapticsContextValue {
    return useContext(HapticsContext)
}

export const HapticFeedback = {
    /** @see expo-haptics/src/Haptics.types.ts#ImpactFeedbackStyle */
    light: ImpactFeedbackStyle.Light,
    medium: ImpactFeedbackStyle.Medium,
    heavy: ImpactFeedbackStyle.Heavy,
    rigid: ImpactFeedbackStyle.Rigid,
    soft: ImpactFeedbackStyle.Soft,
    // Selection
    selection: 'selection',
    /** @see expo-haptics/src/Haptics.types.ts#NotificationFeedbackType */
    success: NotificationFeedbackType.Success,
    warning: NotificationFeedbackType.Warning,
    error: NotificationFeedbackType.Error,
} as const

type HapticFeedback = typeof HapticFeedback

export const HapticsFeedback = {
    /** @see expo-haptics/src/Haptics.types.ts#ImpactFeedbackStyle */
    impact: {
        light: ImpactFeedbackStyle.Light,
        medium: ImpactFeedbackStyle.Medium,
        heavy: ImpactFeedbackStyle.Heavy,
        rigid: ImpactFeedbackStyle.Rigid,
        soft: ImpactFeedbackStyle.Soft,
    },
    // Selection
    selection: 'selection',
    /** @see expo-haptics/src/Haptics.types.ts#NotificationFeedbackType */
    notify: {
        success: NotificationFeedbackType.Success,
        warning: NotificationFeedbackType.Warning,
        error: NotificationFeedbackType.Error,
    },
} as const

type HapticsFeedback = typeof HapticsFeedback
type HapticsFeedbackKey = keyof HapticFeedback | Paths<HapticsFeedback>

type PressableHapticFeedbackType = keyof HapticsFeedback['impact']

export type HapticFeedbackType<Key extends HapticsFeedbackKey = HapticsFeedbackKey> =
    Key extends keyof HapticFeedback ? ValueOf<typeof HapticFeedback, Key>
    : Key extends Paths<HapticsFeedback> ? Get<HapticsFeedback, Key>
    : never

/** Function to trigger haptics based on the feedback type */
const hapticToTrigger = (haptic: HapticFeedbackType, enabled = HAPTICS_ENABLED) => {
    if (!enabled) return noop

    switch (haptic) {
        case 'selection':
            return () => selectionAsync()
        case 'soft':
        case 'light':
        case 'medium':
        case 'heavy':
        case 'rigid':
            return () => impactAsync(haptic)
        case 'success':
        case 'warning':
        case 'error':
            return () => notificationAsync(haptic)
        default:
            return assertUnreachable(haptic)
    }
}

export function useHaptics() {
    const { enabled } = useHapticsContext()

    const haptics = {
        selection: hapticToTrigger(HapticFeedback.selection, enabled),
        impact: {
            light: hapticToTrigger(HapticFeedback.light, enabled),
            medium: hapticToTrigger(HapticFeedback.medium, enabled),
            heavy: hapticToTrigger(HapticFeedback.heavy, enabled),
            soft: hapticToTrigger(HapticFeedback.soft, enabled),
            rigid: hapticToTrigger(HapticFeedback.rigid, enabled),
        },
        notify: {
            error: hapticToTrigger(HapticFeedback.error, enabled),
            success: hapticToTrigger(HapticFeedback.success, enabled),
            warning: hapticToTrigger(HapticFeedback.warning, enabled),
        },
    }

    const triggerHaptics = (haptic: HapticsFeedbackKey) => {
        const fn = get(haptics, haptic)
        if (isFunction(fn)) return fn
        throw new Error(`Haptic trigger "${haptic}" is not valid.`)
    }

    return { enabled, haptics, triggerHaptics }
}

// type PressableHapticsHandlerProps = {
//     onPressHaptic?: PressableHapticFeedbackType
//     onLongPressHaptic?: PressableHapticFeedbackType
// }

// type PressableProps = RNPressableProps & {
//     haptics?: keyof HapticsFeedback | PressableHapticsHandlerProps // PressableHapticFeedbackType | PressableHapticsHandlerProps
// }

// export function useHapticsFeedback<Props extends PressableProps>({
//     disabled,
//     haptics: initialHaptics = {},
//     onPress,
//     onLongPress,
// }: Props) {
//     const { onPressHaptic, onLongPressHaptic } =
//         isPlainObject(initialHaptics) ? initialHaptics : (
//             { onPressHaptic: initialHaptics, onLongPressHaptic: undefined }
//         )

//     const { enabled, triggerHaptics } = useHaptics()

//     function handleOnPress(e: GestureResponderEvent) {
//         if (disabled) return

//         if (enabled && onPressHaptic && onPressHaptic in HapticsFeedback.impact) {
//             triggerHaptics(onPressHaptic)
//         }

//         onPress?.(e)
//     }

//     function handleOnLongPress(e: GestureResponderEvent) {
//         if (disabled) return

//         if (enabled && onLongPressHaptic) {
//             triggerHaptics(onLongPressHaptic)
//         }

//         onLongPress?.(e)
//     }

//     return {
//         onPress: handleOnPress,
//         onLongPress: handleOnLongPress,
//     }
// }
