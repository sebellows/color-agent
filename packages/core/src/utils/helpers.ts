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
