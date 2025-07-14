import fs from 'fs'
import path from 'path'
import {
    BaseTokenProperties,
    BorderToken,
    GradientToken,
    PureToken,
    PureTokenValue,
    ReferenceValue,
    ShadowToken,
    StrokeStyleToken,
    Token,
    TokenCompositeValue,
    TokenGroup,
    TokenType,
    TokenValue,
    Transform,
    TransitionToken,
    TypographyToken,
} from './types'
import { isMap, isPlainObject } from '@coloragent/utils'

/**
 * The unallowed characters in token or group name.
 * Reference: https://tr.designtokens.org/format/#character-restrictions
 */
export const UNALLOWED_CHARACTERS_IN_NAME = ['{', '}', '.', '$']

/** The keys of the Design Tokens Community Group Format. */
export const DTCG_KEYS = ['$value', '$type', '$description', '$extensions']

export const COMPOSITE_TOKEN_TYPES: TokenType[] = [
    'transition',
    'shadow',
    'gradient',
    'typography',
    'strokeStyle',
    'border',
]

export function isTokenValueObject<T extends Record<string, any>>(value: unknown): value is T {
    return Object.prototype.toString.call(value) === '[object Object]' && value !== null
}

/**
 * Check if the value has unallowed characters in the name.
 * Reference: https://tr.designtokens.org/format/#character-restrictions
 */
export function hasUnallowedCharactersInName(value: string) {
    return (
        UNALLOWED_CHARACTERS_IN_NAME.some(char => value.includes(char)) &&
        DTCG_KEYS.every(key => value !== key)
    )
}

/**
 * Check if the object is a token.
 * Reference: https://tr.designtokens.org/format/#additional-group-properties
 */
export function hasTokenType(obj: object): obj is Token {
    return obj.hasOwnProperty('$type')
}

/**
 * Check if the object is a token.
 * Reference: https://tr.designtokens.org/format/#additional-group-properties
 */
export function isToken(obj: object): obj is Token {
    return obj.hasOwnProperty('$value')
}

/**
 * Check if the value is composite.
 * It can be an object or an array of objects.
 *
 * @param value - The value to check.
 * @returns Boolean value.
 */
export function isValueComposite(value: TokenValue): value is TokenCompositeValue {
    if (Array.isArray(value)) {
        return value.every(
            v => (typeof v === 'object' && value !== null) || isReference(v), // TODO: Check if it should be isReference(v)
        )
    }

    return typeof value === 'object' && value !== null
}

export function isTokenComposite(
    value: Token,
): value is
    | TransitionToken
    | ShadowToken
    | GradientToken
    | TypographyToken
    | BorderToken
    | StrokeStyleToken {
    if (!value.$type) {
        return false
    }

    return COMPOSITE_TOKEN_TYPES.includes(value.$type)
}

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
    return (
        isPlainObject(value) &&
        !isToken(value) &&
        Object.keys(value).some(key => {
            const token = value[key]
            return isToken(token) || (isPlainObject(token) && Object.keys(token).length > 0)
        })
    )
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

export function hasColorWithAlpha(token: Token): boolean {
    if (!token?.$type || token.$type !== 'color') {
        return false
    }

    const { $value } = token as PureToken<'color'>

    if (typeof $value !== 'object' || !$value) {
        return false
    }

    return typeof $value?.alpha === 'number' && $value.alpha < 1
}

/** Convert a token value to a string with unit. */
export function toUnitValue(tokenValue: TokenValue<'dimension'> | TokenValue<'duration'>): string {
    if (isPlainObject(tokenValue)) {
        return `${tokenValue.value}${tokenValue.unit}`
    }

    return tokenValue
}

/**
 * Type guard to distinguish between the two possible types of transformer
 * and handle them appropriately.
 */
export function applyTransform(transform: Transform, input: string | Token) {
    if (transform.type.startsWith('css/')) {
        // Ensure input is TokenInfo
        if (isPlainObject(input)) {
            // TODO: Fix `any` type
            return transform.transformer(input as any)
        } else {
            throw new Error('Expected TokenInfo input for token transformer')
        }
    } else if (transform.type.startsWith('name/')) {
        // Ensure input is string
        if (typeof input === 'string') {
            return transform.transformer(input as any)
        } else {
            throw new Error('Expected string input for name transformer')
        }
    }
}

export function toDictionary<T>(_: T, obj: unknown): Record<string, any> {
    if (isMap(obj)) {
        return Array.from(obj.entries()).reduce(
            (acc, [key, value]) => {
                acc[key] = value
                return acc
            },
            {} as Record<string, any>,
        )
    } else if (isPlainObject(obj)) {
        return obj
    }

    throw new TypeError(`Expected a Map or an Object, got ${typeof obj}`)
}

export function findReferencedToken<$T extends TokenType>(
    token: Token<$T>,
    tokenMap: Map<string, Token>,
): Token<$T> {
    if (isReference(token)) {
        const tokenReference = unwrapReference(token)
        const referencedToken = tokenMap.get(tokenReference)
        if (referencedToken && referencedToken.$type === token.$type) {
            return referencedToken as Token<$T>
        }
    }

    return token
}

export type TokenInfo = {
    token: Token
    path: string
    prevType?: TokenType
    prevGroupProperties?: BaseTokenProperties<TokenType>
}

export function traverseTokens(
    value: unknown,
    {
        onToken,
        onGroup,
    }: {
        onToken?: (tokenInfo: TokenInfo) => void
        onGroup?: (group: TokenGroup, path: string) => void
    },
) {
    if (value instanceof Map) {
        value = Object.fromEntries(value)
    }

    const stack: {
        token: Token | TokenGroup
        path: string
        prevType?: TokenType
        prevGroupProperties?: BaseTokenProperties<TokenType>
    }[] = [{ token: value as Token | TokenGroup, path: '' }]

    while (stack.length > 0) {
        const { token, path, prevType, prevGroupProperties } = stack.shift()!

        if (isToken(token) && onToken) {
            onToken({ token, path, prevType, prevGroupProperties })
            continue
        }

        if (!isPlainObject(token)) {
            throw new Error('Should not reach here')
        }

        if (onGroup) {
            onGroup(token as TokenGroup, path)
        }

        const entries = Object.entries(token)
        for (const [nextKey, nestedValue] of entries) {
            if (nextKey.startsWith('$')) continue

            const finalKey =
                nextKey === '' ? path
                : path ? `${path}.${nextKey}`
                : nextKey
            if (isPlainObject(nestedValue)) {
                const nextValue = nestedValue as Token | TokenGroup
                const newLastGroupProperties =
                    token.$description || token.$extensions || token.$type ?
                        {
                            $description: token.$description,
                            $extensions: token.$extensions,
                            $type: token.$type,
                        }
                    :   prevGroupProperties

                stack.push({
                    token: nextValue,
                    path: finalKey,
                    prevType: nextValue?.$type || prevType,
                    prevGroupProperties: newLastGroupProperties,
                })
            } else {
                throw new Error(
                    `Something is wrong with the structure of the tokens. Check the token with key: ${finalKey}`,
                )
            }
        }
    }
}

export type TokenMap = Map<string, Token>

export function flattenTokens(tokenObj: Token | TokenGroup): TokenMap {
    let _tokenMap: TokenMap = new Map()

    traverseTokens(tokenObj, {
        onToken({ token, path, prevType }) {
            if (prevType === undefined) {
                throw new Error('Last type is undefined')
            }

            const newToken: Token = { ...token, $type: prevType }

            _tokenMap.set(path, newToken)
        },
    })

    const tokenMap: TokenMap = new Map(
        [..._tokenMap.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    )

    return tokenMap
}

export function isBorderToken(token: Token): token is BorderToken {
    return token.$type === 'border'
}

export function isStrokeStyleToken(token: Token): token is StrokeStyleToken {
    return token.$type === 'strokeStyle'
}

export function isTypographyToken(token: Token): token is TypographyToken {
    return token.$type === 'typography'
}

export function isShadowToken(token: Token): token is ShadowToken {
    return token.$type === 'shadow'
}

export function isGradientToken(token: Token): token is GradientToken {
    return token.$type === 'gradient'
}

export function isTransitionToken(token: Token): token is TransitionToken {
    return token.$type === 'transition'
}

export function isColorToken(token: Token): token is Token<'color'> {
    return token.$type === 'color'
}

export function isDimensionToken(token: Token): token is Token<'dimension'> {
    return token.$type === 'dimension'
}

export function isDurationToken(token: Token): token is Token<'duration'> {
    return token.$type === 'duration'
}

export function isCubicBezierToken(token: Token): token is Token<'cubicBezier'> {
    return token.$type === 'cubicBezier'
}

export function isNumberToken(token: Token): token is Token<'number'> {
    return token.$type === 'number'
}

export function isFontFamilyToken(token: Token): token is Token<'fontFamily'> {
    return token.$type === 'fontFamily'
}

export function isFontWeightToken(token: Token): token is Token<'fontWeight'> {
    return token.$type === 'fontWeight'
}

export function isRatioToken(token: Token): token is Token<'ratio'> {
    return token.$type === 'ratio'
}

export function isPureToken(token: Token): token is PureToken {
    return !isReference(token.$value)
}
