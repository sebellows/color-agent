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
 * Represents an abstract class `T`, if applied to a concrete class it would stop
 * being instantiable.
 */
export interface AbstractType<T> extends Function {
    prototype: T
}

/**
 * A type that represents a boolean value or a string that can be interpreted as a boolean.
 * This is used internally in a number of libraries, such as React and Vue, but not exported.
 */
export type Booleanish = boolean | 'true' | 'false'

export type Fn<T = unknown, Args extends unknown[] = any[]> = (...args: Args) => T

/**
 * Because sometimes `UnknownRecord` isn't lazy enough for me.
 */
export type AnyRecord = Record<string, any>

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
