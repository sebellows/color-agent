import { isPlainObject } from '@coloragent/utils'
import { ReferenceValue, TokenValue } from '@core/lib/design-tokens/types'
import { unwrapReference } from '@core/lib/design-tokens/token.utils'

/**
 * Convert a reference value to a CSS Custom Property string.
 */
export function referenceToCustomProperty(value: ReferenceValue): string {
    const referencedToken = unwrapReference(value)
    const paths = referencedToken.split('.').slice(1) // remove `theme` prefix
    return `var(--${paths.join('-')})`
}

/**
 * Convert a dimension or duration token value to a string with its unit.
 */
export function toUnitValue(tokenValue: TokenValue<'dimension'> | TokenValue<'duration'>): string {
    if (isPlainObject(tokenValue)) {
        return `${tokenValue.value}${tokenValue.unit}`
    }

    return tokenValue
}
