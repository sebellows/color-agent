import { IsEqual, Subtract, Sum } from 'type-fest'

/**
 * The following arithmetic helper types come from the following article:
 * @see {@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f}
 */

type MultiAdd<N extends number, A extends number, I extends number> = I extends 0 ? A
:   MultiAdd<N, Sum<N, A>, Subtract<I, 1>>

export type Multiply<A extends number, B extends number> = MultiAdd<A, 0, B>

/**
 * Type that returns true if either A or B are equal to 0. This is a guard so that, when we perform
 * operations like subtraction from A and B, we are prevented from iterating past 0, thereby making
 * one of the two negative.
 */
type AtTerminus<A extends number, B extends number> = A extends 0 ? true
: B extends 0 ? true
: false

type LT<A extends number, B extends number> = AtTerminus<A, B> extends true ?
    IsEqual<A, B> extends true ? false
    : A extends 0 ? true
    : false
:   LT<Subtract<A, 1>, Subtract<B, 1>>

type MultiSub<N extends number, D extends number, Q extends number> = LT<N, D> extends true ? Q
:   MultiSub<Subtract<N, D>, D, Sum<Q, 1>>

export type Divide<A extends number, B extends number> = MultiSub<A, B, 0>

export type Modulo<A extends number, B extends number> = LT<A, B> extends true ? A
:   Modulo<Subtract<A, B>, B>
