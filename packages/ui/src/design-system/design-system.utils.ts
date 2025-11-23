import { ColorValue, ViewStyle } from 'react-native'

import { assertUnreachable, getKeys, variadic } from '@coloragent/utils'
import ColorIO, { ColorTypes } from 'colorjs.io'
import { isError, isPlainObject, upperFirst } from 'es-toolkit'
import { get, isNumber } from 'es-toolkit/compat'
import { Get, ValueOf } from 'type-fest'

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
import { boxShadows, ShadowsToken, ShadowToken } from './design-tokens/shadows'
import { isSizeToken, sizes, SizeToken } from './design-tokens/sizes'
import { NegativeSpacingToken, SpacingToken } from './design-tokens/spacing'
import { TypographyToken } from './design-tokens/typography-token'
import { typography as typographyTokens } from './design-tokens/typography.native'
import { TypographyDefinition } from './design-tokens/utils'
import { ZIndicesToken } from './design-tokens/z-indices'

type ThemeConfigObject = Exclude<UnistylesTheme, Function>
type ThemeConfigKey = keyof ThemeConfigObject
type ThemeConfigToken<K extends ThemeConfigKey> = keyof UnistylesTheme[K]

// type ComposedRecord<Key extends PropertyKey, Value = any> = Partial<Record<Key, Value>>
type BreakpointValues<
    ThemeKey extends ThemeConfigKey,
    Token extends keyof UnistylesTheme[ThemeKey] = keyof UnistylesTheme[ThemeKey],
> = {
    [Key in BreakpointToken]: Token
}
type BreakpointTokenMap<
    ThemeKey extends ThemeConfigKey,
    Token extends keyof UnistylesTheme[ThemeKey] = keyof UnistylesTheme[ThemeKey],
> = BreakpointValues<ThemeKey, Token>
// type ThemeConfigVariant<T extends PropertyKey> = T | BreakpointTokenMap<T>

export type WithBreakpoints<
    ThemeKey extends ThemeConfigKey,
    VariantKey extends ThemeConfigToken<ThemeKey>,
    Key extends BreakpointToken = BreakpointToken,
> = { [K in Key]: UnistylesTheme[ThemeKey][VariantKey] }

type ThemeConfigVariant<
    ThemeKey extends ThemeConfigKey,
    Token extends ThemeConfigToken<ThemeKey> = ThemeConfigToken<ThemeKey>,
> = Token | Partial<BreakpointTokenMap<ThemeKey, Token>>

const breakpointKeys = getKeys(breakpoints)
function isBreakpointTokenMap<T extends ThemeConfigKey>(
    props: unknown,
): props is BreakpointTokenMap<T> {
    return (
        isPlainObject(props) &&
        Object.keys(props).every(prop => breakpointKeys.includes(prop as BreakpointToken))
    )
}

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

export function getColor(theme: Theme, color: ColorValue | ColorToken, alpha?: number) {
    let c = get(theme.colors, color)
    if (isNumber(alpha)) {
        return setColorAlpha(c ?? color, alpha)
    }

    if (c) return c

    return new ColorIO(color as string).toString()
}

type TypographyVariant = ThemeConfigVariant<'typography', TypographyToken>

export const getTypographyVariants = (theme: UnistylesTheme) => {
    return getKeys(theme.typography).reduce(
        (acc, key) => {
            Object.assign(acc, { [key]: typography(theme, key as TypographyToken) })
            return acc
        },
        {} as Record<TypographyToken, TypographyDefinition>,
    )
}

export const typography = (theme: UnistylesTheme, variant: TypographyVariant) => {
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

export function getShadow(theme: UnistylesTheme, variant: ShadowsToken) {
    return [theme.shadows[variant]]
}

type RingOffsetWidth = 0 | 1 | 2 | 4 | 8
type RingOffsetColor = ThemeColorScheme | 'default'

export type RingOffsetStyleProps = {
    ringOffsetWidth?: RingOffsetWidth
    ringOffsetColor?: RingOffsetColor
    ringOpacity?: number
}

const DEFAULT_RING_OPACITY = 1 as const
const DEFAULT_RING_SHADOW = `0 1px 2px 0 ${new ColorIO('oklch', [0, 0, 0], 0.05)}` as const

export function getRingOffsetStyles(
    theme: Theme,
    {
        ringOffsetWidth = 2,
        ringOffsetColor = 'primary',
        ringOpacity = 0.8,
    }: RingOffsetStyleProps = {},
    initialRingOffsetProps: RingOffsetStyleProps = {},
) {
    const initialProps = Object.assign(
        {
            ringOffsetWidth: 0,
            ringOffsetColor: 'default',
            ringOpacity: 0,
        },
        initialRingOffsetProps,
    )
    const colorKey = `${ringOffsetColor}.focusRing`
    const alpha = ringOpacity < DEFAULT_RING_OPACITY ? ringOpacity : undefined
    const offsetColor = getColor(theme, colorKey, alpha)
    const initialOffsetColor = getColor(theme, initialProps.ringOffsetColor, ringOpacity)
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

type SpacingTokenObject = Partial<Record<Direction, SpacingToken>>

const directions: Direction[] = ['top', 'right', 'bottom', 'left'] as const

function isSpacingTokenObject(obj: unknown): obj is SpacingTokenObject {
    return isPlainObject(obj) && Object.keys(obj).every(k => directions.includes(k as Direction))
}

type SpacingTokenArg = SpacingToken | SpacingTokenObject | undefined
// type SpacingTokenArgs = (SpacingToken | SpacingTokenObject | undefined)[]

type Padding = Partial<
    Pick<ViewStyle, 'padding' | 'paddingBottom' | 'paddingLeft' | 'paddingRight' | 'paddingTop'>
>

export function getPadding(theme: UnistylesTheme, ...tokens: SpacingTokenArg[]): Padding {
    const variants = variadic(...tokens) as SpacingTokenArg[]
    const padding: Padding = {}

    if (variants.length === 1 && variants[0] !== undefined) {
        const firstVariant = variants[0]
        if (isSpacingTokenObject(firstVariant)) {
            return getEntries<SpacingTokenObject>(firstVariant).reduce((acc, [dir, variant]) => {
                if (variant === undefined) return acc
                acc[`padding${upperFirst(dir)}`] = theme.space[variant]
                return acc
            }, padding)
        } else {
            return { padding: theme.space[firstVariant] }
        }
    }

    return variants.reduce((acc, variant, i) => {
        if (typeof variant === 'string') {
            acc[`padding${upperFirst(directions[i])}`] = theme.space[variant]
        }
        return acc
    }, padding)
}

export function getPaddingX(theme: UnistylesTheme, ...variants: SpacingToken[]) {
    const [left, right = left] = variants
    return getPadding(theme, { left, right })
}

export function getPaddingY(theme: UnistylesTheme, ...variants: SpacingToken[]) {
    const [top, bottom = top] = variants
    return getPadding(theme, { top, bottom })
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

export function getSizeVariants(_sizes: Theme['sizes'] = sizes) {
    return sizes.reduce(
        (acc, size) => {
            acc[size] = { width: size, height: size }
            return acc
        },
        {} as { [K in SizeToken]: { width: SizeToken; height: SizeToken } },
    )
}

const EMPTY_STYLE_OBJECT = {}
type EmptyStyleObject = typeof EMPTY_STYLE_OBJECT
export function isEmptyStyle(obj: unknown): obj is EmptyStyleObject {
    return isPlainObject(obj) && Object.keys(obj).length === 0
}

let sizeVariants = getSizeVariants()
export function getSizeVariant<TSizes extends Theme['sizes'] = Theme['sizes']>(
    size: TSizes[number] | number | undefined,
    _sizes?: TSizes,
): { width: SizeToken | number | undefined; height: SizeToken | number | undefined } {
    if (size === undefined) return { width: undefined, height: undefined }

    let variants = sizeVariants
    if (_sizes) {
        variants = getSizeVariants(_sizes)
    }
    if (!(size in variants) && !isNumber(size)) {
        throw new Error(`Size "${size}" is not a valid configured size.`)
    }

    return isSizeToken(size) ? variants[size] : { width: size, height: size }
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

type BorderColorKey = keyof Pick<Theme['colors'], 'line1' | 'line2' | 'line3' | 'line4'>

export type BorderOptions = {
    direction?: RNBorderDir
    borderStyle?: ViewStyle['borderStyle']
    borderColor?:
        | ViewStyle['borderColor']
        | BorderColorKey
        | keyof Get<Theme['colors'], `${ColorVariant}.${BorderColorKey}`>
}

export function getBorder(
    theme: Theme,
    border: boolean | number = true,
    options: BorderOptions = {},
) {
    const borderStyles = {} as Pick<
        ViewStyle,
        | 'borderWidth'
        | 'borderStyle'
        | 'borderColor'
        | 'borderBottomWidth'
        | 'borderEndWidth'
        | 'borderLeftWidth'
        | 'borderRightWidth'
        | 'borderStartWidth'
        | 'borderTopWidth'
    > &
        RNBorderColorProps

    let borderWidth = 0
    if (typeof border === 'boolean' && border === true) {
        borderWidth = 1
    } else if (typeof border === 'number') {
        borderWidth = border
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

export function getZIndex<
    Theme extends UnistylesTheme,
    ZIndexProp extends ThemeConfigVariant<'zIndices', ZIndicesToken> | undefined,
>(theme: Theme, zIndex: ZIndexProp): { zIndex?: number | { [Key in BreakpointToken]: number } } {
    if (zIndex === undefined) return { zIndex: undefined }

    if (isBreakpointTokenMap(zIndex)) {
        const responsiveZIndices = zIndex as BreakpointTokenMap<'zIndices'>
        const values = getEntries(responsiveZIndices).reduce(
            (acc, [bp, token]) => {
                acc[bp] = theme.zIndices[token] as ValueOf<Theme['zIndices'], typeof token>
                return acc
            },
            {} as { [Key in BreakpointToken]: number },
        )
        return { zIndex: values }
    }

    return { zIndex: theme.zIndices[zIndex as ZIndicesToken] }
}
