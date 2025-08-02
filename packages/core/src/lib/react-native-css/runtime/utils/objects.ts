import { is, isObject, isPlainObject, set } from '@coloragent/utils'
import { UnknownRecord } from 'type-fest'

import { transformKeys } from '../native/styles/defaults'
import { ShorthandRequiredValue, ShortHandSymbol } from '../native/styles/shorthand'

export function applyTransformProps(target: Record<string, any>, prop: string, value: any) {
    if (!transformKeys.has(prop)) return

    if (!Array.isArray(target.transform)) {
        target.transform = []
    }

    const transform = target.transform.find((t: any) => t[prop] !== undefined)

    if (transform) {
        transform[prop] = value
    } else {
        target.transform.push({ [prop]: value })
    }
}

export function hasShorthandProps(value: unknown): boolean {
    return isObject(value) && ShortHandSymbol in value
}

export function applyShorthandProps<
    Target extends UnknownRecord,
    Value extends ShorthandRequiredValue | undefined | null,
>(target: Target, value: Value) {
    if (!value || !hasShorthandProps(value)) return

    for (const [prop, propValue] of value) {
        //! Not sure if this correct (reversing prop/value order), but its what
        //! the Nativewind guys were doing
        // @see https://github.com/nativewind/react-native-css/blob/8ae7e311c948941431b00c0914941fdb868a9d36/src/runtime/utils/objects.ts#L55
        set(target, propValue, prop)
    }
}

type Target = {
    transform?: any[]
    [key: string]: any
}

export function applyValue<T extends Target, Prop extends string, Value extends any = unknown>(
    target: T,
    prop: Prop,
    value: Value,
) {
    if (value === undefined) return

    if (transformKeys.has(prop)) {
        if (!Array.isArray(target.transform)) {
            target.transform = []
        }

        const transform = target.transform.find((t: any) => t[prop] !== undefined)

        if (transform) {
            transform[prop] = value
        } else {
            target.transform.push({ [prop]: value })
        }
        return
    } else if (typeof value === 'object' && value && ShortHandSymbol in value) {
        const entries = Array.isArray(value) ? value : Object.entries(value)
        for (const [key, val] of entries) {
            set(target, key, val)
            // setDeepPath(target, entry[1], entry[0])
        }
        return
    }

    Object.assign(target, { [prop]: value })
}

// export function setDeepPath(target: Record<string, any>, paths: string | string[], value: any) {
//     if (typeof paths === 'string') {
//         target[paths] = value
//         return target
//     }

//     for (let i = 0; i < paths.length - 1; i++) {
//         const path = paths[i]!
//         target[path] ??= {}
//         target = target[path]
//     }

//     target[paths[paths.length - 1]!] = value

//     return target
// }
