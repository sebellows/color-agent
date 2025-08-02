import { Token, TokenOrValue } from 'lightningcss'

import { stringify } from '../metro/stringify'
import { cssColorNames } from './declarations'

const matchString = (token: TokenOrValue) => {
    if (typeof token.value !== 'string') return
    return token.value
        .replace(/\\([0-9a-f]{1,6})(?:\s|$)/gi, (_match, charCode) =>
            String.fromCharCode(parseInt(charCode, 16)),
        )
        .replace(/\\/g, '')
}

const hexColorRE = /^(#(?:[0-9a-f]{3,4}){1,2})$/i
const cssFunctionNameRE = /^(rgba?|hsla?|hwb|lab|lch|gray|color)$/

const matchColor = (token: TokenOrValue) => {
    if (
        token.type === 'color' &&
        typeof token.value === 'string' &&
        (hexColorRE.test(token.value) || token.value in cssColorNames)
    ) {
        return token.value
    } else if (token.type === 'function' && cssFunctionNameRE.test(token.value.name)) {
        return stringify(token)
    }
    return null
}

const noneRE = /^(none)$/i
const autoRE = /^(auto)$/i
const identRE = /(^-?[_a-z][_a-z0-9-]*$)/i
// Note if these are wrong, you'll need to change index.js too
const numberRE = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)$/i
// Note lengthRE is sneaky: you can omit units for 0
const lengthRE = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)(?=px$))/i
const unsupportedUnitRE =
    /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?(ch|em|ex|rem|vh|vw|vmin|vmax|cm|mm|in|pc|pt))$/i
const angleRE = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?(?:deg|rad|grad|turn))$/i
const percentRE = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?%)$/i

export const NOOP_TOKEN = '<token>' as const
export const toLowerCase = (str: string) => str.toLowerCase()

export type Predicate<T> = (arg: T) => boolean

const noopToken = (predicate: Predicate<Token>) => (token: Token) =>
    predicate(token) ? NOOP_TOKEN : null

const valueForTypeToken = (type: string) => (token: TokenOrValue) =>
    token.type === type ? token.value : null

export const regExpToken =
    (regExp: RegExp, transform: Function | ((str: string) => string) = String) =>
    (token: Token) => {
        if (token.type !== 'string') return null

        const match = token.value.match(regExp)

        if (match == null) return null

        return transform(match[1])
    }

export const SPACE = noopToken((token: Token) => token.type === 'white-space')
export const SLASH = noopToken((token: Token) => token.type === 'delim' && token.value === '/')
export const COMMA = noopToken((token: Token) => token.type === 'delim' && token.value === ',')
export const WORD = valueForTypeToken('word')
export const NONE = regExpToken(noneRE)
export const AUTO = regExpToken(autoRE)
export const NUMBER = regExpToken(numberRE, Number)
export const LENGTH = regExpToken(lengthRE, Number)
export const UNSUPPORTED_LENGTH_UNIT = regExpToken(unsupportedUnitRE)
export const ANGLE = regExpToken(angleRE, toLowerCase)
export const PERCENT = regExpToken(percentRE)
export const IDENT = regExpToken(identRE)
export const STRING = matchString
export const COLOR = matchColor
export const LINE = regExpToken(/^(none|underline|line-through)$/i)

function cached<T>(fn: (str: string, ...args: any[]) => T) {
    const cache = Object.create(null)
    return function cachedFn(str: string, ...args: any[]): T {
        const cachekey = args.length ? str + args.toString() : str
        const hit = cache[cachekey]
        return hit || (cache[cachekey] = fn(str, ...args))
    }
}

const re = cached((pattern: string, flags = 'i') => new RegExp(pattern, flags))

export const Patterns = (() => {
    const patterns = {
        hexColor: '^(#(?:[0-9a-f]{3,4}){1,2})$',
        colorFunctionName: '^(rgba?|hsla?|oklch)$',
        unsupportedColorFunctionName: '^(hwb|lab|oklab|lch|gray|color)$',
        none: '^(none)$',
        auto: '^(auto)$',
        initial: '^(initial)$',
        inherit: '^(inherit)$',
        ident: '(^-?[a-z_][a-z0-9-_]*$)',
        number: '^([+-]?(?:d*.)?d+(?:e[+-]?d+)?)$',
        size: '^(0$|(?:[+-]?(?:d*.)?d+(?:e[+-]?d+)?)(?=px$|rem$))',
        unsupportedUnit:
            '^([+-]?(?:d*.)?d+(?:e[+-]?d+)?(ch|em|ex|vh|vw|vmin|vmax|cm|mm|in|pc|pt))$',
        angle: '^([+-]?(?:d*.)?d+(?:e[+-]?d+)?(?:deg|rad|grad|turn))$',
        percent: '^([+-]?(?:d*.)?d+(?:e[+-]?d+)?%)$',
    }

    return {
        hexColor: {
            pattern: re(patterns.hexColor, 'i'),
            test: (str: string, flags = 'i') => re(patterns.hexColor, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.hexColor, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.hexColor, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.hexColor, flags), replacement),
        },
        colorFunctionName: {
            regex: re(patterns.colorFunctionName),
            test: (str: string, flags?: string) => re(patterns.colorFunctionName, flags).test(str),
            match: (str: string, flags?: string) =>
                str.match(re(patterns.colorFunctionName, flags)),
            matchAll: (str: string, flags?: string) =>
                str.matchAll(re(patterns.colorFunctionName, flags)),
            replace: (str: string, replacement: (found: string) => string, flags?: string) =>
                str.replace(re(patterns.colorFunctionName, flags), replacement),
        },
        unsupportedColorFunctionName: {
            regex: re(patterns.unsupportedColorFunctionName),
            test: (str: string, flags?: string) =>
                re(patterns.unsupportedColorFunctionName, flags).test(str),
            match: (str: string, flags?: string) =>
                str.match(re(patterns.unsupportedColorFunctionName, flags)),
            matchAll: (str: string, flags?: string) =>
                str.matchAll(re(patterns.unsupportedColorFunctionName, flags)),
            replace: (str: string, replacement: (found: string) => string, flags?: string) =>
                str.replace(re(patterns.unsupportedColorFunctionName, flags), replacement),
        },
        none: {
            regex: re(patterns.none, 'i'),
            test: (str: string, flags = 'i') => re(patterns.none, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.none, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.none, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.none, flags), replacement),
        },
        auto: {
            regex: re(patterns.auto, 'i'),
            test: (str: string, flags = 'i') => re(patterns.auto, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.auto, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.auto, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.auto, flags), replacement),
        },
        initial: {
            regex: re(patterns.initial, 'i'),
            test: (str: string, flags = 'i') => re(patterns.initial, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.initial, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.initial, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.initial, flags), replacement),
        },
        inherit: {
            regex: re(patterns.inherit, 'i'),
            test: (str: string, flags = 'i') => re(patterns.inherit, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.inherit, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.inherit, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.inherit, flags), replacement),
        },
        ident: {
            regex: re(patterns.ident, 'i'),
            test: (str: string, flags = 'i') => re(patterns.ident, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.ident, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.ident, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.ident, flags), replacement),
        },
        number: {
            regex: re(patterns.number, 'i'),
            test: (str: string, flags = 'i') => re(patterns.number, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.number, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.number, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.number, flags), replacement),
        },
        size: {
            regex: re(patterns.size, 'i'),
            test: (str: string, flags = 'i') => re(patterns.size, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.size, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.size, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.size, flags), replacement),
        },
        unsupportedUnit: {
            regex: re(patterns.unsupportedUnit, 'i'),
            test: (str: string, flags = 'i') => re(patterns.unsupportedUnit, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.unsupportedUnit, flags)),
            matchAll: (str: string, flags = 'i') =>
                str.matchAll(re(patterns.unsupportedUnit, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.unsupportedUnit, flags), replacement),
        },
        angle: {
            regex: re(patterns.angle, 'i'),
            test: (str: string, flags = 'i') => re(patterns.angle, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.angle, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.angle, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.angle, flags), replacement),
        },
        percent: {
            regex: re(patterns.percent, 'i'),
            test: (str: string, flags = 'i') => re(patterns.percent, flags).test(str),
            match: (str: string, flags = 'i') => str.match(re(patterns.percent, flags)),
            matchAll: (str: string, flags = 'i') => str.matchAll(re(patterns.percent, flags)),
            replace: (str: string, replacement: (found: string) => string, flags = 'i') =>
                str.replace(re(patterns.percent, flags), replacement),
        },
    }
})()
