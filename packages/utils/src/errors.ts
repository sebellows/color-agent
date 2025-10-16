/**
 * Ensure all cases in a control flow are handled by asserting a value is 'never'.
 *
 * Typically used in 'switch' statements to enforce exhaustiveness.
 * TypeScript's type checking will catch unhandled cases at compile time.
 *
 * All assertion functions borrowed from Leather.io's mono repo.
 * Source: https://github.com/leather-io/mono/blob/main/packages/utils/
 */

import { isNil, isPlainObject, isString } from 'es-toolkit'
import { isNumber } from 'es-toolkit/compat'

export class UnreachableError extends Error {
    readonly name = 'UnreachableError'
    readonly datetime: string

    constructor(message: string, options?: ErrorOptions) {
        super(message, options)

        this.datetime = new Intl.DateTimeFormat('en-US').format(new Date())
    }
}

export class NonexistentValueError extends Error {
    readonly name = 'NonexistentValueError'
    readonly datetime: string

    constructor(message: string, options?: ErrorOptions) {
        super(message, options)

        this.datetime = new Intl.DateTimeFormat('en-US').format(new Date())
    }
}

export function assertUnreachable(value: unknown, message?: string | null): never {
    const strValue =
        isString(value) || isNumber(value) ? value.toString()
        : isPlainObject(value) ? JSON.stringify(value)
        : `${value}`
    const msg = message ?? 'Unexpected value: '

    throw new UnreachableError(`${msg} ${strValue}`)
}

export function assertExistence<T>(value: T, message: string): asserts value is NonNullable<T> {
    if (!isNil(value)) return

    throw new NonexistentValueError(message)
}

export function assertIsTruthy<T>(val: T): asserts val is NonNullable<T> {
    if (`${val}` === 'true') return

    throw new Error(`Expected: true, actual: ${val}`)
}
