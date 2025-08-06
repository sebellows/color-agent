import { isObject, isPlainObject } from '@coloragent/utils'

import type {
    StyleDescriptor,
    // StyleFunction,
    StyleFunctionDescriptor,
    StyleTokenType,
} from '../../compiler'
import { STYLE_FUNCTION_SYMBOL } from '../constants'

export function isStyleDescriptorArray(
    value: StyleDescriptor | StyleDescriptor[],
): value is StyleDescriptor[] {
    if (Array.isArray(value)) {
        // If its an array and the first item is an object, the only allowed value is an array
        return isObject(value[0]) ? Array.isArray(value[0]) : true
    }

    return false
}

export function isStyleFunctionDescriptor<T extends StyleTokenType = StyleTokenType>(
    value: unknown,
): value is StyleFunctionDescriptor<T> {
    if (isPlainObject(value)) {
        return STYLE_FUNCTION_SYMBOL in value
    }

    return false
}

export function toStyleFunctionDescriptor<T extends StyleTokenType>(
    props: Omit<StyleFunctionDescriptor<T>, typeof STYLE_FUNCTION_SYMBOL>,
): StyleFunctionDescriptor<T> {
    const { processLast, func, type, valueType, value } = props

    if (!type || !value) {
        throw new Error('In StyleFunctionDescriptor, `property`, `type`, and `value` are required.')
    }

    const fn = {
        type,
        value,
        valueType,
        func,
        processLast,
        [STYLE_FUNCTION_SYMBOL]: true,
    }

    return fn
}
