import { isFunction, isNil, isPrimitive, isUndefined } from 'es-toolkit'
import { isObject } from 'es-toolkit/compat'
import { ValueOf } from 'type-fest'
import { AsyncFunction as TAsyncFunction } from 'type-fest/source/async-return-type'

import { hasOwn } from './misc'
import { isDecimal } from './number'
import { AsyncFunction, Constructor } from './types'

/**
 * @internal
 *
 * Reference to the Object prototype's built-in 'toString' method.
 * @example
 * ''`
 * _protoToString === {}.toString // TRUE
 *
 * const fn = () => 'hello'
 * _protoToString === fn.toString // FALSE
 * _protoToString === fn.__proto__.toString // FALSE
 *
 * console.log(fn.toString())
 * => "() => 'hello'"
 *
 * console.log(fn.__proto__.toString())
 * => 'function () { [native code] }'
 *
 * console.log(fn.constructor.prototype.toString())
 * => 'function () { [native code] }'
 *
 * console.log(fn.constructor.toString())
 * => 'function Function() { [native code] }'
 * ''`
 */
export const _protoToString = Object.prototype.toString

const TypeMap = {
    Array,
    ArrayBuffer,
    AsyncFunction,
    BigInt,
    Boolean,
    Date,
    DOMException,
    Error,
    Function,
    Map,
    Null: null,
    Number,
    Object,
    Set,
    String,
    Symbol,
    undefined,
} as const

const TypeRegistry = {} as { [key: string]: Function }
const typeMap: typeof TypeMap & { [key: string]: Function } = Object.assign(TypeRegistry, TypeMap)

type StringKeyOf<T, K extends keyof T = keyof T> = K extends string ? K : never
type TypeMapKey = StringKeyOf<typeof typeMap>
type TypeMapValue<K extends TypeMapKey> = (typeof typeMap)[K]

export function getType(value: unknown) {
    if (value === null) {
        return 'Null'
    }

    const protoName = _protoToString.call(value).slice(8, -1)
    let typ = protoName as TypeMapKey
    if (!(protoName in typeMap) && value && value.constructor) {
        typeMap[protoName] = value.constructor
        typ = protoName as TypeMapKey
    }
    const v = typeMap[typ] as TypeMapValue<TypeMapKey>

    return (v satisfies TypeMapValue<TypeMapKey>) ? typ : (typ satisfies TypeMapKey)
}

/**
 * Get the type of a value as a lowercased string.
 *
 * @param {*} value
 * @returns {string} - The lowercased name of the value's type
 */
export function typeOf(value: unknown): string {
    return getType(value).toLowerCase()
}

const ConstructorMap = {
    array: Array,
    arraybuffer: ArrayBuffer,
    asyncfunction: Function,
    boolean: Boolean,
    // buffer: Buffer,
    date: Date,
    function: Function,
    map: Map,
    // node: Node,
    null: null,
    number: Number,
    object: Object,
    regexp: RegExp,
    set: Set,
    string: String,
    symbol: Symbol,
    uint8array: Uint8Array,
    uint16array: Uint16Array,
    uint32array: Uint32Array,
    undefined: undefined,
}
type TypeConstructorMap = typeof ConstructorMap

/**
 * Check if a value is of a certain type.
 *
 * @param {*} value - Any type of value
 * @param {string} type - The type to check the value against
 * @returns {boolean}
 */
// export function is<T extends keyof typeof TypeMap = keyof typeof TypeMap>(
export function is<T extends keyof TypeConstructorMap>(
    value: unknown,
    type: T,
): value is ValueOf<TypeConstructorMap, T> {
    return typeOf(value) === type.toLowerCase()
}

/**
 * Check if a value is NOT a primitive type.
 *
 * @param {*} value - Any type of value
 * @returns {boolean}
 */
export function isNonPrimitive<T>(value: T): value is T {
    return !isPrimitive(value) && !isFunction(value) && !isConstructor(value)
}

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
    return typeOf(value) === 'arraybuffer'
}

/**
 * Check if a value is defined, by default it checks if the value is not 'null' or 'undefined'.
 * If 'strict' is set to true, it will also check if the value is only 'undefined'.
 */
export function isDefined(value: unknown): boolean {
    return !isUndefined(value)
}

/**
 * Verify that the value is a built-in, native JS or Browser object.
 */
export function isNativeObject(value: unknown) {
    return !Object.is(_protoToString, value?.toString)
}

export function isAsync(value: unknown): value is TAsyncFunction {
    return is(value, 'asyncfunction')
}

export function isPromiseLike<T, Casts = unknown>(value: T): value is T & PromiseLike<Casts> {
    return !isNil(value) && isObject(value) && isFunction((value as T & Promise<any>).then)
}

export function isIterator<T>(value: unknown): value is Iterator<T> {
    return isObject(value) && !isNil(value) && isFunction((value as Iterator<T>).next)
}

export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
    return isObject(value) && !isNil(value) && Symbol.iterator in value
}

export function isAsyncIterator<T>(value: unknown): value is AsyncIterator<T> {
    return isObject(value) && !isNil(value) && isFunction((value as AsyncIterator<any>).next())
}

export function isAsyncIterable<T>(value: unknown): value is AsyncIterable<T> {
    return (
        isObject(value) &&
        !isNil(value) &&
        isFunction((value as AsyncIterable<any>)[Symbol.asyncIterator])
    )
}

export function isClass<T, TArgs extends unknown[] = any>(
    value: unknown,
): value is Constructor<T, TArgs> {
    let _isClass = false

    if (isFunction(value)) {
        try {
            _isClass = Boolean(value.arguments && value.caller)
        } catch (e) {
            return value.name.length > 0
        }
    }

    return _isClass
}

export const isConstructor = <T = any>(value: unknown): value is Constructor<T> => {
    return isFunction(value) && hasOwn(value, 'name') && /[A-Z]/.test(value.name.charAt(0))
}

/**
 * Coerce a value to a boolean as a form of type enforcement.
 */
function coerceBoolean(value: unknown): boolean {
    return `${value}` === 'true'
}

/**
 * Check if value is a boolean and is TRUE.
 */
export function isTrue(value: unknown): boolean {
    return coerceBoolean(value)
}

/**
 * Check if value is a boolean and is FALSE.
 */
export function isFalse(value: unknown): boolean {
    return !coerceBoolean(value)
}

export function isPercentageString(value: unknown): value is `${number}%` {
    return (
        typeof value === 'string' && value.endsWith('%') && !isNaN(parseFloat(value.slice(0, -1)))
    )
}

export function coarsePercentage(value: number | string): number {
    if (typeof value !== 'number' && typeof value !== 'string') {
        throw new TypeError('Expected a number or a percentage string')
    }

    function normalizePercentage(val: number | string, round: boolean = true): number {
        val = typeof val === 'string' ? parseFloat(val) : val
        if (val <= 0) return 0 // Handle zero case explicitly
        if (isDecimal(val) && val >= 0.0 && val <= 1.0) {
            val *= 100 // Convert decimal to percentage
        }
        if (val > 0 && val <= 100) {
            return round ? Math.round(val) : val
        }
        throw new TypeError('Expected a valid percentage string or number')
    }

    if (typeof value === 'string' && isPercentageString(value)) {
        return parseFloat(value.slice(0, -1))
    }
    return normalizePercentage(value)
}
