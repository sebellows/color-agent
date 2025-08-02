import { isPlainObject } from '@coloragent/utils'
import { findReferencedToken, isReference } from '@core/lib/design-tokens/token.utils'
import { TokenValue, PureTokenValue, TokenMap } from '@core/lib/design-tokens/types'
import { colorTransform } from './color'
import { numberTransform } from './number'

function calculatePosition(position: number): string {
    if (position < 0 || position > 1) {
        throw new Error(
            `Invalid gradient color stop position: ${position}. Must be between 0 and 1.`,
        )
    }

    return `${position * 100}%`
}

/**
 * Transforms a gradient token value into a CSS gradient string.
 *
 * @see {@link https://tr.designtokens.org/format/#gradient} for more
 */
export function gradientTransform(value: TokenValue<'gradient'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'gradient'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'gradient'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    }

    const tokenProperties: string[] = ['90deg']

    if (!Array.isArray(tokenValue) || (Array.isArray(tokenValue) && tokenValue.length < 2)) {
        throw new Error(
            `Invalid gradient token value. More than one color stop is required: ${JSON.stringify(
                tokenValue,
            )}`,
        )
    }

    for (const colorStop of tokenValue) {
        if (!isPlainObject(colorStop) || !('color' in colorStop) || !('position' in colorStop)) {
            throw new Error(`Invalid gradient color stop: ${JSON.stringify(colorStop)}`)
        }
        const color = colorTransform(colorStop.color, tokenMap)
        const position = calculatePosition(numberTransform(colorStop.position, tokenMap))
        tokenProperties.push(`${color} ${position}`)
    }

    return `linear-gradient(${tokenProperties.join(', ')})`
}
