import { isPlainObject } from '@coloragent/utils'
import { findReferencedToken, isReference, toUnitValue } from '../token.utils'
import { TokenValue, TokenMap, PureTokenValue } from '../types'

export function dimensionTransform(value: TokenValue<'dimension'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'dimension'> = value

    if (isReference(value)) {
        tokenValue = findReferencedToken<'dimension'>(value, tokenMap)
    }

    if (!isPlainObject(value)) {
        throw new Error(`Invalid dimension token value: ${JSON.stringify(value)}`)
    }

    return toUnitValue(tokenValue)
}
