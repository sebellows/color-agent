// type ShadowTokenProperties = { [key in keyof ShadowTokenObjectValue]?: string | number }

import { isPlainObject } from '@coloragent/utils'
import { isReference, findReferencedToken } from '../token.utils'
import { ShadowTokenObjectValue, TokenMap, TokenValue, PureTokenValue } from '../types'
import { dimensionTransform } from './dimension'
import { colorTransform } from './color'

function toShadowString(shadow: ShadowTokenObjectValue, tokenMap: TokenMap): string {
    const { offsetX, offsetY, blur, spread, color, inset } = shadow

    return [
        inset ? 'inset' : '',
        dimensionTransform(offsetX, tokenMap),
        dimensionTransform(offsetY, tokenMap),
        dimensionTransform(blur, tokenMap),
        dimensionTransform(spread, tokenMap),
        colorTransform(color, tokenMap),
    ]
        .filter(Boolean)
        .join(' ')
}

export function shadowTransform(value: TokenValue<'shadow'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'shadow'> = value

    if (isReference(value)) {
        tokenValue = findReferencedToken<'shadow'>(value, tokenMap)
    }

    if (!isPlainObject(tokenValue) && !Array.isArray(tokenValue)) {
        throw new Error(`Invalid shadow token value: ${JSON.stringify(value)}`)
    }

    if (Array.isArray(tokenValue)) {
        const tokenValues = tokenValue as ShadowTokenObjectValue[]
        const shadowProperties = tokenValues.reduce((acc, props, index) => {
            acc.push(toShadowString(props, tokenMap))
            return acc
        }, [] as string[])

        return shadowProperties.join(', ')
    }

    return toShadowString(tokenValue as ShadowTokenObjectValue, tokenMap)
}
