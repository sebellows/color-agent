import { getEntries, isDecimal } from '@coloragent/utils'
import { Config } from '@ui/config'

import {
    FontConfigType,
    FontFamily,
    FONTS_CONFIG,
    FontWeightKey,
    getFontFamilyOption,
    normalizeSize,
} from '../utils'

const { BASE_LINE_HEIGHT } = Config.get('theme')

type FontFamilyDefinition<
    K extends FontConfigType = FontConfigType,
    FW extends FontWeightKey<K> = FontWeightKey<K>,
> = Record<
    FW,
    {
        fontFamily: FontFamily<K, FW>
        fontWeight: 'normal'
    }
>

export function resolveFontFamilyProps() {
    const init = {} as Record<FontConfigType, FontFamilyDefinition>

    return FONTS_CONFIG.reduce((acc, config) => {
        const { type, families } = config
        acc[type] = getEntries(families).reduce((acc2, [key, _value]) => {
            const { fontFamily } = getFontFamilyOption(type, key)
            acc2[key] = {
                fontFamily,
                fontWeight: 'normal',
            }
            return acc2
        }, {} as FontFamilyDefinition)

        return acc
    }, init)
}

/**
 * Calculate line height based on font size and scale/multiplier.
 *
 * @param fontSize - The font size in pixels.
 * @param scale - Either a size in pixels or a relative multiplier for line height, default is 1.42857.
 * @returns - Returns object defining 'fontSize' and 'lineHeight'.
 *      For web, both values are returned as a string, otherwise as numbers.
 */
export function resolveSizeProps<T extends number>(size: T, scale: number = BASE_LINE_HEIGHT) {
    let lineHeight: number = scale > size ? scale : size * scale
    const fontSize = Number(normalizeSize(size))

    if (isDecimal(lineHeight)) {
        // Using non-integer pixel values for lineHeight may lead to blurry elements
        // due to the way React Native handles pixel rounding, so we round it
        // to the nearest whole integer to make sure it renders crisply.
        lineHeight = Math.round(lineHeight)
    }

    return { fontSize, lineHeight }
}
