function cached<T>(fn: (str: string) => T) {
    const cache = Object.create(null)
    return function cachedFn(str: string) {
        const hit = cache[str]
        return hit || (cache[str] = fn(str))
    }
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelCaseRE = /-(\w)/g
export const camelCase = cached((str: string): string =>
    str.replace(camelCaseRE, (_, c) => (c ? c.toUpperCase() : '')),
)

export const capitalize = cached(
    (str: string): string => str.charAt(0).toUpperCase() + str.slice(1),
)

const kebabCaseRE = /\B([A-Z])/g
export const kebabCase = cached((str: string): string =>
    str.replace(kebabCaseRE, '-$1').toLowerCase(),
)
