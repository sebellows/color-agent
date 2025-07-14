import { RESOLVED_EXTENSION, CSS_EXTENSION } from '../constants'
import { isBorderToken, isReference, isStrokeStyleToken, toUnitValue } from '../token.utils'
import { Token, BorderToken, ReferenceValue, StrokeStyleToken, Transform } from '../types'

export const cssBorderStyleTransform: Transform<'border' | 'strokeStyle'> = {
    name: 'border',
    type: 'css/border',
    transformer: (token: Token) => {
        if (isBorderToken(token)) {
            return cssBorderTransform(token)
        }

        if (isStrokeStyleToken(token)) {
            return cssStrokeStyleTransform(token)
        }

        return token
    },
}

const cssBorderTransform = (token: BorderToken) => {
    const cssExtension: {
        value?: string
        resolvedValue?: string
    } = {}

    if (isReference(token.$value)) {
        cssExtension.value = token.$value
    } else {
        cssExtension.value = `${toUnitValue(token.$value.width)} ${token.$value.style} ${
            token.$value.color
        }`
    }

    if (token.$extensions && token.$extensions[RESOLVED_EXTENSION]) {
        const resolvedValue = token.$extensions[RESOLVED_EXTENSION] as Exclude<
            BorderToken['$value'],
            ReferenceValue
        >

        cssExtension.resolvedValue = `${toUnitValue(resolvedValue.width)} ${resolvedValue.style} ${
            resolvedValue.color
        }`
    }

    if (Object.keys(cssExtension).length > 0) {
        if (!token.$extensions) {
            token.$extensions = {}
        }
        token.$extensions[CSS_EXTENSION] = cssExtension
    }

    return token
}

/**
 * Should fallback to dashed if strokeStyle is a complex object according to the design
 * token specification.
 * @link https://tr.designtokens.org/format/#fallbacks
 */
const cssStrokeStyleTransform = (token: StrokeStyleToken) => {
    const transformed: {
        value?: string
        resolvedValue?: string
    } = {}

    transformed.value =
        isReference(token.$value) || typeof token.$value === 'string' ? token.$value : 'dashed'

    if (token.$extensions && token.$extensions[RESOLVED_EXTENSION]) {
        const resolvedValue = token.$extensions[RESOLVED_EXTENSION] as Exclude<
            StrokeStyleToken['$value'],
            ReferenceValue
        >

        transformed.resolvedValue = typeof resolvedValue === 'string' ? resolvedValue : 'dashed'
    }

    if (Object.keys(transformed).length > 0) {
        if (!token.$extensions) {
            token.$extensions = {}
        }
        token.$extensions[CSS_EXTENSION] = transformed
    }

    return token
}
