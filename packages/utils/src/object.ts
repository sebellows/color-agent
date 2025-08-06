import { Entries, Get, ValueOf } from 'type-fest'

import {
    isDefined,
    isEmpty,
    isIterable,
    isNil,
    isNumber,
    isObject,
    isPlainObject,
    isPrimitive,
    isString,
} from './lang'
import { toKeyPath } from './path'

export function getKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[]
}

type ObjectOptions = {
    /**
     * Exclude 'undefined' in the return type when accessing properties.
     *
     * @default true
     */
    strict?: boolean
}

type PickEntries<
    BaseType extends object,
    Options extends Required<ObjectOptions>,
> = keyof BaseType extends infer Key extends keyof BaseType ?
    Key extends PropertyKey ?
        ValueOf<BaseType, Key> extends infer Value ?
            Options['strict'] extends true ?
                Value extends undefined ?
                    never
                :   [Key, Value]
            :   [Key, Value][]
        :   never
    :   never
:   never

function impl_getEntries<T extends object, Options extends Required<ObjectOptions>>(
    obj: T,
    options: Options,
): PickEntries<T, Options> {
    if (options?.strict) {
        const entries = Object.entries(obj) as Entries<T>
        const filtered = entries.filter(([_, value]) => value !== undefined)
        return filtered as PickEntries<T, Options>
    }
    return Object.entries(obj) as PickEntries<T, Options>
}

export function getEntries<T extends object, Options extends ObjectOptions = ObjectOptions>(
    obj: T,
    options: Options = {} as Options,
): PickEntries<T, Required<ObjectOptions>> {
    const opts: Required<ObjectOptions> = {
        strict: false,
        ...options,
    }
    return impl_getEntries(obj, opts)
}

const withArrayIndexRE = /(?<=\[)\d+(?=\])/

/**
 * Gets the property value at path of object. If the resolved value is undefined the
 * defaultValue is used in its place.
 *
 * @param object The object to query.
 * @param path The path of the property to get.
 * @param defaultValue The value returned if the resolved value is undefined.
 * @return Returns the resolved value.
 */
export function get<
    TObject,
    Path extends string | readonly string[],
    TDefault extends unknown = unknown,
>(obj: any, path: Path, defaultValue?: TDefault): Get<TObject, Path> | TDefault | undefined {
    // return early if the value is a primitive
    if (isNil(obj) || isPrimitive(obj)) return defaultValue

    // return early if `obj` is an array or plain object that is empty
    if (isEmpty(path)) return defaultValue

    let currObj: any = obj
    let paths: string[] = []

    if (isString(path)) {
        paths = path.split('.')
    }

    for (let p of paths) {
        if (withArrayIndexRE.test(p)) {
            // `p` is of shape 'someArray[0]'
            const matches = p.match(withArrayIndexRE)!
            let index = matches[0]
            let bracketIndex = matches.index ?? 0
            p = p.slice(+bracketIndex)

            currObj = currObj[p]?.[index]
        } else if (isPlainObject(currObj) && currObj[p]) {
            currObj = currObj[p]
        } else if (Array.isArray(currObj)) {
            if (isNumber(p)) {
                // convert `p` from an integer string to a number.
                currObj = currObj[parseFloat(p)]
                break
            }

            // Check if `p` is a bracketed integer (e.g., `*.[0].*`).
            // `index` will be a number (as string) returned by `String.match()`.
            let indexStr = p.match(withArrayIndexRE)?.[0]

            // convert the formerly bracketed integer string to a number.
            // (if `indexStr` is undefined we will get back `NaN`)
            let index = parseFloat(String(indexStr))

            // if `currObj` is an array but we cannot parse `p` to an index, then the path
            // has been entered incorrectly and we'll break early and return undefined.
            if (isNaN(index)) break

            currObj = currObj[index]
        } else {
            currObj = undefined
            break
        }
    }

    // return isUndefined(currObj) && defaultValue !== undefined ? defaultValue : currObj
    return currObj ?? defaultValue
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties.
 */
export function set<T>(
    obj: T,
    path: string | Symbol | string[],
    value: any,
    customizer?: Function,
): T {
    if (!isObject(obj) || isNil(obj)) return obj

    const paths =
        isString(path) ? toKeyPath(path)
        : Array.isArray(path) ? toKeyPath(path.join('.'))
        : [path]

    let i = -1
    let nested: Record<string, any> = obj

    while (!isNil(nested) && ++i < paths.length) {
        let key = String(paths[i]) as keyof typeof nested
        let newValue = value

        if (i !== paths.length - 1) {
            const objValue = nested[key]
            newValue = customizer ? customizer(objValue, key, nested) : undefined
            if (isNil(newValue)) {
                newValue =
                    isObject(objValue) ? objValue
                    : isNumber(paths[i + 1]) ? []
                    : {}
            }
        }

        nested[key] = newValue
        nested = nested[key]
    }

    return obj
}

export const deepMergeObjects = <T extends { [key: PropertyKey]: any }>(...sources: Array<T>) => {
    const target = {} as T

    sources.filter(isDefined).forEach(source => {
        Object.keys(source).forEach(key => {
            const sourceValue = source[key]
            const targetValue = target[key]

            if (Object(sourceValue) === sourceValue && Object(targetValue) === targetValue) {
                Object.assign(target, { [key]: deepMergeObjects(targetValue, sourceValue) })

                return
            }

            Object.assign(target, { [key]: sourceValue })
        })
    })

    return target
}

/**
 * Taken from Zustand's vanilla implementation
 * @see {@link https://github.com/pmndrs/zustand/blob/main/src/vanilla/shallow}
 */
export function shallow<T>(valueA: T, valueB: T): boolean {
    if (Object.is(valueA, valueB)) {
        return true
    }
    if (!isObject(valueA) || isNil(valueA) || !isObject(valueB) || isNil(valueB)) {
        return false
    }
    if (Object.getPrototypeOf(valueA) !== Object.getPrototypeOf(valueB)) {
        return false
    }
    if (isIterable(valueA) && isIterable(valueB)) {
        if (hasIterableEntries(valueA) && hasIterableEntries(valueB)) {
            return compareEntries(valueA, valueB)
        }
        return compareIterables(valueA, valueB)
    }
    // assume plain objects
    return compareEntries(
        { entries: () => Object.entries(valueA) },
        { entries: () => Object.entries(valueB) },
    )
}

const hasIterableEntries = (
    value: Iterable<unknown>,
): value is Iterable<unknown> & {
    entries(): Iterable<[unknown, unknown]>
} =>
    // HACK: avoid checking entries type
    'entries' in value

const compareEntries = (
    valueA: { entries(): Iterable<[unknown, unknown]> },
    valueB: { entries(): Iterable<[unknown, unknown]> },
) => {
    const mapA = valueA instanceof Map ? valueA : new Map(valueA.entries())
    const mapB = valueB instanceof Map ? valueB : new Map(valueB.entries())
    if (mapA.size !== mapB.size) {
        return false
    }
    for (const [key, value] of mapA) {
        if (!Object.is(value, mapB.get(key))) {
            return false
        }
    }
    return true
}

// Ordered iterables
const compareIterables = (valueA: Iterable<unknown>, valueB: Iterable<unknown>) => {
    const iteratorA = valueA[Symbol.iterator]()
    const iteratorB = valueB[Symbol.iterator]()
    let nextA = iteratorA.next()
    let nextB = iteratorB.next()
    while (!nextA.done && !nextB.done) {
        if (!Object.is(nextA.value, nextB.value)) {
            return false
        }
        nextA = iteratorA.next()
        nextB = iteratorB.next()
    }
    return !!nextA.done && !!nextB.done
}
