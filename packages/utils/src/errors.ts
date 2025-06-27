/**
 * Ensure all cases in a control flow are handled by asserting a value is `never`.
 *
 * Typically used in `switch` statements to enforce exhaustiveness.
 * TypeScript's type checking will catch unhandled cases at compile time.
 *
 * All assertion functions borrowed from Leather.io's mono repo.
 * Source: https://github.com/leather-io/mono/blob/main/packages/utils/
 */

export function assertUnreachable(value: unknown): never {
    const strValue = typeof value === 'string' ? value : JSON.stringify(value)
    throw new Error(`Unexpected value: ${strValue}`)
}

export function assertExistence<T>(value: T, message: string): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error(message)
    }
}

export function assertIsTruthy<T>(val: T): asserts val is NonNullable<T> {
    if (!val) throw new Error(`expected: true, actual: ${val}`)
}
