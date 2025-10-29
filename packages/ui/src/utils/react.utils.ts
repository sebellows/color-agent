import { hasOwn } from '@coloragent/utils'
import { isPlainObject } from 'es-toolkit'

export function isRef<T, U = T extends React.RefObject<infer V> ? V : T>(
    value: unknown,
): value is React.RefObject<U> {
    return isPlainObject(value) && hasOwn(value, 'current')
}
