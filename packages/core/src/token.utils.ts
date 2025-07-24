import { isPlainObject } from '@coloragent/utils'
import {
    PureToken,
    PureTokenValue,
    ReferenceValue,
    Token,
    TokenGroup,
    TokenJSON,
    TokenMap,
    TokenType,
    TokenValue,
} from './types'

/**
 * Check if the object is a token.
 * Reference: https://tr.designtokens.org/format/#additional-group-properties
 */
// export function isToken(obj: any): obj is Token {
//     return obj.hasOwnProperty('$value')
// }

export const tokenReferenceRegex = /^\{[a-zA-Z0-9\s@_-]+(?:\.[a-zA-Z0-9\s@_-]+)*\}$/

/**
 * Check if the value is a reference.
 *
 * @param value - The $value parameter of the Token.
 * @see Token
 * @returns The result of the check.
 */
export function isReference(value: any): value is ReferenceValue {
    return typeof value === 'string' && tokenReferenceRegex.test(value)
}

export function isTokenGroup(value: any): value is TokenGroup {
    return isPlainObject(value) && !('$value' in value)
}

/**
 * Unwrap the reference.
 *
 * @param value - The value parameter of the Token.
 * @see Token
 * @returns The unwrapped reference.
 */
export function unwrapReference(value: any): string {
    if (!isReference(value)) {
        throw new Error(`The token is not a reference. Got ${value}`)
    }

    return value.replace('{', '').replace('}', '')
}

/** Convert a token value to a string with unit. */
export function toUnitValue(tokenValue: TokenValue<'dimension'> | TokenValue<'duration'>): string {
    if (isPlainObject(tokenValue)) {
        return `${tokenValue.value}${tokenValue.unit}`
    }

    return tokenValue
}

export function findReferencedToken<$T extends TokenType>(
    value: TokenValue<$T>,
    tokenMap: TokenMap,
): PureTokenValue<$T> {
    if (isReference(value)) {
        const tokenReference = unwrapReference(value) // unwrapReference(value)
        const referencedToken = tokenMap.get(tokenReference)?.$value

        if (referencedToken) {
            return referencedToken as PureTokenValue<$T>
        }
    }

    return value as PureTokenValue<$T>
}

export function toTokenMap(tokens: TokenJSON): TokenMap {
    const tokenMap = new Map<string, Token>()

    function addTokens(group: TokenGroup, parentKey: string) {
        for (const [key, value] of Object.entries(group)) {
            if (key.startsWith('$') || !isPlainObject(value)) {
                continue
            }
            const tokenKey = `${parentKey}.${key}`
            if ('$value' in value) {
                tokenMap.set(tokenKey, value as Token)
            } else {
                addTokens(value, tokenKey)
            }
        }
    }

    for (const [groupName, group] of Object.entries(tokens.theme)) {
        addTokens(group, `theme.${groupName}`)
    }

    return tokenMap
}

export function isColorTokenValue(value: TokenValue): value is TokenValue<'color'> {
    const colorProps = [
        'colorSpace',
        'components',
        'alpha',
        'hex',
    ] as (keyof PureTokenValue<'color'>)[]
    return (
        isPlainObject(value) &&
        colorProps.every(key => key in value && typeof value[key] !== 'undefined')
    )
}

export function isPureToken(token: Token): token is PureToken {
    return !isReference(token.$value)
}
