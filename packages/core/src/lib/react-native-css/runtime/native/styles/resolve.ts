import { getType, isPlainObject } from '@coloragent/utils'
import { transformKeys } from '@core/react-native-css/common/properties'
import type {
    ResolveValueOptions,
    SimpleResolveValue,
    StyleDescriptor,
    StyleDescriptorRecord,
    StyleFunctionDescriptor,
} from '@core/react-native-css/compiler'
import { normalizeTokenSelector } from '@core/react-native-css/compiler/selectors'
import { STYLE_FUNCTION_SYMBOL } from '@core/react-native-css/runtime/constants'
import { stripUnit } from '@core/utils'

import { type Getter } from '../reactivity'
import { styleFunctions } from './style-function-registry'
import { varResolver } from './variables'

export function resolveValue(
    value: StyleDescriptor,
    get: Getter,
    options: ResolveValueOptions,
): StyleDescriptor {
    const { castToArray } = options
    const $type = getType(value)

    switch ($type) {
        case 'Number':
        case 'Boolean':
            return value
        case 'String':
            // Inline vars() might set a value with a px suffix
            return stripUnit(value)
        case 'Object':
            if (!isPlainObject(value)) {
                // This will never happen, but TypeScript isn't convinced
                return value
            }

            if (!(STYLE_FUNCTION_SYMBOL in value)) {
                return value as StyleDescriptorRecord
            }

            const styleDescriptor = value as StyleFunctionDescriptor

            if (typeof styleDescriptor.func !== 'string') return value

            const { func: funcName, value: descValue } = styleDescriptor

            const simpleResolve: SimpleResolveValue = value => resolveValue(value, get, options)

            // `@translate`, `@rotate`, `@scale`, etc. => `translate`, `rotate`, `scale`, etc.
            const unprefixedName = normalizeTokenSelector(funcName, '@')

            if (funcName === 'var') {
                return varResolver(simpleResolve, funcName, get, options)
            } else if (funcName in styleFunctions) {
                const fn = styleFunctions[funcName]

                if (typeof fn !== 'function') {
                    throw new Error(`Unknown style function: ${funcName}`)
                }

                value = fn(simpleResolve, styleDescriptor, get, options)
            } else if (transformKeys.has(funcName)) {
                // translate, rotate, scale, etc.
                return simpleResolve(funcName, descValue, castToArray)
            } else if (transformKeys.has(unprefixedName)) {
                return { [unprefixedName]: simpleResolve(funcName, descValue, castToArray)[0] }
            } else {
                let _args = simpleResolve(funcName, descValue, castToArray)

                if (_args === undefined) return undefined

                if (Array.isArray(_args)) {
                    if (_args.length === 1) {
                        _args = _args[0]
                    }

                    let joinedArgs = _args
                        .map((arg: unknown) => (Array.isArray(arg) ? arg.flat().join(' ') : arg))
                        .join(', ')

                    if (funcName === 'radial-gradient') {
                        // Nativewind / Tailwind CSS hack which can force the 'in oklab' color space
                        joinedArgs = joinedArgs.replace('in oklab, ', '')
                    }

                    value = `${funcName}(${joinedArgs})`
                } else {
                    value = `${funcName}(${_args})`
                }
            }

            return castToArray && value && !Array.isArray(value) ? [value] : value
        case 'Array': {
            if (isDescriptorArray(value)) {
                value = value.map(d => {
                    const value = resolveValue(d, get, options)
                    return value === undefined ? [] : value
                }) as StyleDescriptor[]

                return value
            }
            throw new Error(
                `What the hell is this? ${
                    value ? value?.toString() : 'undefined is what it be, argh!'
                }`,
            )
        }
    }
}

function isDescriptorArray(value: StyleDescriptor | StyleDescriptor[]): value is StyleDescriptor[] {
    return Array.isArray(value) && typeof value[0] === 'object' ? Array.isArray(value[0]) : true
}
