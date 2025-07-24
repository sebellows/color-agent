import { isPlainObject } from '@coloragent/utils'
import { isReference, findReferencedToken, toUnitValue } from '../token.utils'
import { TokenValue, TokenMap, PureTokenValue } from '../types'

export function durationTransform(value: TokenValue<'duration'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'duration'> = value

    if (isReference(value)) {
        tokenValue = findReferencedToken<'duration'>(value, tokenMap)
    }

    if (!isPlainObject(value)) {
        throw new Error(`Invalid duration token value: ${JSON.stringify(value)}`)
    }

    return toUnitValue(tokenValue)
}
