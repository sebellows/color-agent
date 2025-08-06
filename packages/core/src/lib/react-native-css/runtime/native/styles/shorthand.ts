import { variadic } from '@coloragent/utils'

import type { StyleDescriptor, StyleFunctionResolver } from '../../../compiler'
import { defaultValues } from './defaults'

type ShorthandType = 'string' | 'number' | 'length' | 'color' | Readonly<string[]>

export type ShorthandRequiredValue =
    | readonly [string | readonly string[], ShorthandType]
    | ShorthandDefaultValue

type ShorthandDefaultValue = readonly [string | readonly string[], ShorthandType, any]

export const ShortHandSymbol = Symbol()

export type ShorthandProperties = readonly [string, readonly string[]] & {
    [ShortHandSymbol]: true
}

export function shorthandHandler(
    mappings: ShorthandRequiredValue[][],
    defaults: ShorthandDefaultValue[],
) {
    const resolveFn: StyleFunctionResolver = (resolveValue, descriptor, _, { castToArray }) => {
        const args = variadic(descriptor.value) || []

        const resolved = args.flatMap(value => resolveValue(value, castToArray))

        const match = mappings.find(mapping => {
            return (
                resolved.length === mapping.length &&
                mapping.every((map, index) => {
                    const type = map[1]
                    const value = resolved[index]

                    if (Array.isArray(type)) {
                        return type.includes(value)
                    }

                    switch (type) {
                        case 'string':
                        case 'number':
                            return typeof value === type
                        case 'color':
                            return typeof value === 'string' || typeof value === 'object'
                        case 'length':
                            return typeof value === 'string' ?
                                    value.endsWith('%')
                                :   typeof value === 'number'
                    }

                    return false
                })
            )
        })

        if (!match) return

        const seenDefaults = new Set(defaults)

        return Object.assign(
            [
                ...match.map((map, index): StyleDescriptor => {
                    if (map.length === 3) {
                        seenDefaults.delete(map)
                    }

                    let value = resolved[index]
                    if (castToArray && value && !Array.isArray(value)) {
                        value = [value]
                    }

                    return [value, map[0]]
                }),
                ...Array.from(seenDefaults).map(map => {
                    let value = defaultValues[map[2]] ?? map[2]
                    if (castToArray && value && !Array.isArray(value)) {
                        value = [value]
                    }

                    return [value, map[0]]
                }),
            ],
            { [ShortHandSymbol]: true },
        )
    }

    return resolveFn
}
