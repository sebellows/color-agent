import { Multiply } from '@coloragent/utils'

// import { StringToNumber } from 'type-fest/source/internal'

import Config from '../../config'

// const sizesList = [8, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64] as const

const SPACE = Config.get('theme.SPACING_UNIT')

// const sizeIncrements = [
//     1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 32, 64,
// ] as const

// type Size = (typeof sizeIncrements)[number]

const sizesConfig = {
    '1': (1 * SPACE) as Multiply<1, typeof SPACE>,
    '1.5': (1.5 * SPACE) as 6,
    '2': (2 * SPACE) as Multiply<2, typeof SPACE>,
    '2.5': (2.5 * SPACE) as 10,
    '3': (3 * SPACE) as Multiply<3, typeof SPACE>,
    '3.5': (3.5 * SPACE) as 14,
    '4': (4 * SPACE) as Multiply<4, typeof SPACE>,
    '5': (5 * SPACE) as Multiply<5, typeof SPACE>,
    '6': (6 * SPACE) as Multiply<6, typeof SPACE>,
    '7': (7 * SPACE) as Multiply<7, typeof SPACE>,
    '8': (8 * SPACE) as Multiply<8, typeof SPACE>,
    '9': (9 * SPACE) as Multiply<9, typeof SPACE>,
    '10': (10 * SPACE) as Multiply<10, typeof SPACE>,
    '11': (11 * SPACE) as Multiply<11, typeof SPACE>,
    '12': (12 * SPACE) as Multiply<12, typeof SPACE>,
    '13': (13 * SPACE) as Multiply<13, typeof SPACE>,
    '14': (14 * SPACE) as Multiply<14, typeof SPACE>,
    '32': (32 * SPACE) as Multiply<32, typeof SPACE>,
    '64': (64 * SPACE) as Multiply<64, typeof SPACE>,
    full: '100%',
} as const

// const init = {} as { [K in Size as ToString<K>]: Multiply<K, typeof SPACE> }
// const sizesConfig = sizeIncrements.reduce((acc, size, i) => {
//     // const s = sizeIncrements[i]
//     // const value = (size * SPACE) as Multiply<typeof size, typeof SPACE>
//     acc[size] = size
//     return acc
// }, init)

export type Sizes = typeof sizesConfig
type Size = keyof Sizes // SizeList[number]

export const sizes = sizesConfig // sizesList // getNativeSizeVariants()

export type SizeToken = Size // keyof typeof sizes

export const isSizeToken = (size: unknown): size is SizeToken => {
    if (
        (typeof size === 'string' && size in sizes) ||
        (typeof size === 'number' && size.toString() in sizes)
    ) {
        return true
    }
    return false
}
