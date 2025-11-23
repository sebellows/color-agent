import { Paths, Split, UnknownRecord } from 'type-fest'
import { ToString } from 'type-fest/source/internal'

import { LiteralStringUnion } from './type-fest-ext'

type DotPath<BaseType, MaxDepth extends number> = LiteralStringUnion<
    ToString<
        | Paths<BaseType, { bracketNotation: false; maxRecursionDepth: MaxDepth }>
        | Paths<BaseType, { bracketNotation: true; maxRecursionDepth: MaxDepth }>
    >
>

export type Path<BaseType extends UnknownRecord = UnknownRecord, MaxDepth extends number = 10> =
    | keyof BaseType
    | DotPath<BaseType, MaxDepth>

// export type Path<
//     T,
//     Key extends symbol | string,
//     Depth extends unknown[] = [],
//     MaxDepth extends number = 10,
// > = Depth['length'] extends MaxDepth ? never
// : IsSymbolLiteral<Key> extends true ?
//     Key extends keyof T ?
//         Key
//     :   never
// : Key extends infer KeyPath extends DotPath<T, MaxDepth> ? KeyPath
// : never
//     unknown extends T[Key] ? Key | `${Key}.${string}`
//     : T[Key] extends infer Value ?
//         Value extends Primitive ? Key
//         : Value extends readonly (infer Arr)[] ?
//             Arr extends Primitive ?
//                 Key | `${Key}[number]`
//             :   Key | `${Key}[number]` | `${Key}[number].${Path<Arr, [...Depth, 0], MaxDepth>}`
//         : IsPlainObject<Value> extends true ? Key | `${Key}.${Path<Value, [...Depth, 0], MaxDepth>}`
//         : Key
//     :   never
// :   never

/**
 * Splits a dot-prop style path into a tuple comprised of the properties in the path.
 * Handles square-bracket notation.
 */
export type ToPaths<S extends string> = Split<
    FixPathSquareBrackets<S>,
    '.',
    { strictLiteralChecks: false }
>

/**
 * Replaces square-bracketed dot notation with dots, e.g.:
 * `foo[0].bar` -> `foo.0.bar`.
 */
type FixPathSquareBrackets<TPath extends string> =
    TPath extends `[${infer Head}]${infer Tail}` ?
        Tail extends `[${string}` ?
            `${Head}.${FixPathSquareBrackets<Tail>}`
        :   `${Head}${FixPathSquareBrackets<Tail>}`
    : TPath extends `${infer Head}[${infer Middle}]${infer Tail}` ?
        `${Head}.${FixPathSquareBrackets<`[${Middle}]${Tail}`>}`
    :   TPath
