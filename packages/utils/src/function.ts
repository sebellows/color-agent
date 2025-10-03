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

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
