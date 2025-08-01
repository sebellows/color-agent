import { isPlainObject } from '@coloragent/utils'
import { isReference, findReferencedToken } from '@core/lib/design-tokens/token.utils'
import { TokenValue, TokenMap, PureTokenValue } from '@core/lib/design-tokens/types'
import { numberTransform } from './number'

export function ratioTransform(value: TokenValue<'ratio'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'ratio'> = value

    if (isReference(value)) {
        tokenValue = findReferencedToken<'ratio'>(value, tokenMap)
    }

    if (!isPlainObject(tokenValue)) {
        throw new Error(`Invalid ratio token value: ${JSON.stringify(tokenValue)}`)
    }

    return `${numberTransform(tokenValue.x, tokenMap)} / ${numberTransform(tokenValue.y, tokenMap)}`
}
