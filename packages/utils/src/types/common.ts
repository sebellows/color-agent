import { LiteralUnion } from 'type-fest'

/**
 * Function Type
 *
 * Taken from the Angular framework (© Google LLC).
 * @see {@link https://github.com/angular/angular}
 *
 * @description
 * Represents a type that a Component or other object is instances of.
 *
 * An example of a 'Type' is 'MyCustomComponent' class, which in JavaScript is represented by
 * the 'MyCustomComponent' constructor function.
 */
export const Type = Function

export function isType(v: any): v is Type<any> {
    return typeof v === 'function'
}

export interface Type<T = any> extends Function {
    [x: string]: any
    new (...args: any[]): T
}

export type Constructor<T, TArgs extends unknown[] = any[]> = new (...arguments_: TArgs) => T

/**
 * A type that represents a boolean value or a string that can be interpreted as a boolean.
 * This is used internally in a number of libraries, such as React and Vue, but not exported.
 */
export type Booleanish = boolean | 'true' | 'false'

export type Fn<T = unknown, Args extends unknown[] = any[]> = (...args: Args) => T

/**
 * The constructor for an async function.
 *
 * While currently `[object AsyncFunction]` is returned when examining
 * the constructor of an async function. The actual object type is
 * really just `Function`. AsyncFunction is not an actual global object
 * that can be referenced. For the sake of type checking here, we'll
 * safely make AsyncFunction a real boy and guard against a possible
 * future where it really exists.
 *
 * @example
 * async function getProducts() {
 *     try {
 *         const response = await fetch(https://example.org/products.json)
 *         if (!response.ok) {
 *             throw new Error(`Response status: ${response.status}`)
 *         }
 *         return await response.json()
 *     } catch (error) {
 *         console.error(error.message)
 *     }
 * })
 *
 * assert(getProducts instanceof AsyncFunction) // true
 */
export const AsyncFunction = async function () {}.constructor as AsyncFunctionConstructor

export interface AsyncFunction {
    (...args: any[]): Promise<unknown>
    readonly length: number
    readonly name: string
}

export interface AsyncFunctionConstructor {
    new (...args: any[]): AsyncFunction
    (...args: any[]): AsyncFunction
    readonly length: number
    readonly name: string
    readonly prototype: AsyncFunction
    toString(): string
}

/**
 * Allows creating a union type by combining primitive types and literal types without
 * sacrificing auto-completion in IDEs for the literal type part of the union.
 *
 * Currently, when a union type of a primitive type is combined with literal types,
 * TypeScript loses all information about the combined literals. Thus, when such type
 * is used in an IDE with autocompletion, no suggestions are made for the declared literals.
 *
 * This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729).
 * It will be removed as soon as it's not needed anymore.
 *
 * NOTE: Taken from `type-fest`, which doesn't publicly export the utility...
 * out of spite, I bet 😠
 *
 * Use-cases:
 * - Get string keys from a type which may have number keys.
 * - Makes it possible to index using strings retrieved from template types.
 *
 * @example
 * ```
 * const colors = [
 *     'blue',
 *     'red',
 *     'green',
 * ] as const
 *
 * type Color = (typeof colors)[number]
 *
 * const colorSet = new Set<Color>(colors)
 * const hasBlue = colorSet.has('blue')
 * \// 'blue' will be flagged as error in VS Code
 *
 * const colorSet = new Set<LiteralStringUnion<Color>>(colors)
 * const hasBlue = colorSet.has('blue')
 * \// 'blue' will no longer be flagged
 * ```
 */
export type LiteralStringUnion<BaseType> = LiteralUnion<BaseType, string>
