import React from 'react'
import { DimensionValue } from 'react-native'
import { isPercentageString } from '@coloragent/utils'
import { THEME_BASE_UNIT_SIZE } from '../../scripts'
import { sizes } from '@ui/theme/properties/sizes'
import { PlatformEnv } from '../types'

type SizeMap = Record<string, DimensionValue>

const defaultSizes = ['auto'] as const

export function useThemeSize(platform: PlatformEnv) {
    const sizeMap: SizeMap = React.useMemo(() => {
        const isMobile = platform === PlatformEnv.mobile
        return [...defaultSizes, ...sizes].reduce((acc, size) => {
            const sizeKey = size.toString()
            let sizeValue: DimensionValue = size
            if (typeof size === 'string' || sizeKey === '0') {
                acc[sizeKey] = sizeValue
            } else {
                sizeValue = (
                    isMobile ? size : (
                        `${(size / THEME_BASE_UNIT_SIZE).toFixed(3)}rem`
                    )) as DimensionValue
                acc[sizeKey] = sizeValue
            }
            return acc
        }, {} as SizeMap)
    }, [platform])

    function resolveSizeProps(size: number | string | undefined): {
        width: DimensionValue
        height: DimensionValue
    } {
        if (size) {
            if (isPercentageString(size)) {
                return { width: size, height: size } // Return percentage as is
            }
            if (size in sizeMap) {
                return {
                    width: sizeMap[size],
                    height: sizeMap[size],
                }
            }
        } else {
            console.warn(`SizeResolver: Invalid size value "${size}". Using default size.`)
        }

        return {
            width: '100%',
            height: '100%',
        }
    }

    return {
        sizeMap,
        resolveSizeProps,
    }
}
