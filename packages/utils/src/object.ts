import { Get, ValueOf } from 'type-fest'

import {
    isEmpty,
    isNil,
    isNumber,
    isObject,
    isPlainObject,
    isPrimitive,
    isString,
    isSymbol,
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

type Keys<BaseType extends object> = keyof BaseType[]

type Entries<BaseType extends object> =
    Keys<BaseType> extends infer Key extends keyof BaseType ? [Key, ValueOf<BaseType, Key>][]
    :   never

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

type GetIndexedField<T, K> =
    K extends keyof T ? T[K]
    : K extends `${number}` ?
        'length' extends keyof T ?
            number extends T['length'] ?
                number extends keyof T ?
                    T[number]
                :   undefined
            :   undefined
        :   undefined
    :   undefined

type FieldWithPossiblyUndefined<T, Key> =
    | GetFieldType<Exclude<T, undefined>, Key>
    | Extract<T, undefined>

type IndexedFieldWithPossiblyUndefined<T, Key> =
    | GetIndexedField<Exclude<T, undefined>, Key>
    | Extract<T, undefined>

export type GetFieldType<T, P> =
    P extends `${infer Left}.${infer Right}` ?
        Left extends keyof Exclude<T, undefined> ?
            FieldWithPossiblyUndefined<Exclude<T, undefined>[Left], Right> | Extract<T, undefined>
        : Left extends `${infer FieldKey}[${infer IndexKey}]` ?
            FieldKey extends keyof T ?
                FieldWithPossiblyUndefined<
                    IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
                    Right
                >
            :   undefined
        :   undefined
    : P extends keyof T ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]` ?
        FieldKey extends keyof T ?
            IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
        :   undefined
    :   IndexedFieldWithPossiblyUndefined<T, P>

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
