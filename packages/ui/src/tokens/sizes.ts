import { DimensionValue } from 'react-native'
import { THEME_BASE_UNIT_SIZE } from '../theme/constants'
import { PlatformEnv, ValueOf } from '../types'

export const sizes = [
    0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 256,
    288, 320, 384,
] as const

// type SizeValue = (typeof sizes)[number] | 'auto' | 'none' | `${number}%`
type SizeKey = `${(typeof sizes)[number]}` | 'auto' | 'none' | `${number}%`

type SizeKeyWeb = `${(typeof sizes)[number]}` | 'auto' | 'none'
type SizeValueWeb = DimensionValue | 'none' | `${number}rem`

type SizingOptionsNative = Record<SizeKey, DimensionValue>
type SizingOptionsWeb = Record<SizeKeyWeb, SizeValueWeb>

export const getNativeSizeVariants = (): SizingOptionsNative => {
    const init = {} as SizingOptionsNative
    const units = sizes.reduce((acc, unit) => {
        const key = unit.toString() as SizeKey
        acc[key] = unit
        return acc
    }, init)

    return units
}

export const getWebSizeVariants = (): SizingOptionsWeb => {
    const init = { auto: 'auto', none: 'none' } as SizingOptionsWeb
    const units = sizes.reduce((acc, unit) => {
        const key = unit.toString() as SizeKeyWeb
        acc[key] = (
            unit === 0 ? '0' : `${Math.floor(unit / THEME_BASE_UNIT_SIZE)}rem`) as SizeValueWeb
        return acc
    }, init)

    return units
}

export function getSizeVariants(platform: ValueOf<PlatformEnv>) {
    if (platform === PlatformEnv.mobile) {
        return getNativeSizeVariants()
    }
    return getWebSizeVariants()
}
