import Color, { Coords } from 'colorjs.io'
import { ColorToken, ColorTokenValue, ReferenceValue, Token, TokenValue, Transform } from '../types'
import { isReference, isTokenValueObject } from '../token.utils'
import { CSS_EXTENSION, RESOLVED_EXTENSION } from '../constants'

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

function toHslString(values: Coords, alpha = 1): HslValueString {
    return new Color({ space: 'oklch', coords: values, alpha: normalizeAlpha(alpha) })
        .to('hsl')
        .toString() as HslValueString
}

function toOklchString(values: Coords, alpha?: number): OklchValueString {
    return new Color('oklch', values, normalizeAlpha(alpha)).toString() as OklchValueString
}

function parseColorTokenValue(value: TokenValue<'color'>): string {
    if (!isTokenValueObject(value)) {
        throw new Error(`Expected color value to be an object, got ${typeof value}`)
    }
    if (value.colorSpace === 'oklch') {
        return toOklchString(value.components, value.alpha)
    }
    if (value.colorSpace === 'hsl') {
        return toHslString(value.components, value.alpha)
    }
    throw new Error(`Unsupported color space: ${value.colorSpace}`)
}

function colorTransform(token: ColorToken): ColorToken {
    const cssExtension: {
        value?: string
        resolved?: string
    } = {}

    if (isReference(token.$value)) {
        cssExtension.value = token.$value
    } else {
        cssExtension.value = parseColorTokenValue(token.$value)
    }

    if (token.$extensions?.[RESOLVED_EXTENSION]) {
        const resolvedToken = token.$extensions[RESOLVED_EXTENSION] as Exclude<
            ColorTokenValue,
            ReferenceValue
        >

        cssExtension.resolved = parseColorTokenValue(resolvedToken)
    }

    if (Object.keys(cssExtension).length > 0) {
        if (!token.$extensions) {
            token.$extensions = {}
        }
        token.$extensions[CSS_EXTENSION] = cssExtension
    }

    return token
}

export const cssColorTransform: Transform<'color'> = {
    name: 'color',
    type: 'css/color',
    transformer: (token: Token) => {
        if (token.$type === 'color') {
            return colorTransform(token as Token<'color'>)
        }
        return token
    },
}
