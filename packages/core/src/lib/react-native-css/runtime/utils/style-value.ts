import { camelCase, isObject } from '@coloragent/utils'
import { PropertyId } from 'lightningcss'

import type { StyleDescriptor, StyleFunction, StyleFunctionDescriptor } from '../../compiler'
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

export function isStyleFunction(value: StyleDescriptor): value is StyleFunction {
    if (Array.isArray(value)) {
        return isObject(value[0]) ? Object.keys(value[0]).length === 0 : false
    }

    return false
}

export function toStyleFunction<P extends PropertyId['property']>(
    props: StyleFunctionDescriptor<P>,
): StyleFunctionDescriptor<P> {
    const { processLast, property, func, rawValue, type, value } = props

    if (!property || !type || !value) {
        throw new Error('In StyleFunctionDescriptor, `property`, `type`, and `value` are required.')
    }

    const styleProperty = props.styleProperty || camelCase(property)

    const fn = {
        property,
        type,
        value,
        styleProperty,
        func,
        processLast,
        [STYLE_FUNCTION_SYMBOL]: true,
    }

    return fn
}
