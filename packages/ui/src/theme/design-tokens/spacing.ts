import { ValueOf } from 'type-fest'

import { Config } from '../../config'

const SPACE = Config.get('theme.SPACING_UNIT')

const negativeSpacing = {
    '-px': -1,
    '-0.5': -2, // 0.5 * -SPACE,
    '-1': -4, // 1 * -SPACE,
    '-2': -8, // 2 * -SPACE,
    '-3': -12, // 3 * -SPACE,
    '-4': -16, // 4 * -SPACE,
    '-6': -24, // 6 * -SPACE,
    '-8': -32, // 8 * -SPACE,
    '-10': -40, // 10 * -SPACE,
    '-12': -48, // 12 * -SPACE,
    '-xs': -4, // 1 * -SPACE,
    '-default': -8, // 2 * -SPACE,
    '-sm': -12, // 3 * -SPACE,
    '-md': -16, // 4 * -SPACE,
    '-lg': -24, // 6 * -SPACE,
    '-xl': -32, // 8 * -SPACE,
    '-xxl': -40, // 10 * -SPACE,
    '-xxxl': -48, // 12 * -SPACE,
} as const

const spacing = {
    auto: 0,
    none: 0,
    px: 1,
    '0.5': 2, // 0.5 * SPACE,
    '1': SPACE, // 1 * SPACE,
    '2': 8, // 2 * SPACE,
    '3': 12, // 3 * SPACE,
    '4': 16, // 4 * SPACE,
    '6': 24, // 6 * SPACE,
    '8': 32, // 8 * SPACE,
    '10': 40, // 10 * SPACE,
    '12': 48, // 12 * SPACE,
    xs: 4, // 1 * SPACE,
    default: 8, // 2 * SPACE,
    sm: 12, // 3 * SPACE,
    md: 16, // 4 * SPACE,
    lg: 24, // 6 * SPACE,
    xl: 32, // 8 * SPACE,
    xxl: 40, // 10 * SPACE,
    xxxl: 48, // 12 * SPACE,
} as const

export type SpacingToken = keyof typeof spacing
export type NegativeSpacingToken = keyof typeof negativeSpacing

export type Spacing<Key extends SpacingToken = SpacingToken> = ValueOf<typeof spacing, Key>

export default spacing
export { negativeSpacing }

export const spacingUtil = (value: number) => value * SPACE
