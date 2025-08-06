import { isDefined, isPlainObject } from '@coloragent/utils'
import { Length, LengthValue, MediaFeatureValue } from 'lightningcss'

import { supportedUnits } from '../common/properties'
import { VAR_SYMBOL } from '../runtime/constants'
import { InlineVariable } from './types'

export function isInlineVariable(value: unknown): value is InlineVariable {
    return isPlainObject(value) && VAR_SYMBOL in value
}

export type LengthToken = Extract<MediaFeatureValue, { type: 'length' }>

type GenericAstToken<T extends string = string, V extends unknown = any> = { type: T; value: V }

type AstTokenWithValue<T> =
    T extends { type: infer Typ; value: infer Val } ?
        Typ extends string ?
            GenericAstToken<Typ, Val>
        :   never
    :   never
export function isTokenWithValue<T>(token: unknown): token is AstTokenWithValue<T> {
    return isPlainObject(token) && isDefined(token.type) && isDefined(token?.value)
}

export function isLengthToken(token: unknown): token is LengthToken {
    return isTokenWithValue<LengthToken>(token) && token.type === 'length'
}

export function isLengthValueToken(token: unknown): token is Length {
    return isLengthToken(token) && ['value', 'calc'].includes(token.type)
}

export function getLengthValue(token: Length | LengthValue) {
    if (!('type' in token)) {
        console.warn('`getLengthValue` must be passed a `Length` or `LengthValue` token.')
        return undefined
    }
    if (isLengthValueToken(token)) {
        if (token.type === 'value') {
            const { unit, value } = token.value

            if (supportedUnits.has(unit)) {
                //
            }
        }
    }
}
