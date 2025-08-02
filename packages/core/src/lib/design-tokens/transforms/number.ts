import { findReferencedToken, isReference } from '@core/lib/design-tokens/token.utils'
import { TokenValue, TokenMap, PureTokenValue } from '@core/lib/design-tokens/types'

export function numberTransform(value: TokenValue<'number'>, tokenMap: TokenMap): number {
    let tokenValue: PureTokenValue<'number'> = value

    if (isReference(value)) {
        tokenValue = findReferencedToken<'number'>(value, tokenMap)
    }

    if (typeof tokenValue !== 'number') {
        throw new Error(`Invalid number token value: ${JSON.stringify(value)}`)
    }

    return tokenValue
}
