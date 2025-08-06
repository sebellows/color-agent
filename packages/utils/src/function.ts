/**************************************************
 *
 * Partial Application
 *
 * Original source: es-toolkit
 *
 * @copyright MIT - Viva Republic
 * @see {@link https://github.com/toss/es-toolkit/}
 *
 * TODO: Replace this (and other functional utils)
 * with an actual import of the es-toolkit library
 *
 **************************************************/

const PARTIAL_PLACEHOLDER_SYMBOL: unique symbol = Symbol('partial.placeholder')
type PartialPlaceholder = typeof PARTIAL_PLACEHOLDER_SYMBOL

export function partial<T1, R>(func: (arg1: T1) => R, arg1: T1): () => R

export function partial<T1, T2, R>(func: (arg1: T1, arg2: T2) => R, arg1: T1): (arg2: T2) => R

export function partial<T1, T2, R>(
    func: (arg1: T1, arg2: T2) => R,
    placeholder: PartialPlaceholder,
    arg2: T2,
): (arg1: T1) => R

export function partial<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: T1,
): (arg2: T2, arg3: T3) => R

export function partial<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: PartialPlaceholder,
    arg2: T2,
): (arg1: T1, arg3: T3) => R

export function partial<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: PartialRightPlaceholder,
    arg2: PartialRightPlaceholder,
    arg3: T3,
): (arg1: T1, arg2: T2) => R

export function partial<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: T3,
): (arg2: T2) => R

export function partial<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    plc1: PartialRightPlaceholder,
    arg2: T2,
    arg3: T3,
): (arg1: T1) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
): (arg2: T2, arg3: T3, arg4: T4) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: PartialRightPlaceholder,
    arg2: PartialRightPlaceholder,
    arg3: T3,
    arg4: T4,
): (arg1: T1, arg2: T2) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: T2,
): (arg3: T3, arg4: T4) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: T3,
): (arg2: T2, arg4: T4) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: PartialRightPlaceholder,
    arg2: T2,
    arg3: T3,
): (arg1: T1, arg4: T4) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: PartialRightPlaceholder,
    arg2: T2,
    arg3: PartialRightPlaceholder,
    arg4: T4,
): (arg1: T1, arg3: T3) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: PartialRightPlaceholder,
    arg2: PartialRightPlaceholder,
    arg3: T3,
    arg4: T4,
): (arg1: T1, arg2: T2) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: T2,
    arg3: T3,
): (arg4: T4) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: T2,
    arg3: PartialRightPlaceholder,
    arg4: T4,
): (arg3: T3) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: T3,
    arg4: T4,
): (arg2: T2) => R

export function partial<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: PartialRightPlaceholder,
    arg2: T2,
    arg3: T3,
    arg4: T4,
): (arg1: T1) => R

export function partial<TS extends any[], R>(func: (...args: TS) => R): (...args: TS) => R

export function partial<TS extends any[], T1, R>(
    func: (arg1: T1, ...args: TS) => R,
    arg1: T1,
): (...args: TS) => R

export function partial<TS extends any[], T1, T2, R>(
    func: (arg1: T1, arg2: T2, ...args: TS) => R,
    t1: T1,
    arg2: T2,
): (...args: TS) => R

export function partial<TS extends any[], T1, T2, T3, R>(
    func: (t1: T1, arg2: T2, arg3: T3, ...args: TS) => R,
    t1: T1,
    arg2: T2,
    arg3: T3,
): (...args: TS) => R

export function partial<TS extends any[], T1, T2, T3, T4, R>(
    func: (t1: T1, arg2: T2, arg3: T3, arg4: T4, ...args: TS) => R,
    t1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
): (...args: TS) => R

export function partial<F extends (...args: any[]) => any>(
    func: F,
    ...partialArgs: any[]
): (...args: any[]) => ReturnType<F>

export function partial<Fn extends (...args: unknown[]) => any>(
    func: Fn,
    ...partialArgs: any[]
): (...args: any[]) => ReturnType<Fn> {
    return partialImpl<Fn, PartialPlaceholder>(func, PARTIAL_PLACEHOLDER_SYMBOL, ...partialArgs)
}

function partialImpl<Fn extends (...args: any[]) => any, P>(
    func: Fn,
    placeholder: P,
    ...partialArgs: any[]
): (...args: any[]) => ReturnType<Fn> {
    const partialed = function (this: unknown, ...providedArgs: any[]) {
        let providedArgsIndex = 0

        const substitutedArgs: any[] = partialArgs
            .slice()
            .map(arg => (arg === placeholder ? providedArgs[providedArgsIndex++] : arg))

        const remainingArgs = providedArgs.slice(providedArgsIndex)

        return func.apply(this, substitutedArgs.concat(remainingArgs))
    }

    if (func.prototype) {
        partialed.prototype = Object.create(func.prototype)
    }

    return partialed
}
partial.placeholder = PARTIAL_PLACEHOLDER_SYMBOL

/**************************************************
 *
 * Partial Right Application
 *
 * Original source: es-toolkit
 *
 * @copyright MIT - Viva Republic
 * @see {@link https://github.com/toss/es-toolkit/}
 *
 * TODO: Replace this (and other functional utils)
 * with an actual import of the es-toolkit library
 *
 **************************************************/

const PARTIAL_RIGHT_PLACEHOLDER: unique symbol = Symbol('partialRight.placeholder')
type PartialRightPlaceholder = typeof PARTIAL_RIGHT_PLACEHOLDER

export function partialRight<R>(func: () => R): () => R

export function partialRight<T1, R>(func: (arg1: T1) => R, arg1: T1): () => R

export function partialRight<T1, R>(func: (arg1: T1) => R): (arg1: T1) => R

export function partialRight<T1, R>(func: (arg1: T1) => R, arg1: T1): () => R

export function partialRight<T1, T2, R>(func: (arg1: T1, arg2: T2) => R): (arg1: T1, arg2: T2) => R

export function partialRight<T1, T2, R>(
    func: (arg1: T1, arg2: T2) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
): (arg2: T2) => R

export function partialRight<T1, T2, R>(func: (arg1: T1, arg2: T2) => R, arg2: T2): (arg1: T1) => R

export function partialRight<T1, T2, R>(
    func: (arg1: T1, arg2: T2) => R,
    arg1: T1,
    arg2: T2,
): () => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
): (arg1: T1, arg2: T2, arg3: T3) => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: PartialRightPlaceholder,
): (arg2: T2, arg3: T3) => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg2: T2,
    arg3: PartialRightPlaceholder,
): (arg1: T1, arg3: T3) => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: T1,
    arg2: T2,
    arg3: PartialRightPlaceholder,
): (arg3: T3) => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg3: T3,
): (arg1: T1, arg2: T2) => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: T3,
): (arg2: T2) => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg2: T2,
    arg3: T3,
): (arg1: T1) => R

export function partialRight<T1, T2, T3, R>(
    func: (arg1: T1, arg2: T2, arg3: T3) => R,
    arg1: T1,
    arg2: T2,
    arg3: T3,
): () => R
export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: PartialRightPlaceholder,
    arg4: PartialRightPlaceholder,
): (arg2: T2, arg3: T3, arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg2: T2,
    arg3: PartialRightPlaceholder,
    arg4: PartialRightPlaceholder,
): (arg1: T1, arg3: T3, arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: T2,
    arg3: PartialRightPlaceholder,
    arg4: PartialRightPlaceholder,
): (arg3: T3, arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg3: T3,
    arg4: PartialRightPlaceholder,
): (arg1: T1, arg2: T2, arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: T3,
    arg4: PartialRightPlaceholder,
): (arg2: T2, arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg2: T2,
    arg3: T3,
    arg4: PartialRightPlaceholder,
): (arg1: T1, arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: PartialRightPlaceholder,
): (arg4: T4) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg4: T4,
): (arg1: T1, arg2: T2, arg3: T3) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: PartialRightPlaceholder,
    arg4: T4,
): (arg2: T2, arg3: T3) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg2: T2,
    arg3: PartialRightPlaceholder,
    arg4: T4,
): (arg1: T1, arg3: T3) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: T2,
    arg3: PartialRightPlaceholder,
    arg4: T4,
): (arg3: T3) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg3: T3,
    arg4: T4,
): (arg1: T1, arg2: T2) => R
export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: PartialRightPlaceholder,
    arg3: T3,
    arg4: T4,
): (arg2: T2) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg2: T2,
    arg3: T3,
    arg4: T4,
): (arg1: T1) => R

export function partialRight<T1, T2, T3, T4, R>(
    func: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => R,
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
): () => R

export function partialRight(func: (...args: any[]) => any, ...args: any[]): (...args: any[]) => any

export function partialRight<F extends (...args: any[]) => any>(
    func: F,
    ...partialArgs: any[]
): (...args: any[]) => ReturnType<F> {
    return partialRightImpl<F, PartialRightPlaceholder>(
        func,
        PARTIAL_RIGHT_PLACEHOLDER,
        ...partialArgs,
    )
}

function partialRightImpl<F extends (...args: any[]) => any, P>(
    func: F,
    placeholder: P,
    ...partialArgs: any[]
): (...args: any[]) => ReturnType<F> {
    const partialedRight = function (this: any, ...providedArgs: any[]) {
        const placeholderLength = partialArgs.filter(arg => arg === placeholder).length
        const rangeLength = Math.max(providedArgs.length - placeholderLength, 0)
        const remainingArgs: any[] = providedArgs.slice(0, rangeLength)

        let providedArgsIndex = rangeLength

        const substitutedArgs = partialArgs
            .slice()
            .map(arg => (arg === placeholder ? providedArgs[providedArgsIndex++] : arg))

        return func.apply(this, remainingArgs.concat(substitutedArgs))
    }

    if (func.prototype) {
        partialedRight.prototype = Object.create(func.prototype)
    }

    return partialedRight
}

partialRight.placeholder = PARTIAL_RIGHT_PLACEHOLDER

/**
 * Memoize
 *
 * Creates a memoized version of the provided function. The memoized function caches
 * results based on the argument it receives, so if the same argument is passed again,
 * it returns the cached result instead of recomputing it.
 */
export const memoize = <Fn extends (...args: any[]) => any>(
    func: Fn,
    options: {
        cache?: MemoizeCache<any, ReturnType<Fn>>
        getCacheKey?: (args: Parameters<Fn>[0]) => unknown
    } = {},
): MemoizedFn<Fn> => {
    const { cache = new Map<unknown, ReturnType<Fn>>(), getCacheKey } = options

    const memoizedFn = function (this: unknown, arg: Parameters<Fn>[0]): ReturnType<Fn> {
        const key = getCacheKey ? getCacheKey(arg) : arg

        if (cache.has(key)) {
            return cache.get(key)!
        }

        const result = func.call(this, arg)

        cache.set(key, result)

        return result
    }

    memoizedFn.cache = cache

    return memoizedFn as Fn & { cache: MemoizeCache<any, ReturnType<Fn>> }
}

type MemoizeCache<K, V> = Map<K, V>

type MemoizedFn<Fn extends (...args: any[]) => any> = Fn & {
    cache: MemoizeCache<any, ReturnType<Fn>>
}
