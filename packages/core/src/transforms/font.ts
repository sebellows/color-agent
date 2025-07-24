import { findReferencedToken, isReference, unwrapReference } from '../token.utils'
import {
    fontWeightPredefinedValues,
    FontWeightTokenValue,
    PureTokenValue,
    ReferenceValue,
    TokenMap,
    TokenValue,
} from '../types'

export function fontFamilyTransform(value: TokenValue<'fontFamily'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'fontFamily'> = value

    if (typeof value == 'string' && isReference(value)) {
        tokenValue = findReferencedToken(value, tokenMap)
    }

    if (typeof tokenValue !== 'string' && !Array.isArray(tokenValue)) {
        throw new Error(`Invalid font family token value: ${JSON.stringify(value)}`)
    }

    if (Array.isArray(value)) {
        tokenValue = value.map(v => (isReference(v) ? unwrapReference(v) : v)).join(', ')
    }

    return tokenValue.toString()
}

type PureFontWeightValue = Exclude<FontWeightTokenValue, ReferenceValue>

export function fontWeightTransform(
    value: TokenValue<'fontWeight'>,
    tokenMap: TokenMap,
): PureFontWeightValue {
    let tokenValue = value as PureFontWeightValue

    if (isReference(value)) {
        tokenValue = findReferencedToken(value, tokenMap) as PureFontWeightValue
    }

    if (!fontWeightPredefinedValues.includes(tokenValue)) {
        throw new Error(`Invalid font weight token value: ${JSON.stringify(value)}`)
    }

    return tokenValue
}
