import { isPlainObject } from '@coloragent/utils'
import { isReference, findReferencedToken } from '@core/lib/design-tokens/token.utils'
import {
    TokenValue,
    TokenMap,
    PureTokenValue,
    TransitionTokenObjectValue,
} from '@core/lib/design-tokens/types'
import { durationTransform } from './duration'

export function cubicBezierTransform(value: TokenValue<'cubicBezier'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'cubicBezier'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'cubicBezier'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid cubic bezier token value: ${JSON.stringify(value)}`)
    }

    if (typeof tokenValue === 'string') {
        return tokenValue
    }

    if (
        Array.isArray(tokenValue) &&
        tokenValue.length === 4 &&
        tokenValue.every(v => typeof v === 'number')
    ) {
        return `cubic-bezier(${tokenValue.join(', ')})`
    }

    throw new Error(`Invalid cubic bezier token value: ${JSON.stringify(tokenValue)}`)
}

type TransitionProperties = { [key in keyof TransitionTokenObjectValue]?: string }

export function transitionTransform(
    value: TokenValue<'transition'>,
    tokenMap: TokenMap,
): TransitionProperties {
    let tokenValue: PureTokenValue<'transition'> = value

    if (isReference(value)) {
        tokenValue = findReferencedToken<'transition'>(value, tokenMap)
    }

    if (!isPlainObject(tokenValue)) {
        throw new Error(`Invalid transition token value: ${JSON.stringify(value)}`)
    }

    return {
        duration: durationTransform(tokenValue.duration, tokenMap),
        delay: durationTransform(tokenValue.delay, tokenMap),
        timingFunction: cubicBezierTransform(tokenValue.timingFunction, tokenMap),
    }
}
