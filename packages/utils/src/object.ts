import { Entries, ValueOf } from 'type-fest'

export function getKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[]
}

export function getValues<T extends object>(obj: T): ValueOf<T>[] {
    return Object.values(obj) as ValueOf<T>[]
}

type GetValueOptions = {
    shouldThrow?: boolean
    defaultValue?: any
} & {}

const defaultGetValueOptions: GetValueOptions = { shouldThrow: false, defaultValue: undefined }

export function getValue<T extends object, K extends keyof T = keyof T>(
    obj: T,
    key: K,
    options: GetValueOptions = {},
): ValueOf<T, K> {
    options = { ...defaultGetValueOptions, ...options }

    if (!(key in obj)) {
        if (options.shouldThrow) {
            throw new Error(`Object does not contain the key "${key.toString()}"`)
        }
        return options.defaultValue
    }

    if (obj[key] === undefined) {
        return options.defaultValue
    }

    return obj[key]
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
