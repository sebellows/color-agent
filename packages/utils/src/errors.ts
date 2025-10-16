/**
 * Ensure all cases in a control flow are handled by asserting a value is 'never'.
 *
 * Typically used in 'switch' statements to enforce exhaustiveness.
 * TypeScript's type checking will catch unhandled cases at compile time.
 *
 * All assertion functions borrowed from Leather.io's mono repo.
 * Source: https://github.com/leather-io/mono/blob/main/packages/utils/
 */

import { isNil } from 'es-toolkit'

export function assertUnreachable(
    value: unknown,
    message?: string | null,
    { shouldThrow = true }: { shouldThrow?: boolean } = {},
): void {
    const strValue = typeof value === 'string' ? value : JSON.stringify(value)
    const msg = message ?? 'Unexpected value:'

    if (!shouldThrow) {
        console.warn(
            `Source: "@coloragent/utils/src/errors/#assertUnreachable"\nMessage: "${msg}${strValue}"`,
        )
        return
    }

    throw new Error(`${msg} ${strValue}`)
}

export function assertExistence<T>(
    value: T,
    message: string,
    { shouldThrow = true }: { shouldThrow?: boolean } = {},
): asserts value is NonNullable<T> {
    if (!isNil(value)) return

    if (!shouldThrow) {
        console.warn(
            `Source: "@coloragent/utils/src/errors/#assertExistence"\nMessage: "${message}"`,
        )
        return
    }

    throw new Error(message)
}

export function assertIsTruthy<T>(
    val: T,
    { shouldThrow = true }: { shouldThrow?: boolean } = {},
): asserts val is NonNullable<T> {
    if (`${val}` === 'true') return

    if (!shouldThrow) {
        console.warn(
            `Source: "@coloragent/utils/src/errors/#assertIsTruthy\nExpected: true\nActual: ${val}`,
        )
        return
    }

    throw new Error(`Expected: true, actual: ${val}`)
}
