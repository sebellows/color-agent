import { AnyRecord } from '@coloragent/utils'

import { Theme } from './theme'

/** Describes constrained types */
type DefinedPrimitive = string | number | bigint | boolean

type Try<A1, A2, Catch = never> = A1 extends A2 ? A1 : Catch

type NarrowRaw<A> =
    A extends [] ? []
    : A extends DefinedPrimitive ? A
    : A extends AnyRecord ? { [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]> }
    : never

/**
 * Prevent type widening on generic function parameters
 * @param A to narrow
 * @returns `A`
 * @example
 * ```ts
 * declare function foo<A extends any[]>(x: Narrow<A>): A;
 * declare function bar<A extends object>(x: Narrow<A>): A;
 *
 * const test0 = foo(['e', 2, true, {f: ['g', ['h']]}])
 * \// `A` inferred : ['e', 2, true, {f: ['g']}]
 *
 * const test1 = bar({a: 1, b: 'c', d: ['e', 2, true, {f: ['g']}]})
 * \// `A` inferred : {a: 1, b: 'c', d: ['e', 2, true, {f: ['g']}]}
 * ```
 */
type Narrow<A> = Try<A, [], NarrowRaw<A>>

/**
 * This function's only role is providing TypeScript support in order
 * to help add intellisense to the theme.
 */
export const makeThemable = <T extends Theme>(theme: Narrow<T>): Narrow<T> => theme
