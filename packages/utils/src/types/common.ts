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
 * An async closure that returns a Promise that will resolve an instance of a class.
 * Normally called from the 'make' method of a class extending the HookableContract.
 *
 * @example
 * resolve($engine: GameEngine, async () => {
 *   const instance = new Promise(new GameRelatedClass())
 *   return instance
 * })
 */
export type AsyncFn<T = unknown, Args extends unknown[] = any[]> = (
    ...args: Args
) => Promise<T | never>
