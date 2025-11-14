import { TextStyle } from 'react-native'

import { isDecimal } from '@coloragent/utils'

import { getEntries } from '../../utils/get-entries'
import { type TypographyToken } from './typography-token'

export type TypographyDefinition = NonNullable<
    Pick<
        TextStyle,
        'fontFamily' | 'fontWeight' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform'
    >
>

export type TypographyDefinitions = Record<TypographyToken, TypographyDefinition>

function _textStyleGetter<Prop extends keyof TypographyDefinition>(property: Prop) {
    return <T extends TypographyDefinitions>(t: T) => {
        return getEntries(t).reduce(
            (acc, [key, value]) => {
                const propValue = value[property]
                acc[key] = propValue
                return acc
            },
            {} as { [K in TypographyToken]: T[K][Prop] },
        )
    }
}

export const getFonts = _textStyleGetter('fontFamily')
export const getFontSizes = _textStyleGetter('fontSize')
export const getFontWeights = _textStyleGetter('fontWeight')
export const getLetterSpacings = _textStyleGetter('letterSpacing')

export function getLineHeights<T extends TypographyDefinitions>(t: T) {
    return getEntries(t).reduce(
        (acc, [key, value]) => {
            const { fontSize, lineHeight } = value
            if (!lineHeight || !fontSize) return acc
            acc[key] = lineHeight * fontSize
            return acc
        },
        {} as { [K in TypographyToken]: T[K]['lineHeight'] },
    )
}

/**************************************************
 *
 * Typography - Types & Constants
 *
 **************************************************/

const FONT_WEIGHT_MAP = {
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
} as const
type FontWeightMap = typeof FONT_WEIGHT_MAP
export type FontWeightMapKey = keyof FontWeightMap
export type FontWeightName<K extends FontWeightMapKey> = FontWeightMap[K]

export const FONTS_CONFIG = [
    {
        type: 'code',
        fallback: 'monospace',
        families: {
            400: 'SpaceMono-Regular' as const,
            700: 'SpaceMono-Bold' as const,
        },
    },
    {
        type: 'body',
        fallback: 'sans-serif',
        families: {
            400: 'NotoSans-Regular' as const,
            500: 'NotoSans-Medium' as const,
            600: 'NotoSans-SemiBold' as const,
            700: 'NotoSans-Bold' as const,
        },
    },
    {
        type: 'display',
        fallback: 'sans-serif',
        families: {
            400: 'SpaceGrotesk-Regular' as const,
            500: 'SpaceGrotesk-Medium' as const,
            600: 'SpaceGrotesk-SemiBold' as const,
            700: 'SpaceGrotesk-Bold' as const,
        },
    },
] as const

type FontsConfig = typeof FONTS_CONFIG
type FontConfigObject = FontsConfig[number]
export type FontConfigType = FontConfigObject['type']
export type FontConfig<K extends FontConfigType = FontConfigType> = Extract<
    FontsConfig[number],
    { type: K }
>
export type FontConfigFamilies<K extends FontConfigType> = FontConfig<K>['families']
type FontFamilyWeightKey<K extends FontConfigType> = keyof FontConfigFamilies<K>
// type _FontFamily = ValueOf<FontConfigFamilies<FontConfigType>, FontFamilyWeightKey<FontConfigType>>
// export type FontFamilyWeightKey<K extends FontConfigType> = FontConfigFamilyKey<K>

export type FontWeightKey<K extends FontConfigType | undefined = undefined> =
    K extends FontConfigType ? FontFamilyWeightKey<K> : FontWeightMapKey

export type FontFamily<
    K extends FontConfigType,
    W extends FontWeightKey<K>,
    FC = FontConfigFamilies<K>,
> = W extends keyof FC ? FC[W] : never

export const FONT_TYPES: FontConfigType[] = FONTS_CONFIG.map(fam => fam.type)
export type FontType = (typeof FONT_TYPES)[number]

export function normalizeSize<T extends number>(size: T, maxDecimalPlaces: number = 4): string {
    if (isDecimal(size)) {
        const valueStr = size.toString()
        const decimalCount = valueStr.length - valueStr.indexOf('.') - 1
        const precision = decimalCount > maxDecimalPlaces ? maxDecimalPlaces : decimalCount
        return size.toFixed(precision)
    }
    return size.toString()
}

export function getFontFamilyDefinition<K extends FontConfigType>(fontType: K): FontConfig<K> {
    return FONTS_CONFIG.find(family => family.type === fontType)! as FontConfig<K>
}

export function getFontFamilyOption<
    K extends FontConfigType,
    FW extends FontWeightKey<K> = FontWeightKey<K>,
>(fontType: K, fontWeight: FW) {
    const definition = getFontFamilyDefinition(fontType)
    const families = definition.families
    const weight = Object.keys(families).find(w => w === String(fontWeight))

    if (!weight) {
        throw new Error(
            `Font weight "${fontWeight.toString()}" is not available for font type "${fontType}". Available weights are: ${Object.keys(
                families,
            ).join(', ')}`,
        )
    }
    type FamilyKey = keyof typeof families
    let weightKey = (isNaN(Number(fontWeight)) ? fontWeight : Number(fontWeight)) as FamilyKey

    if (!weightKey) weightKey = 400

    const fontFamily = families[weightKey]

    if (!fontFamily) {
        throw new Error(
            `Font weight "${fontWeight.toString()}" is not available for font type "${fontType}". Available weights are: ${Object.keys(
                families,
            ).join(', ')}`,
        )
    }

    return { fontFamily, fallback: definition.fallback, fontWeight: weightKey }
}

export function getFontWeightName<K extends FontWeightKey>(fontWeight: K): FontWeightName<K> {
    if (!(fontWeight in FONT_WEIGHT_MAP)) {
        throw new Error(
            `Font weight "${fontWeight.toString()}" is not supported. Supported weights are: ${Object.keys(
                FONT_WEIGHT_MAP,
            ).join(', ')}`,
        )
    }
    return FONT_WEIGHT_MAP[fontWeight]
}

/**************************************************
 *
 * Box Shadow - Types & Utility Functions
 *
 **************************************************/

export type ShadowDefinition = {
    boxShadow: string
    offset: { x: number; y: number }
    radius: number
    spread: number
    color: string // { hex: string; hsla: string }
    inset?: boolean
}

type ShadowValue = {
    color: string
    offsetX: number
    offsetY: number
    blurRadius: number
    spreadDistance: number
    inset?: boolean
}

/**
 * NOTE: Assigning the React Native type BoxShadowValue as the returned object,
 * while true, makes Unistyles deeply unhappy.
 */
export function getShadowStyles<T extends Record<string, string>>(definitions: T) {
    const shadows = {} as { [K in keyof T]: string }
    const entries = Object.entries(definitions) as [keyof T, string][]

    return entries.reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
    }, shadows)
}

/**
 * NOTE: Assigning the React Native type BoxShadowValue as the returned object,
 * while true, makes Unistyles deeply unhappy.
 */
export function getShadows<T extends Record<string, ShadowDefinition>>(definitions: T) {
    const shadows = {} as { [K in keyof T]: ShadowValue }
    const entries = Object.entries(definitions) as [keyof T, ShadowDefinition][]

    return entries.reduce((acc, [key, value]) => {
        acc[key] = {
            color: value.color,
            offsetX: value.offset.x,
            offsetY: value.offset.y,
            blurRadius: value.radius,
            spreadDistance: value.spread,
            inset: value.inset,
        } // as BoxShadowValue
        return acc
    }, shadows)
}
