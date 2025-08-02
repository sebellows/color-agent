import { getEntries } from '@coloragent/utils'
import { Entries, UnknownRecord } from 'type-fest'

import type {
    Animation_V2,
    AnimationKeyframesRecord_V2,
    ReactNativeCssStyleSheet,
    StyleRuleSet,
} from '../../compiler'
import { family, observable, observableBatch, rootVariables, type Observable } from './reactivity'

export function StyleCollection() {
    return null
}

export const inlineStylesMap = new WeakMap()

StyleCollection.styles = family<string, Observable<StyleRuleSet>>(() => {
    return observable([], isDeepEqual)
})
// export type AnimationRecord_V2 = Record<string, AnimationKeyframesRecord_V2>
// export type AnimationKeyframesRecord_V2 = Record<string | number, StyleDeclaration[]>

// export type Animation_V2 = [string, AnimationKeyframes_V2[]]
// export type AnimationKeyframes_V2 = [string | number, StyleDeclaration[]]

// StyleCollection.keyframes = family<string, Observable<Animation_V2[1]>>(() => {
//     return observable([], isDeepEqual)
// })
StyleCollection.keyframes = family<string, Observable<Entries<AnimationKeyframesRecord_V2>>>(() => {
    return observable([], isDeepEqual)
})

StyleCollection.inject = function (options: ReactNativeCssStyleSheet) {
    observableBatch.current = new Set()

    if (options.ruleSets) {
        for (const [styleName, styleValue] of getEntries(options.ruleSets)) {
            StyleCollection.styles(styleName).set(styleValue)
        }
    }

    if (options.keyframes) {
        for (const [keyframeKey, keyframeValue] of getEntries(options.keyframes)) {
            // StyleCollection.keyframes(keyframeKey).set(keyframeValue)
            StyleCollection.keyframes(keyframeKey).set(getEntries(keyframeValue))
        }
    }

    if (options.rootVars) {
        for (const [key, value] of getEntries(options.rootVars)) {
            rootVariables(key).set(value)
        }
    }

    if (options.universalVars) {
        for (const [key, value] of getEntries(options.universalVars)) {
            rootVariables(key).set(value)
        }
    }

    for (const effect of observableBatch.current) {
        effect.run()
    }

    observableBatch.current = undefined
}

function isDeepEqual(a: unknown, b: unknown): boolean {
    const aArray = Array.isArray(a)
    const bArray = Array.isArray(b)
    const requiresKeyComparison =
        typeof a === 'object' && typeof b === 'object' && aArray === bArray

    // Only compare keys when both are an object or array
    // This does not account for complex types like Date/Regex, because we don't use them
    if (!requiresKeyComparison) return a === b

    // Make either are not null
    if (!a || !b) {
        return a === b
    }

    // Shortcut for arrays
    if (aArray && bArray && a.length !== b.length) {
        return false
    }

    // Compare a to b
    for (const key in a) {
        if (!isDeepEqual((a as UnknownRecord)[key], (b as UnknownRecord)[key])) {
            return false
        }
    }

    // Compare b to a
    for (const key in b) {
        if (!(key in a)) {
            return false
        }
    }

    return true
}
