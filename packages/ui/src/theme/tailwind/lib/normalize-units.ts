import { DeviceContext, Dimensions, Unit } from '../types'
import { warn } from './utils'

export const BASE_FONT_SIZE = 16

// Find fraction or alpha divisors
const fractionRE = /\d+\s*\/\s*\d+$/
// Find opacity level
const opacityRE = /\w\/(\d+)$/
// Find instances like `text-[14px]`
const customValueRE = /\-\[(\d+(\.\d+)?)?(px|rem)\]/

export function parseNumericValue(value: string): [number, Unit] | null {
    if (fractionRE.test(value)) {
        const [numerator = '', denominator = ''] = value.split('/', 2)
        const parsedNumerator = parseNumericValue(numerator)
        const parsedDenominator = parseNumericValue(denominator)
        if (!parsedNumerator || !parsedDenominator) {
            return null
        }
        return [parsedNumerator[0] / parsedDenominator[0], parsedDenominator[1]]
    }

    if (opacityRE.test(value)) {
        // This will come up when dealing with color classes like `bg-blue-500/50`
        // or `text-red-600/75`. Since we are using HSL colors for RN, we can
        // parse the opacity level from the class name.
        const match = value.match(opacityRE)
        if (match) {
            const number = parseFloat(match[1])
            const alpha = number / 100
            return [alpha, Unit.none]
        }
    }

    if (customValueRE.test(value)) {
        // ex: `text-[14px]` => `["-[14px]", "14", undefined, "px"]`
        const match = value.match(customValueRE)
        if (match) {
            const number = parseFloat(match[1])
            const unit =
                match[3] === 'px' ? Unit.px
                : match[3] === 'rem' ? Unit.rem
                : Unit.none
            return [number, unit]
        }
    }

    const number = parseFloat(value)
    if (Number.isNaN(number)) {
        return null
    }

    const match = value.match(/(([a-z]{2,}|%))$/)
    if (!match) {
        return [number, Unit.none]
    }

    const unit = match?.[1] as keyof typeof Unit

    if (!(unit in Unit)) {
        return null
    }

    return [number, Unit[unit]]
}

export function formatNumericValue(
    number: number,
    unit: Unit,
    dimensions: Dimensions,
): string | number | null {
    const { height, width } = dimensions
    const isNegative = number < 0

    switch (unit) {
        case Unit.rem:
            return number * BASE_FONT_SIZE * (isNegative ? -1 : 1)
        case Unit.px:
            return number * (isNegative ? -1 : 1)
        case Unit.percent:
            return `${isNegative ? '-' : ''}${number}%`
        case Unit.none:
            return number * (isNegative ? -1 : 1)
        case Unit.vw:
            if (!width) {
                warn('`vw` CSS unit requires configuration with `useDeviceContext()`')
                return null
            }
            return width * (number / 100)
        case Unit.vh:
            if (!height) {
                warn("`vh` CSS unit requires configuration with `useDeviceContext()'")
                return null
            }
            return height * (number / 100)
        case Unit.deg:
        case Unit.rad:
            return `${number * (isNegative ? -1 : 1)}${unit}`
        default:
            return null
    }
}

export const emToPx = (value: number | string, base: number = BASE_FONT_SIZE) =>
    Number.parseFloat(value.toString()) * base

export function toPx(value: string, base = BASE_FONT_SIZE): number | null {
    const parsed = parseNumericValue(value)
    if (!parsed) {
        return null
    }
    const [number, unit] = parsed
    switch (unit) {
        case Unit.em:
            return emToPx(number, base)
        case Unit.rem:
            return emToPx(number, BASE_FONT_SIZE)
        case Unit.px:
            return number
        default:
            return null
    }
}
