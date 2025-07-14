import { RESOLVED_EXTENSION, CSS_EXTENSION, METADATA_EXTENSION } from '../constants'
import { isReference, toUnitValue } from '../token.utils'
import {
    Token,
    ReferenceValue,
    Transform,
    TypographyToken,
    Style,
    CustomPropertyTransform,
    MetadataExtension,
} from '../types'

export const customPropertyTypographyTransform: CustomPropertyTransform = {
    name: 'typography',
    type: 'css/typography',
    transformer: (key: string, unknownToken: Token) => {
        const transformed: {
            value?: string | Style
            resolvedValue?: string | Style
        } = {}

        if (unknownToken.$type !== 'typography') {
            return unknownToken
        }

        const token = unknownToken as TypographyToken

        if (isReference(token.$value)) {
            transformed.value = token.$value
        } else {
            const metadata = token.$extensions?.[METADATA_EXTENSION] as MetadataExtension
            if (!metadata) return transformed

            const { customPropertyPrefix = '' } = metadata

            transformed.value = {
                '--font': token.$value.fontFamily,
                fontSize: toUnitValue(token.$value.fontSize),
                fontWeight: token.$value.fontWeight,
                letterSpacing: token.$value.letterSpacing,
                lineHeight: token.$value.lineHeight,
            }
        }

        if (token.$extensions && token.$extensions[RESOLVED_EXTENSION]) {
            const resolvedValue = token.$extensions[RESOLVED_EXTENSION] as Exclude<
                TypographyToken['$value'],
                ReferenceValue
            >
            transformed.resolvedValue = {
                fontFamily: resolvedValue.fontFamily,
                fontSize: toUnitValue(resolvedValue.fontSize),
                fontWeight: resolvedValue.fontWeight,
                letterSpacing: resolvedValue.letterSpacing,
                lineHeight: resolvedValue.lineHeight,
            }
            // `${resolvedValue.fontWeight} ${toUnitValue(
            //     resolvedValue.fontSize,
            // )}/${resolvedValue.lineHeight} ${resolvedValue.fontFamily}`
        }

        if (Object.keys(transformed).length > 0) {
            if (!token.$extensions) {
                token.$extensions = {}
            }
            token.$extensions[CSS_EXTENSION] = transformed
        }

        return token
    },
}

export const cssTypographyTransform: Transform = {
    name: 'typography',
    type: 'css/typography',
    transformer: (unknownToken: Token) => {
        const transformed: {
            value?: string | Style
            resolvedValue?: string | Style
        } = {}

        if (unknownToken.$type !== 'typography') {
            return unknownToken
        }

        const token = unknownToken as TypographyToken

        if (isReference(token.$value)) {
            transformed.value = token.$value
        } else {
            transformed.value = {
                fontFamily: token.$value.fontFamily,
                fontSize: toUnitValue(token.$value.fontSize),
                fontWeight: token.$value.fontWeight,
                letterSpacing: token.$value.letterSpacing,
                lineHeight: token.$value.lineHeight,
            }
        }

        if (token.$extensions && token.$extensions[RESOLVED_EXTENSION]) {
            const resolvedValue = token.$extensions[RESOLVED_EXTENSION] as Exclude<
                TypographyToken['$value'],
                ReferenceValue
            >
            transformed.resolvedValue = {
                fontFamily: resolvedValue.fontFamily,
                fontSize: toUnitValue(resolvedValue.fontSize),
                fontWeight: resolvedValue.fontWeight,
                letterSpacing: resolvedValue.letterSpacing,
                lineHeight: resolvedValue.lineHeight,
            }
            // `${resolvedValue.fontWeight} ${toUnitValue(
            //     resolvedValue.fontSize,
            // )}/${resolvedValue.lineHeight} ${resolvedValue.fontFamily}`
        }

        if (Object.keys(transformed).length > 0) {
            if (!token.$extensions) {
                token.$extensions = {}
            }
            token.$extensions[CSS_EXTENSION] = transformed
        }

        return token
    },
}
