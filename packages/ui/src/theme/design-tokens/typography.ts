import { Platform, TextStyle } from 'react-native'

import { isDecimal } from '@coloragent/utils'
import { PascalCase, ValueOf } from 'type-fest'

import { isWeb } from '../../utils/common'

type FontWeights = {
    normal: 'Regular'
    bold: 'Bold'
    100: 'Thin'
    200: 'ExtraLight'
    300: 'Light'
    400: 'Regular'
    500: 'Medium'
    600: 'SemiBold'
    700: 'Bold'
    800: 'ExtraBold'
    900: 'Black'
}

const FONT_WEIGHT_MAP: FontWeights = {
    normal: 'Regular',
    bold: 'Bold',
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black',
}

type RNFontWeightKey = keyof FontWeights
type FontWeightName<K extends keyof FontWeights> = Pick<FontWeights, K>[K]
type NormalFontWeight = keyof Pick<FontWeights, 'normal' | 400>

type FontFamily =
    | { type: 'code'; fontFamily: 'Space Mono'; fallback: 'monospace' }
    | { type: 'body'; fontFamily: 'Noto Sans'; fallback: 'sans-serif' }
    | { type: 'display'; fontFamily: 'Space Grotesk'; fallback: 'sans-serif' }

const FONT_FAMILIES = [
    { type: 'code', fontFamily: 'Space Mono', fallback: 'monospace' } as Extract<
        FontFamily,
        { type: 'code' }
    >,
    { type: 'body', fontFamily: 'Noto Sans', fallback: 'sans-serif' } as Extract<
        FontFamily,
        { type: 'body' }
    >,
    { type: 'display', fontFamily: 'Space Grotesk', fallback: 'sans-serif' } as Extract<
        FontFamily,
        { type: 'display' }
    >,
]

type ThemeFontFamilyType = FontFamily['type']
type ThemeFontFamily = FontFamily['fontFamily']
type FallbackFontFamily = FontFamily['fallback']

// const themeFontFamilyOptions: {
//     [Key in ThemeFontFamilyType]: [ThemeFontFamily, FallbackFontFamily]
// } = {
//     code: ['Space Mono', 'monospace'],
//     body: ['Noto Sans', 'sans-serif'],
//     display: ['Space Grotesk', 'sans-serif'],
// }

function parseFontFamily<FT extends FontFamily['type'], FW extends RNFontWeightKey>(
    fontType: FT,
    fontWeight: FW,
) {
    const _familyValues = FONT_FAMILIES.find(family => family.type === fontType)!
    const { fontFamily, fallback } = _familyValues
    const fontWeightName = FONT_WEIGHT_MAP[fontWeight]
    if (isWeb) {
        // type WebFontFamily = `'${typeof fontFamily}', ${typeof fallback}`
        return `'${fontFamily}', ${fallback}` as const
    }

    type MobileFontFamily = `${PascalCase<typeof fontFamily>}-${typeof fontWeightName}`
    return [fontFamily.split(' ').join(''), fontWeightName].join('-') as MobileFontFamily
}

function isNormalFontWeight(value: RNFontWeightKey): value is NormalFontWeight {
    return value === 'normal' || value === 400
}

function parseThemeFontProps<
    FT extends ThemeFontFamilyType = ThemeFontFamilyType,
    FW extends RNFontWeightKey = RNFontWeightKey,
>(fontType: FT, fontWeightKey: FW) {
    const fontFamily = parseFontFamily(fontType, fontWeightKey)
    type WeightSuffix = FontWeightName<FW> // ValueOf<FontWeights, FW>
    const fontFamilyKey =
        isNormalFontWeight(fontWeightKey) ? fontType : (
            (`${fontType}${FONT_WEIGHT_MAP[fontWeightKey]}` as `${FT}${WeightSuffix}`)
        )

    return {
        [fontFamilyKey]: {
            fontFamily,
            fontWeight: isWeb ? fontWeightKey : 'normal',
        },
    }
}

const fontMap = {
    ...parseThemeFontProps('code', 'normal'),
    ...parseThemeFontProps('body', 'normal'),
    ...parseThemeFontProps('body', 500),
    ...parseThemeFontProps('body', 600),
    ...parseThemeFontProps('body', 700),
    ...parseThemeFontProps('display', 'normal'),
    ...parseThemeFontProps('display', 500),
    ...parseThemeFontProps('display', 600),
    ...parseThemeFontProps('display', 700),
    // },
    // web: {
    //     code: "'Space Mono', monospace",
    //     body: "'Noto Sans', sans-serif",
    //     bodyMedium: "'Noto Sans', sans-serif",
    //     bodySemiBold: "'Noto Sans', sans-serif",
    //     bodyBold: "'Noto Sans', sans-serif",
    //     display: "'Space Grotesk', sans-serif",
    //     displayMedium: "'Space Grotesk', sans-serif",
    //     displaySemibold: "'Space Grotesk', sans-serif",
    //     displayBold: "'Space Grotesk', sans-serif",
    // },
    // mobile: {
    //     code: 'SpaceMono-Regular',
    //     body: 'Noto-Regular',
    //     bodyMedium: 'Noto-Medium',
    //     bodySemiBold: 'Noto-SemiBold',
    //     bodyBold: 'Noto-Bold',
    //     display: 'SpaceGrotesk-Regular',
    //     displayMedium: 'SpaceGrotesk-Medium',
    //     displaySemibold: 'SpaceGrotesk-SemiBold',
    //     displayBold: 'SpaceGrotesk-Bold',
    // },
}

function getFontFamily(family: string) {
    if (isWeb) {
        return fontMap.web[family as keyof typeof fontMap.web]
    }

    return fontMap.mobile[family as keyof typeof fontMap.mobile]
}

function normalizeSize<T extends number>(size: T, maxDecimalPlaces: number = 4): string {
    if (isDecimal(size)) {
        const valueStr = size.toString()
        const decimalCount = valueStr.length - valueStr.indexOf('.') - 1
        const precision = decimalCount > maxDecimalPlaces ? maxDecimalPlaces : decimalCount
        return size.toFixed(precision)
    }
    return size.toString()
}

function transformFontSize<T extends number>(fontSize: T) {
    if (isWeb) {
        return `${normalizeSize(fontSize)}rem` as const
    }

    return Number(normalizeSize(fontSize))
}

/**
 * Calculate line height based on font size and scale/multiplier.
 *
 * @param fontSize - The font size in pixels.
 * @param scale - Either a size in pixels or a relative multiplier for line height, default is 1.5.
 * @returns - Returns object defining 'fontSize' and 'lineHeight'.
 *      For web, both values are returned as a string, otherwise as numbers.
 */
function resolveSizeProps<T extends number>(size: T, scale: number = 1.5) {
    let lineHeight: number = scale > size ? scale : size * scale
    const fontSize = transformFontSize(size)

    if (isWeb) {
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

    if (isDecimal(lineHeight)) {
        // Using non-integer pixel values for lineHeight may lead to blurry elements
        // due to the way React Native handles pixel rounding, so we round it
        // to the nearest whole integer to make sure it renders crisply.
        lineHeight = Math.round(lineHeight)
    }

    return { fontSize, lineHeight }
}

function transformWeight<T extends number>(weight: T) {
    return isWeb ? weight : weight.toString()
}

export type TypographyDefinition = NonNullable<
    Pick<TextStyle, 'fontFamily' | 'fontSize' | 'letterSpacing' | 'lineHeight'>
>
// {
//     fontFamily: NonNullable<TextStyle['fontFamily']>
//     fontWeight: NonNullable<TextStyle['fontWeight']>
//     fontSize: NonNullable<TextStyle['fontSize']>
//     textTransform: NonNullable<TextStyle['textTransform']>
//     letterSpacing: NonNullable<TextStyle['letterSpacing']>
//     lineHeight: NonNullable<TextStyle['lineHeight']>
// }

const typography = {
    display01: {
        fontFamily: getFontFamily('displaySemibold'),
        ...resolveSizeProps(64, 1.125),
        letterSpacing: 0.64,
    },
    display02: {
        fontFamily: getFontFamily('displaySemibold'),
        ...resolveSizeProps(56, 1.125),
        letterSpacing: 0.64,
    },
    display03: {
        fontFamily: getFontFamily('displaySemibold'),
        ...resolveSizeProps(1.125),
        letterSpacing: 0.64,
    },
    display04: {
        fontFamily: getFontFamily('displaySemibold'),
        ...resolveSizeProps(36, 1.125),
        letterSpacing: 0.64,
    },
    heading01: {
        fontFamily: getFontFamily('displayBold'),
        ...resolveSizeProps(36, 1.125),
        fontWeight: transformWeight(700),
        letterSpacing: 0.64,
    },
    heading02: {
        fontFamily: getFontFamily('displaySemiBold'),
        ...resolveSizeProps(24, 1.2),
        fontWeight: transformWeight(700),
    },
    heading03: {
        fontFamily: getFontFamily('displaySemiBold'),
        ...resolveSizeProps(20, 1.2),
        fontWeight: transformWeight(600),
    },
    heading04: {
        fontFamily: getFontFamily('displaySemiBold'),
        ...resolveSizeProps(18, 1.2),
        fontWeight: transformWeight(600),
    },
    heading05: {
        fontFamily: getFontFamily('displaySemiBold'),
        ...resolveSizeProps(16),
        fontWeight: transformWeight(600),
    },
    heading06: {
        fontFamily: getFontFamily('displaySemiBold'),
        ...resolveSizeProps(14, 20), // 20px / 14px = 1.42857
        fontWeight: transformWeight(600),
    },
    cardTitle: {
        fontFamily: getFontFamily('displaySemiBold'),
        ...resolveSizeProps(20, 28),
        fontWeight: transformWeight(600),
    },
    body01: {
        fontFamily: getFontFamily('body'),
        ...resolveSizeProps(16),
        fontWeight: transformWeight(400),
    },
    body02: {
        fontFamily: getFontFamily('body'),
        ...resolveSizeProps(14, 20),
        fontWeight: transformWeight(400),
    },
    detail: {
        fontFamily: getFontFamily('body'),
        ...resolveSizeProps(14, 20),
        fontWeight: transformWeight(400),
    },
    label01: {
        fontFamily: getFontFamily('displaySemiBold'),
        ...resolveSizeProps(14, 20),
        fontWeight: transformWeight(400),
    },
    label02: {
        fontFamily: getFontFamily('displayMedium'),
        ...resolveSizeProps(13, 19.5),
        fontWeight: transformWeight(400),
    },
    caption: {
        fontFamily: getFontFamily('bodyMedium'),
        ...resolveSizeProps(12, 16),
        fontWeight: transformWeight(500),
    },
    code: {
        fontFamily: getFontFamily('code'),
        ...resolveSizeProps(13, 18),
        fontWeight: transformWeight(400),
    },
    address: {
        fontFamily: getFontFamily('bodyMedium'),
        ...resolveSizeProps(14, 21),
        fontWeight: transformWeight(500),
    },
}

export type TypographyToken = keyof typeof typography

export default typography
