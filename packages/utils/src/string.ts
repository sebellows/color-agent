function cached<T>(fn: (str: string, ...args: any[]) => T) {
    const cache = Object.create(null)
    return function cachedFn(str: string, ...args: any[]): T {
        const cachekey = args.length ? str + args.toString() : str
        const hit = cache[cachekey]
        return hit || (cache[cachekey] = fn(str, ...args))
    }
}

type ExtraRegExpFn = (str: string, ...args: string[]) => string
type ExtraRegExpParam = ExtraRegExpFn | string

const beforeLowerRE = /\B([A-Z]{1,})(?=[a-z])/g
// const afterLowerRE = /(?<=[a-z])([A-Z]{1,})/g

// const beforeUpperRE = /\B([a-z]{1,})(?=[A-Z])/g
// const afterUpperRE = /(?<=[A-Z])([a-z]{1,})/g

const lowerStartRE = /^([a-z]{1,})(?=[0-9a-z-_\.])/g
const upperStartRE = /^([A-Z]{1,})(?=[0-9a-z-_\.])/g

// const beforeNumberRE = /\B(\w{1,})(?=[0-9])/g
// const afterNumberRE = /(?<=[0-9])(\w{1,})/g

const seperatorRE = /(-|_|\.)/g
// const beforeSeparatorRE = /(\w|\d)(?=-|_|\.)/g
const afterSeparatorRE = /(?<=-|_|\.)(\w|\d)/g

const toRegExpFn = (...args: string[]) => {
    const exp = `(${args.join('|')})`
    const newRE = new RegExp(exp, 'g')

    return (str: string) => str.replace(newRE, '$1-')
}

const resolveRegExps = (
    regexes: ((str: string, ...args: string[]) => string)[],
    ...extra: ExtraRegExpParam[]
) => {
    if (extra.length && Array.isArray(extra[0])) {
        extra = extra.flat()
    }
    const omitLen = extra.length
    const fns = [] as ((str: string, ...args: string[]) => string)[]

    if (omitLen > 0) {
        let words = []
        let i = 0
        for (const arg of extra) {
            if (typeof arg == 'string' && i < omitLen) {
                ++i
                words.push(arg)
                if (typeof extra[i] != 'string') {
                    fns.push(toRegExpFn(...words))
                    words = []
                }
                continue
            } else if (typeof arg == 'function') {
                fns.push(arg)
            }
        }
        while (fns.length > 0) {
            const lastFn = fns.pop()!
            regexes.unshift(lastFn)
        }
    }

    return (str: string) => regexes.reduce((acc, curr) => curr(acc), str)
}

/** Capitalize the first letter of a string. */
export const capitalize = cached(
    (str: string): string => str.charAt(0).toUpperCase() + str.slice(1),
)

/**
 * Camelize a hyphen-/underscore-delimited string.
 *
 * @example
 * camelCase('foo-bar') // 'fooBar'
 * camelCase('IPAddress', ['IP']) // 'ipAddress'
 */
export const camelCase = cached((str: string, ...omit: ExtraRegExpParam[]): string =>
    resolveRegExps(
        [
            s => s.replace(upperStartRE, (_, c) => (c ? c.toLowerCase() : '')),
            s => s.replace(afterSeparatorRE, (_, c) => (c ? c.toUpperCase() : '')),
            s => s.replace(seperatorRE, ''),
        ],
        ...omit,
    )(str),
)

/**
 * Convert a string to kebab-case.
 *
 * @example
 * kebabCase('fooBar') // 'foo-bar'
 * kebabCase('IPAddress', ['IP']) // 'ip-address'
 */
export const kebabCase = cached((str: string, ...omit: ExtraRegExpParam[]): string =>
    resolveRegExps(
        [s => s.replace(beforeLowerRE, '-$1'), s => s.replace(seperatorRE, '-')],
        ...omit,
    )(str).toLowerCase(),
)

/**
 * Convert a string to snake_case.
 *
 * @example
 * snakeCase('fooBar') // 'foo_bar'
 * snakeCase('IPAddress', ['IP']) // 'ip_address'
 */
export const snakeCase = cached((str: string, ...omit: ExtraRegExpParam[]): string =>
    resolveRegExps(
        [s => s.replace(beforeLowerRE, '_$1'), s => s.replace(seperatorRE, '_')],
        ...omit,
    )(str).toLowerCase(),
)

/**
 * Convert a string to PascalCase.
 *
 * @example
 * pascalCase('fooBar') // 'FooBar'
 * pascalCase('ipAddress', ['IP']) // 'IPAddress'
 */
export const pascalCase = cached((str: string, ...omit: ExtraRegExpParam[]) => {
    return resolveRegExps(
        [
            s => s.replace(lowerStartRE, (_, c) => (c ? c.toUpperCase() : '')),
            s => s.replace(afterSeparatorRE, (_, c) => (c ? c.toUpperCase() : '')),
            s => s.replace(seperatorRE, ''),
        ],
        ...omit,
    )(str)
})

export const titleCase = cached((str: string): string => {
    return str.split('-').map(capitalize).join(' ')
})
