import { upperFirst } from 'es-toolkit'

function cached<T>(fn: (str: string, ...args: any[]) => T) {
    const cache = Object.create(null)
    return function cachedFn(str: string, ...args: any[]): T {
        const cachekey = args.length ? str + args.toString() : str
        const hit = cache[cachekey]
        return hit || (cache[cachekey] = fn(str, ...args))
    }
}

export const titleCase = cached((str: string): string => str.split('-').map(upperFirst).join(' '))
