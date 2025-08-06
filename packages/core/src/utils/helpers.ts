import { Booleanish } from '@coloragent/utils'

export function isBooleanish(value: unknown): value is Booleanish {
    return typeof value == 'string' && (value === 'true' || value === 'false')
}

export function round(number: number) {
    return Math.round((number + Number.EPSILON) * 100) / 100
}

export function ensureArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value]
}

export function stripUnit(value: unknown): number {
    if (typeof value !== 'string' && typeof value !== 'number') {
        throw new Error('Value must be a string or number')
    }

    if (typeof value === 'number') {
        return value
    }

    if (/\B(px|em|rem)$/.test(value)) {
        return parseInt(value.replace(/(px|em|rem)$/, ''))
    }

    return parseInt(value)
}
