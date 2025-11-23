import { AnyRecord } from '@coloragent/utils'
import { isUndefined } from 'es-toolkit'
import { get as _get } from 'es-toolkit/compat'
import { Get, Paths, Simplify, UnknownArray, UnknownRecord } from 'type-fest'
import { ToString } from 'type-fest/source/internal'
import { LiteralStringUnion } from 'type-fest/source/literal-union'

type DotPath<BaseType, MaxDepth extends number = 10> = LiteralStringUnion<
    ToString<
        | Paths<BaseType, { bracketNotation: false; maxRecursionDepth: MaxDepth }>
        | Paths<BaseType, { bracketNotation: true; maxRecursionDepth: MaxDepth }>
    >
>

export type Item<T extends UnknownArray> = T[number]
export type Items<T extends UnknownArray> = Item<T>[]

export type List<T extends UnknownArray> = Items<T> & { readonly get: (val: T) => T }

export const list = <T extends UnknownArray>(arr: T): List<T> => {
    const values = [...arr] as Items<T>
    const get = (val: Item<T>): Item<T> => {
        const found = values.find(v => v === val)
        if (isUndefined(found)) {
            throw new Error(`An item of "${val}" does not exist in ${values.toString()}`)
        }
        return found
    }
    Object.defineProperty(values, 'get', {
        value: get,
    })

    return values as List<T>
}

export type Dict<BaseObject extends UnknownRecord> = Simplify<
    BaseObject & { readonly get: ObjWithGet<BaseObject>['get'] }
>

export const dict = <BaseObject extends AnyRecord>(object: BaseObject) => {
    const obj = structuredClone(object)
    const get = <
        P extends DotPath<typeof obj>,
        TDefaultValue extends Get<typeof obj | BaseObject, P> = Get<typeof obj | BaseObject, P>,
    >(
        path: P,
        defaultValue?: TDefaultValue,
    ): Get<typeof obj, P> => {
        const found = _get(obj, path)
        if (isUndefined(found)) {
            if (isUndefined(defaultValue)) {
                throw new Error(`Could not locate value at "${path.toString()}"`)
            }
            return defaultValue
        }
        return found
    }
    Object.defineProperty(obj, 'get', {
        value: get,
    })

    return obj as Dict<BaseObject>
}

interface ObjWithGet<BaseObject extends UnknownRecord> {
    get<
        P extends DotPath<BaseObject>,
        TDefaultValue extends Get<BaseObject, P> = Get<BaseObject, P>,
    >(
        path: P,
        defaultValue?: TDefaultValue,
    ): Get<BaseObject, P>
}
