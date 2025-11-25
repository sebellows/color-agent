import { ColorValue, ViewStyle } from 'react-native'

import { assertUnreachable, getKeys } from '@coloragent/utils'
import ColorIO, { ColorTypes } from 'colorjs.io'
import { isError, isPlainObject, partial, upperFirst } from 'es-toolkit'
import { get, isNumber } from 'es-toolkit/compat'

import {
    BreakpointStyleProp,
    RingOffsetStyleProps,
    StylePropValue,
    ThemeItemVariant,
} from '../components/ui/style.types'
import { $Unistyle } from '../lib/unistyles/stylesheet'
import { Theme } from '../theme/theme'
import { UnistylesTheme } from '../theme/theme.types'
import { ActionState, KeyPathOf } from '../types/common'
import { getEntries } from '../utils/get-entries'
import { normalizeAlpha } from './color-palette/color.utils'
import type { ThemeColorScheme } from './color-palette/types'
import { breakpoints, BreakpointToken } from './design-tokens/breakpoints'
import {
    colors,
    ColorSchemeToken,
    ColorToken,
    type ColorVariant,
} from './design-tokens/colors.native'
import { radii, RadiiToken } from './design-tokens/radii'
import { boxShadows, ShadowToken } from './design-tokens/shadows'
import { sizes, SizeToken } from './design-tokens/sizes'
import { NegativeSpacingToken, SpacingToken } from './design-tokens/spacing'
import { TypographyToken } from './design-tokens/typography-token'
import { typography as typographyTokens } from './design-tokens/typography.native'
import { TypographyDefinition } from './design-tokens/utils'
import { ZIndicesToken } from './design-tokens/z-indices'

const breakpointKeys = getKeys(breakpoints)

function parseBreakpointValues<
    Value,
    StyleKeys extends $Unistyle.StyleKey,
    Result = $Unistyle.Values[StyleKeys], // extends any = Value,
    BpObj = Value extends infer BP extends BreakpointStyleProp<any> ? BP : Value,
>(
    obj: BpObj,

    fn: (...args: any[]) => Result,
    ...args: any[]
) {
    if (!isBreakpointValue(obj)) {
        return fn(obj, ...args)
    }
    return getEntries(obj).reduce((acc, [bp, val]) => {
        acc[bp] = fn(val, ...args)
        return acc
    }, {} as Result)
}

// function resolveBreakpointThemeValue<
//     Key extends ThemeKey,
//     Value extends BreakpointStyleProp<ThemeConfigKey<Key>>,
// >(
//     theme: Theme,
//     value: Value,
//     parseFn: <TKey extends ThemeConfigKey<Key>>(
//         theme: Theme,
//         val: TKey,
//         ..._args: any[]
//     ) => Theme[Key][TKey],
// ) {
//     return getEntries(value).reduce(
//         (acc, [bp, v]) => {
//             if (typeof bp === 'string') {
//                 acc[bp] = parseFn(theme, v)
//             }
//             return acc
//         },
//         {} as { [K in keyof Value]: ValueOf<Theme[Key]> },
//     )
// }

export function resolveComponentColorScheme<T>(
    scheme: ThemeColorScheme,
    match: Record<ThemeColorScheme, T>,
): T {
    switch (scheme) {
        case 'accent':
            return match.accent
        case 'default':
            return match.default
        case 'critical':
            return match.critical
        case 'neutral':
            return match.neutral
        case 'positive':
            return match.positive
        case 'primary':
            return match.primary
        case 'warning':
            return match.warning
        default:
            if (scheme in match) {
                return match[scheme as keyof typeof match]
            }

            return assertUnreachable(scheme) as never
    }
}

export function resolveTextColor(scheme: ThemeColorScheme, state: ActionState = 'default') {
    return resolveComponentColorScheme(scheme, {
        accent: state === 'disabled' ? 'accent.fgMuted' : 'accent.fg',
        critical: state === 'disabled' ? 'critical.fgMuted' : 'critical.fg',
        default: state === 'disabled' ? 'fgMuted' : 'fg',
        neutral: state === 'disabled' ? 'neutral.fgMuted' : 'neutral.fg',
        positive: state === 'disabled' ? 'positive.fgMuted' : 'positive.fg',
        primary: state === 'disabled' ? 'primary.fgMuted' : 'primary.fg',
        warning: state === 'disabled' ? 'warning.fgMuted' : 'warning.fg',
    })
}

const colorVariantNames: ColorVariant[] = Object.keys(colors).filter(
    key => !['light', 'dark'].includes(key),
) as ColorVariant[]

export function isColorScheme(
    token: string | ColorVariant | KeyPathOf<typeof colors>,
): token is ColorVariant {
    return colorVariantNames.includes(token as ColorVariant)
}

export function getColorSchemeProp(dark: boolean, prop: ColorSchemeToken) {
    return (dark ? colors.dark : colors.light)[prop]
}

export function getColorVariants(theme: Theme) {
    try {
        return Object.fromEntries(
            getEntries(theme.colors)
                .filter(entry => isColorScheme(entry[0]))
                .map(([key, _value]) => {
                    const color = get(theme.colors, key) as string
                    return [key, { color }]
                }),
        )
    } catch (err) {
        const msg = isError(err) ? err.message : ''
        throw new Error("There was an error parsing the theme's color variants. " + msg)
    }
}

export function getColorSchemeVariant(token: string | ColorVariant | KeyPathOf<typeof colors>) {
    if (isColorScheme(token)) {
        return get(colors, token)
    }
    throw new Error(`Color scheme "${token}" is not a valid color scheme.`)
}

export function setColorAlpha(color: ColorTypes, alpha?: number) {
    const c = new ColorIO(color)
    const coords = c.coords
    const cs = c.space
    return new ColorIO(cs, coords, normalizeAlpha(alpha)).toString()
}

type BreakpointValues<V> = { [Key in BreakpointToken]: V }
type BreakpointStyleValues<StyleKey extends $Unistyle.StyleKey | $Unistyle.NestedKey> = {
    [Key in BreakpointToken]: StyleKey extends $Unistyle.StyleKey ? $Unistyle.Styles[StyleKey]
    : StyleKey extends $Unistyle.NestedKey ? $Unistyle.NestedStyles[StyleKey]
    : never
}

export function isBreakpointValue<V = any>(value: unknown): value is BreakpointValues<V> {
    return (
        isPlainObject(value) &&
        getKeys(value).every(key => breakpointKeys.includes(key as BreakpointToken))
    )
}

function _getColor(color: string, alpha?: number) {
    // const colorValue = color as Extract<typeof color, string>

    // let c = get(theme.colors, colorValue)
    if (isNumber(alpha)) {
        return setColorAlpha(color, alpha)
    }

    // if (c) return c

    return new ColorIO(color).toString()
}
export function getColor(
    theme: Theme,
    color: string | ColorToken | ThemeItemVariant<ColorToken>,
    alpha?: number,
): StyleValues<'color'>['color'] {
    return parseBreakpointValues(color, c => _getColor(get(theme.colors, c, c), alpha))
    // if (isBreakpointValue(color)) {
    //     return getEntries(color).reduce((acc, [bp, c]) => {
    //         if (!isPlainObject(c)) {
    //             Object.assign(acc, { [bp]: getColor(theme, c, alpha) })
    //         }
    //         return acc
    //     }, {} as BreakpointStyleProp<'color'>)
    // }

    // const colorValue = color as Extract<typeof color, string>

    // let c = get(theme.colors, colorValue)
    // if (isNumber(alpha)) {
    //     return setColorAlpha(c ?? color, alpha)
    // }

    // if (c) return c

    // return new ColorIO(colorValue).toString()
}

// type TypographyVariant = ThemeConfigVariant<'typography', TypographyToken>

export const getTypographyVariants = (theme: UnistylesTheme) => {
    return getKeys(theme.typography).reduce(
        (acc, key) => {
            Object.assign(acc, { [key]: typography(theme, key as TypographyToken) })
            return acc
        },
        {} as Record<TypographyToken, TypographyDefinition>,
    )
}

export const typography = (theme: UnistylesTheme, variant: TypographyToken) => {
    if (isPlainObject(variant)) {
        return getEntries(variant).reduce(
            (acc, [bp, token]) => {
                if (!token) {
                    // This condition exists only for avoiding TypeScript gymnastics
                    return acc
                }
                acc[bp] = {
                    fontFamily: theme.fonts[token],
                    fontSize: theme.fontSizes[token],
                    fontWeight: theme.fontWeights[token],
                    letterSpacing: theme.letterSpacings[token],
                    lineHeight: theme.lineHeights[token],
                    textTransform: typographyTokens[token]
                        .textTransform as TypographyDefinition['textTransform'],
                }
                return acc
            },
            {} as Record<BreakpointToken, TypographyDefinition>,
        )
    }

    const { textTransform } = typographyTokens[variant]

    return {
        fontFamily: theme.fonts[variant],
        fontSize: theme.fontSizes[variant],
        fontWeight: theme.fontWeights[variant],
        letterSpacing: theme.letterSpacings[variant],
        lineHeight: theme.lineHeights[variant],
        textTransform,
    } as TypographyDefinition
}

export function getShadow(theme: UnistylesTheme, variant: ThemeItemVariant<ShadowToken>) {
    if (isBreakpointValue(variant)) {
        return getEntries(variant).reduce((acc, [bp, shadow]) => {
            acc[bp] = theme.boxShadows[shadow]
            return acc
        }, {} as BreakpointStyleValues<'boxShadow'>)
    }
}

// type RingOffsetWidth = 0 | 1 | 2 | 4 | 8
// type RingOffsetColor = ThemeColorScheme | 'default'

const DEFAULT_RING_OPACITY = 1 as const
const DEFAULT_RING_SHADOW = `0 1px 2px 0 ${new ColorIO('oklch', [0, 0, 0], 0.05)}` as const

const defaultRingOffsetProps: RingOffsetStyleProps = {
    ringOffsetWidth: 2,
    ringOffsetColor: 'primary.focusRing',
    ringOpacity: 0.8,
}

export function getRingOffsetStyles(
    theme: Theme,
    ringOffsetProps: RingOffsetStyleProps = {},
    initialRingOffsetProps: RingOffsetStyleProps = {},
) {
    const initialProps = Object.assign(
        defaultRingOffsetProps,
        initialRingOffsetProps,
    ) as Required<RingOffsetStyleProps>

    const initialOffsetColor = getColor(
        theme,
        initialProps.ringOffsetColor,
        initialProps.ringOpacity,
    ) as string

    const { ringOffsetColor, ringOffsetWidth, ringOpacity } = {
        ...initialProps,
        ...ringOffsetProps,
    }
    const colorKey = ringOffsetColor
    const alpha = ringOpacity < DEFAULT_RING_OPACITY ? ringOpacity : DEFAULT_RING_OPACITY
    const offsetColor = getColor(theme, colorKey, alpha) as string

    return {
        boxShadow: `0 0 0 ${initialProps.ringOffsetWidth}px ${initialOffsetColor}, ${DEFAULT_RING_SHADOW}`,
        _focus: {
            outline: 'none',
            _visible: {
                boxShadow: `0 0 0 ${ringOffsetWidth}px ${offsetColor}, ${DEFAULT_RING_SHADOW}`,
            },
        },
    }
}

type Direction = 'top' | 'right' | 'bottom' | 'left'

export function getPosition(
    theme: UnistylesTheme,
    variant: SpacingToken | NegativeSpacingToken,
    ...dirs: Direction[]
) {
    const space = theme.space[variant]
    const value = variant.startsWith('-') ? -space : space

    if (dirs.length === 1) {
        return { [dirs[0]]: value }
    }

    return dirs.reduce(
        (acc, dir) => {
            acc[dir] = value
            return acc
        },
        {} as Record<Direction, number | 'auto'>,
    )
}

type SpacingDirection = 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end'

export function getSpaceValue(theme: UnistylesTheme, variant: SpacingToken | NegativeSpacingToken) {
    const space = theme.space[variant]
    return variant.startsWith('-') ? -space : space
}

export function getMargin(
    theme: UnistylesTheme,
    variant: SpacingToken | NegativeSpacingToken,
    ...dirs: SpacingDirection[]
) {
    const space = theme.space[variant]
    const value = variant.startsWith('-') ? -space : space

    if (!dirs.length) {
        return { margin: value }
    }

    if (dirs.length === 1) {
        return { [`margin${upperFirst(dirs[0])}`]: value }
    }

    return dirs.reduce(
        (acc, dir) => {
            acc[`margin${upperFirst(dir)}`] = value
            return acc
        },
        {} as Record<Direction, number>,
    )
}

export function getPadding(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): StyleValues<'padding'> {
    return {
        padding: parseBreakpointValues<ThemeItemVariant<SpacingToken>, 'padding'>(
            variant,
            v => theme.space[v],
        ),
    }
}

export function getPaddingLeft(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingLeft'> {
    return {
        paddingLeft: parseBreakpointValues<ThemeItemVariant<SpacingToken>, 'paddingLeft'>(
            variant,
            v => theme.space[v],
        ),
    }
}

export function getPaddingRight(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingRight'> {
    return {
        paddingRight: parseBreakpointValues<ThemeItemVariant<SpacingToken>, 'paddingRight'>(
            variant,
            v => theme.space[v],
        ),
    }
}

export function getPaddingTop(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingTop'> {
    return {
        paddingTop: parseBreakpointValues<ThemeItemVariant<SpacingToken>, 'paddingTop'>(
            variant,
            v => theme.space[v],
        ),
    }
}

export function getPaddingBottom(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingBottom'> {
    return {
        paddingBottom: parseBreakpointValues<ThemeItemVariant<SpacingToken>, 'paddingBottom'>(
            variant,
            v => theme.space[v],
        ),
    }
}

export function getPaddingStart(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingStart'> {
    return {
        paddingStart: parseBreakpointValues<ThemeItemVariant<SpacingToken>, 'paddingStart'>(
            variant,
            v => theme.space[v],
        ),
    }
}

export function getPaddingEnd(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingEnd'> {
    return {
        paddingEnd: parseBreakpointValues<ThemeItemVariant<SpacingToken>, 'paddingEnd'>(
            variant,
            v => theme.space[v],
        ),
    }
}

export function getPaddingX(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingLeft' | 'paddingRight'> {
    const value = parseBreakpointValues<
        ThemeItemVariant<SpacingToken>,
        'paddingLeft' | 'paddingRight'
    >(variant, v => theme.space[v])
    return { paddingLeft: value, paddingRight: value }
}

export function getPaddingY(
    theme: UnistylesTheme,
    variant: ThemeItemVariant<SpacingToken>,
): Pick<$Unistyle.Values, 'paddingTop' | 'paddingBottom'> {
    const value = parseBreakpointValues<
        ThemeItemVariant<SpacingToken>,
        'paddingTop' | 'paddingBottom'
    >(variant, v => theme.space[v])
    return { paddingTop: value, paddingBottom: value }
}

export function getBorderRadius(
    theme: Theme,
    variant: number | RadiiToken,
    dir?:
        | 'top'
        | 'right'
        | 'bottom'
        | 'left'
        | 'topLeft'
        | 'topRight'
        | 'bottomRight'
        | 'bottomLeft'
        | 'startEnd'
        | 'startStart'
        | 'endEnd'
        | 'endStart',
) {
    if (!(variant in theme.radii) && typeof variant !== 'number') return undefined

    const radius = typeof variant === 'number' ? variant : theme.radii[variant]

    if (dir) {
        switch (dir) {
            case 'top':
                return {
                    borderTopLeftRadius: radius,
                    borderTopRightRadius: radius,
                }
            case 'right':
                return {
                    borderTopRightRadius: radius,
                    borderBottomRightRadius: radius,
                }
            case 'bottom':
                return {
                    borderBottomLeftRadius: radius,
                    borderBottomRightRadius: radius,
                }
            case 'left':
                return {
                    borderTopLeftRadius: radius,
                    borderBottomLeftRadius: radius,
                }
            case 'topLeft':
                return { borderTopLeftRadius: radius }
            case 'topRight':
                return { borderTopRightRadius: radius }
            case 'bottomRight':
                return { borderBottomRightRadius: radius }
            case 'bottomLeft':
                return { borderBottomLeftRadius: radius }
            case 'endEnd':
                return { borderEndEndRadius: radius }
            case 'endStart':
                return { borderEndStartRadius: radius }
            case 'startEnd':
                return { borderStartEndRadius: radius }
            case 'startStart':
                return { borderStartStartRadius: radius }
        }
    }

    return { borderRadius: radius }
}

type BoxShadows = { [K in ShadowToken]: { boxShadow: string } }
export function getBoxShadows(definitions = boxShadows) {
    const shadows = {} as BoxShadows

    return getEntries(definitions).reduce((acc, [key, value]) => {
        acc[key] = { boxShadow: value }
        return acc
    }, shadows)
}

export function getBoxShadow(theme: Theme, shadow: ShadowToken) {
    if (!(shadow in theme.boxShadows)) {
        throw new Error(`Parameter of "${shadow}" is not a valid configured boxshadow.`)
    }

    return { boxShadow: theme.boxShadows[shadow] }
}

export function getBorderRadii() {
    return getEntries(radii).reduce(
        (acc, [key, radius]) => {
            acc[key as RadiiToken] = { borderRadius: radius }
            return acc
        },
        {} as { [K in RadiiToken]: { borderRadius: (typeof radii)[K] } },
    )
}

export function getSizeVariants() {
    return getEntries(sizes).reduce(
        (acc, [key, value]) => {
            acc[key] = { width: value, height: value }
            return acc
        },
        {} as { [K in SizeToken]: { width: number; height: number } },
    )
}

const EMPTY_STYLE_OBJECT = {}
type EmptyStyleObject = typeof EMPTY_STYLE_OBJECT
export function isEmptyStyle(obj: unknown): obj is EmptyStyleObject {
    return isPlainObject(obj) && Object.keys(obj).length === 0
}

type StyleValues<Keys extends $Unistyle.StyleKey> = Pick<$Unistyle.Values, Keys>

let sizeVariants = getSizeVariants()
export function getSizeVariant(
    variant: ThemeItemVariant<SizeToken>,
    theme?: Theme,
): StyleValues<'width' | 'height'> {
    // let variants = theme?.sizes ?? sizeVariants

    const value = parseBreakpointValues<ThemeItemVariant<SizeToken>, 'width' | 'height'>(
        variant,
        v => (theme?.sizes ?? sizeVariants)[v.toString()],
    )
    return { width: value, height: value }

    // if (!(size in variants) && !isNumber(size)) {
    //     throw new Error(`Size "${size}" is not a valid configured size.`)
    // }

    // return isSizeToken(size) ? variants[size] : { width: size, height: size }
}

type RNBorderColorProps = Pick<
    ViewStyle,
    | 'borderBlockColor'
    | 'borderBlockEndColor'
    | 'borderBlockStartColor'
    | 'borderBottomColor'
    | 'borderEndColor'
    | 'borderLeftColor'
    | 'borderRightColor'
    | 'borderStartColor'
    | 'borderTopColor'
>

const rnBorderDirs = [
    'block',
    'blockEnd',
    'blockStart',
    'bottom',
    'end',
    'left',
    'right',
    'start',
    'top',
] as const
type RNBorderDir = (typeof rnBorderDirs)[number]

export type BorderOptions = {
    direction?: RNBorderDir
    borderStyle?: ViewStyle['borderStyle']
    borderColor?: ViewStyle['borderColor'] | ColorToken
}

type BorderWidthStyleKey =
    | 'borderWidth'
    | 'borderBottomWidth'
    | 'borderEndWidth'
    | 'borderLeftWidth'
    | 'borderRightWidth'
    | 'borderStartWidth'
    | 'borderTopWidth'

type BorderStyles = Pick<ViewStyle, 'borderStyle' | 'borderColor'> &
    RNBorderColorProps & { [K in BorderWidthStyleKey]: $Unistyle.Values[K] }

export function getBorder(
    theme: Theme,
    border: boolean | StylePropValue<'borderWidth'> = true,
    options: BorderOptions = {},
): StyleValues<keyof BorderStyles> {
    const borderStyles = {} as BorderStyles

    let borderWidth: $Unistyle.Values['borderWidth'] = 0
    if (typeof border === 'boolean' && border === true) {
        borderWidth = 1
    } else if (isBreakpointValue(border)) {
        const partialFn = partial(getBorder, theme)
        borderWidth = parseBreakpointValues<StylePropValue<'borderWidth'>, 'borderWidth'>(
            border,
            partialFn,
            options,
        )
    }

    let { borderColor: borderColorKey = 'line2', borderStyle, direction } = options

    if (borderStyle) borderStyles.borderStyle = borderStyle

    const borderColor = get(theme.colors, borderColorKey)

    if (direction) {
        switch (direction) {
            case 'block':
                borderStyles.borderBlockColor = borderColor
                borderStyles.borderWidth = borderWidth
                break
            case 'blockEnd':
                borderStyles.borderBlockEndColor = borderColor
                borderStyles.borderWidth = borderWidth
                break
            case 'blockStart':
                borderStyles.borderBlockStartColor = borderColor
                borderStyles.borderWidth = borderWidth
                break
            case 'bottom':
                borderStyles.borderBottomColor = borderColor
                borderStyles.borderBottomWidth = borderWidth
                break
            case 'end':
                borderStyles.borderEndColor = borderColor
                borderStyles.borderEndWidth = borderWidth
                break
            case 'left':
                borderStyles.borderLeftColor = borderColor
                borderStyles.borderLeftWidth = borderWidth
                break
            case 'right':
                borderStyles.borderRightColor = borderColor
                borderStyles.borderRightWidth = borderWidth
                break
            case 'start':
                borderStyles.borderStartColor = borderColor
                borderStyles.borderStartWidth = borderWidth
                break
            case 'top':
                borderStyles.borderTopColor = borderColor
                borderStyles.borderTopWidth = borderWidth
                break
            default:
                borderStyles.borderColor = borderColor
                borderStyles.borderWidth = borderWidth
        }
    }

    return borderStyles
}

export function getZIndex<Theme extends UnistylesTheme>(
    theme: Theme,
    variant: ThemeItemVariant<ZIndicesToken>,
): StyleValues<'zIndex'> {
    if (variant === undefined) return { zIndex: undefined }

    return {
        zIndex: parseBreakpointValues<ThemeItemVariant<ZIndicesToken>, 'zIndex'>(
            variant,
            zIndex => theme.zIndices[zIndex],
        ),
    }
}
