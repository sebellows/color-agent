import { isPlainObject } from '@coloragent/utils'
import { findReferencedToken, isReference } from '@core/lib/design-tokens/token.utils'
import {
    PureTokenValue,
    TokenMap,
    TokenValue,
    TypographyTokenObjectValue,
} from '@core/lib/design-tokens/types'
import { fontFamilyTransform, fontWeightTransform } from './font'
import { dimensionTransform } from './dimension'
import { numberTransform } from './number'

type TypographyTokenProperties = { [key in keyof TypographyTokenObjectValue]: string }

export function typographyTransform(
    value: TokenValue<'typography'>,
    tokenMap: TokenMap,
): TypographyTokenProperties {
    let tokenValue: PureTokenValue<'typography'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'typography'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    }

    if (!isPlainObject(tokenValue)) {
        throw new Error(`Invalid typography token value: ${JSON.stringify(value)}`)
    }

    const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } = tokenValue

    return {
        fontFamily: fontFamilyTransform(fontFamily, tokenMap),
        fontSize: dimensionTransform(fontSize, tokenMap),
        fontWeight: fontWeightTransform(fontWeight, tokenMap),
        letterSpacing: dimensionTransform(letterSpacing, tokenMap),
        lineHeight: numberTransform(lineHeight, tokenMap).toString(),
    } as TypographyTokenProperties
}
