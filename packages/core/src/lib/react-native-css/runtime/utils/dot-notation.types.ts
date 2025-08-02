import { Get, Paths, Primitive } from 'type-fest'
import { IsPlainObject, ToString } from 'type-fest/source/internal'
import { LiteralStringUnion } from 'type-fest/source/literal-union'

type Falsy = undefined | null | false | ''
type RegisteredStyle<T> = number & { __registeredStyleBrand: T }

interface RecursiveArray<T> extends Array<T | ReadonlyArray<T> | RecursiveArray<T>> {}

export type StyleProp<T> =
    | T
    | RegisteredStyle<T>
    | RecursiveArray<T | RegisteredStyle<T> | Falsy>
    | Falsy

// Unwrap nested arrays (from RecursiveArray)
type UnwrapRecursiveArray<T> = T extends (infer I)[] ? UnwrapRecursiveArray<I> : T

// Remove null, false, undefined, etc.
type RemoveFalsy<T> = Exclude<T, Falsy>

// Remove RegisteredStyle (branded numbers)
type RemoveRegisteredStyle<T> = T extends RegisteredStyle<any> ? never : T

// Final cleaned style object from StyleProp<T>
type ExtractStyleObject<T> = RemoveRegisteredStyle<
    RemoveFalsy<UnwrapRecursiveArray<T extends StyleProp<infer U> ? U : T>>
>

export type DotNotation<
    T,
    Depth extends unknown[] = [],
    MaxDepth extends number = 10,
    Key extends keyof T = keyof T,
> = Depth['length'] extends MaxDepth ? never
: Key extends string ?
    unknown extends T[Key] ? Key | `${Key}.${string}`
    : // Handle StyleProp<T> and clean unions
    ExtractStyleObject<NonNullable<T[Key]>> extends infer Cleaned ?
        Cleaned extends Primitive ? Key
        : Cleaned extends readonly (infer E)[] ?
            E extends Primitive ?
                Key | `${Key}[number]`
            :   Key | `${Key}[number]` | `${Key}[number].${DotNotation<E, [...Depth, 0], MaxDepth>}`
        : IsPlainObject<Cleaned> extends true ?
            Key | `${Key}.${DotNotation<Cleaned, [...Depth, 0], MaxDepth>}`
        :   Key
    :   never
:   never

export type ResolveDotPath<
    BaseType,
    Path extends
        | readonly string[]
        | LiteralStringUnion<
              ToString<
                  | Paths<BaseType, { bracketNotation: false; maxRecursionDepth: 2 }>
                  | Paths<BaseType, { bracketNotation: true; maxRecursionDepth: 2 }>
              >
          >,
> = Get<BaseType, Path>
