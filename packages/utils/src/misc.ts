import { UnknownRecord } from 'type-fest'

function _hasOwnFn() {
    try {
        return Object.hasOwn
    } catch {
        function _hasOwnPolyfill<O extends UnknownRecord, K extends keyof any>(
            o: O,
            key: K,
        ): o is O & Record<K, any> {
            return Object.prototype.hasOwnProperty.call(o, key)
        }

        return _hasOwnPolyfill
    }
}

export function hasOwn<O extends Object, K extends keyof any>(o: O, key: K) {
    return _hasOwnFn()(o, key)
}

/**
 * Ensure that params are either an array or contain an array.
 */
export function variadic<T extends unknown = any>(...args: any[]): T[] {
    return [...(Array.isArray(args[0]) ? args[0] : args)]
}
