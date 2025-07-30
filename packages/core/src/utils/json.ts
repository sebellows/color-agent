import { isPlainObject } from '@coloragent/utils'
import { JsonArray, JsonObject, JsonPrimitive } from 'type-fest'

export type JSONObj = JsonObject | JsonArray
export type JSONable = string | number | boolean | null | JSONObj

export function isJSONPrimitive(value: unknown): value is JsonPrimitive {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null
    )
}

export function isJSONSerializable(value: unknown): value is JSONObj {
    if (isPlainObject(value) || Array.isArray(value)) {
        return true
    }

    return false
}
