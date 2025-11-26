import { ColorValue } from 'react-native'

import { AnyRecord } from '@coloragent/utils'
import { Simplify } from 'type-fest'

import { RadiiToken } from '../../design-system/design-tokens/radii'
import { ShadowToken } from '../../design-system/design-tokens/shadows'
import { SizeToken } from '../../design-system/design-tokens/sizes'
import { SpacingToken } from '../../design-system/design-tokens/spacing'
import { TypographyToken } from '../../design-system/design-tokens/typography-token'
import { ZIndicesToken } from '../../design-system/design-tokens/z-indices'
import { $Unistyle } from '../../lib/unistyles/stylesheet'
import { Theme } from '../../theme/theme'
import { Color } from '../../theme/theme.types'

export type WithInset<Props extends AnyRecord> = Simplify<Props & { inset?: boolean }>

export type WithPortalHost<Props extends AnyRecord> = Simplify<Props & { portalHost?: string }>

export type ThemeKey = keyof Exclude<Theme, Function>
export type ThemeConfigKey<TKey extends ThemeKey> = keyof Theme[TKey]

export type BreakpointStyleProp<V> = Partial<{ [key in $Unistyle.Breakpoints]: V }>

export type BreakpointStyleValues<StyleKey extends $Unistyle.StyleKey> = BreakpointStyleProp<
    $Unistyle.Styles[StyleKey]
>

/**
 * Represents a raw, valid style value type as defined in React/React-Native or a breakpoint
 * object with those type of value assigned.
 *
 * !NOTE: Not for setting Theme configured values!
 *
 * @example
 * ```tsx
 * <MyComponent justifyContent="center" />
 * ```
 *
 * OR
 *
 * ```tsx
 * <MyComponent justifyContent={{ sm: 'flex-start', lg: 'center' }} />
 * ```
 */
export type StylePropValue<StyleKey extends $Unistyle.StyleKey> =
    | $Unistyle.Styles[StyleKey]
    | BreakpointStyleProp<$Unistyle.Styles[StyleKey]>

// export type UnistylesBreakpointObject<StyleKey extends $Unistyle.StyleKey> = {
//     [key in $Unistyle.Breakpoints]: $Unistyle.Styles[StyleKey]
// }

/**
 * Represents a value that is either a variant of a configured Theme item or a breakpoint
 * object with those values assigned.
 *
 * @example
 * ```tsx
 * <MyComponent padding="md" />
 * ```
 * OR
 * ```tsx
 * <MyComponent padding={{ sm: 'xs', md: 'default' }} />
 * ```
 */
export type ThemeItemVariant<Token> =
    | Token
    | {
          [key in $Unistyle.Breakpoints]?: Token
      }

export type ThemeStyleProps = {
    absoluteFill?: boolean
    alignItems?: StylePropValue<'alignItems'>
    backgroundColor?: ThemeItemVariant<Color>
    border?: boolean | StylePropValue<'borderWidth'>
    borderColor?: ColorValue | Color
    borderRadius?: ThemeItemVariant<RadiiToken>
    boxShadow?: ThemeItemVariant<ShadowToken>
    color?: ThemeItemVariant<Color>
    display?: StylePropValue<'display'>
    flexCenter?: boolean
    flexDirection?: StylePropValue<'flexDirection'>
    height?: ThemeItemVariant<SizeToken>
    justifyContent?: StylePropValue<'justifyContent'>
    padding?: ThemeItemVariant<SpacingToken>
    paddingLeft?: ThemeItemVariant<SpacingToken>
    paddingRight?: ThemeItemVariant<SpacingToken>
    paddingTop?: ThemeItemVariant<SpacingToken>
    paddingBottom?: ThemeItemVariant<SpacingToken>
    paddingX?: ThemeItemVariant<SpacingToken>
    paddingY?: ThemeItemVariant<SpacingToken>
    ringOffsetColor?: string
    ringOffsetWidth?: number
    ringOpacity?: number
    size?: ThemeItemVariant<SizeToken>
    typography?: ThemeItemVariant<TypographyToken>
    width?: ThemeItemVariant<SizeToken>
    zIndex?: ThemeItemVariant<ZIndicesToken>
}

export type WithThemeStyleProps<Props extends AnyRecord = AnyRecord> = ThemeStyleProps & Props

export type RingOffsetStyleProps = Pick<
    ThemeStyleProps,
    'ringOffsetColor' | 'ringOffsetWidth' | 'ringOpacity'
>

// export type SingleRingOffsetStyleProps = {
//     ringOffsetColor: string
//     ringOffsetWidth: number
//     ringOpacity: number
// }

export const themeStyleProps: (keyof ThemeStyleProps)[] = [
    'absoluteFill',
    'alignItems',
    'backgroundColor',
    'border',
    'borderColor',
    'borderRadius',
    'boxShadow',
    'color',
    'display',
    'height',
    'justifyContent',
    'padding',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'paddingX',
    'paddingY',
    'ringOffsetColor',
    'ringOffsetWidth',
    'ringOpacity',
    'size',
    'typography',
    'width',
    'zIndex',
] as const
