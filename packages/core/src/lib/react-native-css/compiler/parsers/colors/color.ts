import Color, { Coords } from 'colorjs.io'

export type ThemeMode = 'dark' | 'light' | 'system'

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

export function toHslString(values: Coords, alpha = 1): HslValueString {
    return new Color({ space: 'oklch', coords: values, alpha: normalizeAlpha(alpha) })
        .to('hsl')
        .toString() as HslValueString
}

export function toOklchString(values: Coords, alpha?: number): OklchValueString {
    return new Color('oklch', values, normalizeAlpha(alpha)).toString() as OklchValueString
}
