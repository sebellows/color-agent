import { isDecimal } from '@coloragent/utils'
import { getEntries } from '@ui/utils/get-entries'

import {
    FontConfigType,
    FONTS_CONFIG,
    FontWeightKey,
    getFontFamilyOption,
    normalizeSize,
} from '../utils'

function parseFontFamily<K extends FontConfigType, W extends FontWeightKey<K>>(
    fontType: K,
    fontWeight: W = 400 as W,
) {
    const { fontFamily, fallback } = getFontFamilyOption(fontType, fontWeight)

    const familyStr = `"${fontFamily}", ${fallback}` as `"${typeof fontFamily}", ${typeof fallback}`

    return { fontFamily: familyStr, fontWeight }
}

type FontFamilyDefinition<
    K extends FontConfigType = FontConfigType,
    W extends FontWeightKey<K> = FontWeightKey<K>,
> = Record<W, ReturnType<typeof parseFontFamily<K, W>>>

export function resolveFontFamilyProps() {
    const init = {} as Record<FontConfigType, FontFamilyDefinition>

    return FONTS_CONFIG.reduce((acc, config) => {
        const { type, families } = config
        acc[type] = getEntries(families).reduce((acc2, [key, _value]) => {
            acc2[key] = parseFontFamily(type, key)
            return acc2
        }, {} as FontFamilyDefinition)

        return acc
    }, init)
}

/**
 * Calculate line height based on font size and scale/multiplier.
 *
 * @param fontSize - The font size in pixels.
 * @param scale - Either a size in pixels or a relative multiplier for line height, default is 1.5.
 * @returns - Returns object defining 'fontSize' and 'lineHeight'.
 *      For web, both values are returned as a string, otherwise as numbers.
 */
export function resolveSizeProps<T extends number>(size: T, scale: number = 1.5) {
    let lineHeight: number = scale > size ? scale : size * scale
    const fontSize = `${normalizeSize(size)}rem` as const

    lineHeight /= size
    if (isDecimal(lineHeight)) {
        const valueStr = lineHeight.toString()
        const decimalCount = valueStr.length - valueStr.indexOf('.') - 1
        const precision = decimalCount > 4 ? 4 : decimalCount
        return {
            fontSize,
            lineHeight: lineHeight.toFixed(precision),
        }
    }

    return {
        fontSize,
        lineHeight: lineHeight.toString(),
    }
}
