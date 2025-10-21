import { omit } from 'es-toolkit'
import { StringToNumber } from 'type-fest/source/internal'

import { Config } from '../../config'
import { isWeb } from '../../utils/common'
import { getEntries } from '../../utils/get-entries'

// const SPACE = Config.get('theme.SPACING_UNIT')
const BASE_FONT_SIZE = Config.get('theme.BASE_FONT_SIZE')

/**
 * Values are incremental and to be multiplied by whatever value the SPACE constant
 * is set to. This allows easy transition from REM units for web app to unitless,
 * pixel-based values on native devices.
 */
export const spacing = {
    auto: 'auto',
    none: 0,
    px: 1,
    xxxs: 2,
    xxs: 4,
    xs: 6,
    default: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
} as const

type Spacing = typeof spacing
export type SpacingToken = keyof Spacing

// type WebOnlySpacing = keyof Pick<Spacing, 'auto' | 'none'>
type UniversalSpacing = Omit<Spacing, 'auto' | 'none'>

// type NegativeSpacingKey<K extends SpacingToken = SpacingToken> = `-${K}`
export type NegativeSpacing = {
    [K in keyof Omit<Spacing, 'auto' | 'none'> as `-${K}`]: StringToNumber<`-${Spacing[K]}`>
}
// <K extends SpacingToken = SpacingToken> =
//     K extends WebOnlySpacing ? never : Record<NegativeSpacingKey<K>, StringToNumber<`-${Spacing[K]}`>>

/** For negative values we can skip the option of setting `-0`. */
export type NegativeSpacingToken = keyof NegativeSpacing // `-${keyof UniversalSpacing}`

const universalSpacing: UniversalSpacing = omit(spacing, ['auto', 'none'])

export const negativeSpacing = getEntries(universalSpacing).reduce((acc, [token, value]) => {
    const key = `-${token}`
    acc[key] = value * -1
    return acc
}, {} as NegativeSpacing)

export const spacingUtil = (value: number) => (isWeb ? value / BASE_FONT_SIZE : value)
