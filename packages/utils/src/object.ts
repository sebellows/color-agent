import { ValueOf } from 'type-fest'

export function getKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[]
}

type ObjectOptions = {
    /**
     * Exclude `undefined` in the return type when accessing properties.
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
