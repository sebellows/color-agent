import Color, { Coords } from 'colorjs.io'
import { PureTokenValue, TokenMap, TokenValue } from '../types'
import { findReferencedToken, isColorTokenValue, isReference } from '../token.utils'
import { isPlainObject } from '@coloragent/utils'

export type OklchValueString = `oklch(${number}% ${number} ${number}${string}`
export type HslValueString = `hsl(${number} ${number}% ${number}%${string}`

function normalizeAlpha(alpha?: number) {
    if (typeof alpha === 'number') {
        if (alpha <= 1.0) {
            alpha = alpha <= 0 ? 0 : alpha
        } else if (alpha > 1) {
            alpha = alpha > 100 ? 100 : alpha
            alpha = alpha / 100
        }
    }
    return alpha
}

function toOklchString(values: Coords, alpha?: number): OklchValueString {
    return new Color('oklch', values, normalizeAlpha(alpha)).toString() as OklchValueString
}

function toHslString(values: Coords, alpha = 1): HslValueString {
    return new Color(toOklchString(values, alpha)).to('hsl').toString() as HslValueString
}

export function colorTransform(value: TokenValue<'color'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'color'> = value

    if (isReference(value)) {
        tokenValue = findReferencedToken<'color'>(value, tokenMap)
    }

    if (!isPlainObject(tokenValue) || !isColorTokenValue(tokenValue)) {
        throw new Error(`Invalid color token value: ${JSON.stringify(value)}`)
    }

    const colorFn = tokenValue.colorSpace === 'hsl' ? toHslString : toOklchString

    return colorFn(tokenValue.components, tokenValue.alpha)
}
