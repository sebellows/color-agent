import { isPlainObject } from '@coloragent/utils'
import { findReferencedToken, isReference, toUnitValue } from '@core/lib/design-tokens/token.utils'
import {
    DimensionTokenValue,
    LineCap,
    lineCapPredefinedValues,
    LineStyle,
    PureTokenValue,
    strokePredefinedValues,
    TokenMap,
    TokenValue,
} from '@core/lib/design-tokens/types'
import { colorTransform } from './color'
import { dimensionTransform } from './dimension'

type StrokeStyleProperties = { dashArray?: string; lineCap?: LineCap }

export function borderStyleTransform(value: TokenValue<'border'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'border'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'border'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    }

    if (!isPlainObject(tokenValue)) {
        throw new Error(`Invalid color token value: ${JSON.stringify(value)}`)
    }

    const tokenProperties: string[] = []

    if (isPlainObject(tokenValue)) {
        if (!('width' in tokenValue) || !('style' in tokenValue) || !('color' in tokenValue)) {
            throw new Error(`Invalid border token value: ${JSON.stringify(tokenValue)}`)
        }

        tokenProperties.push(dimensionTransform(tokenValue.width, tokenMap))

        const borderStyle = strokeStyleTransform(tokenValue.style, tokenMap) as LineStyle
        tokenProperties.push(typeof borderStyle === 'string' ? borderStyle : 'solid')

        tokenProperties.push(colorTransform(tokenValue.color, tokenMap))
    }

    return tokenProperties.join(' ')
}

export function strokeStyleTransform(
    value: TokenValue<'strokeStyle'>,
    tokenMap: TokenMap,
): string | StrokeStyleProperties {
    let tokenValue: PureTokenValue<'strokeStyle'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'strokeStyle'>(value, tokenMap)
    } else if (typeof value == 'string' && strokePredefinedValues.includes(value)) {
        tokenValue = value as PureTokenValue<'strokeStyle'>
    } else if (isPlainObject(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid stroke style token value: ${JSON.stringify(value)}`)
    }

    if (typeof tokenValue === 'string') {
        return tokenValue
    }

    const tokenProperties = {} as StrokeStyleProperties
    if ('dashArray' in tokenValue) {
        let dashArrayObj: DimensionTokenValue[] = []
        if (isReference(tokenValue.dashArray)) {
            const dashArrayRef = findReferencedToken<'dimension'>(tokenValue.dashArray, tokenMap)
            dashArrayObj = Array.isArray(dashArrayRef) ? dashArrayRef : [dashArrayRef]
        } else if (Array.isArray(tokenValue.dashArray)) {
            dashArrayObj = tokenValue.dashArray.map(d => {
                if (isReference(d)) {
                    return findReferencedToken<'dimension'>(d, tokenMap)
                }
                return d as DimensionTokenValue
            })
        } else {
            throw new Error(`Invalid dashArray value: ${JSON.stringify(tokenValue.dashArray)}`)
        }
        tokenProperties.dashArray = dashArrayObj.map(toUnitValue).join(' ')
    }
    if ('lineCap' in tokenValue && lineCapPredefinedValues.includes(tokenValue.lineCap)) {
        tokenProperties.lineCap = tokenValue.lineCap
    }

    return tokenProperties
}
