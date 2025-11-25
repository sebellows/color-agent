// import { AnyRecord } from '@coloragent/utils'
// import { Simplify } from 'type-fest'

// import { $Unistyle } from '../../lib/unistyles/stylesheet'
// import { Theme } from '../../theme/theme'

// export type WithInset<Props extends AnyRecord> = Simplify<Props & { inset?: boolean }>

// export type WithPortalHost<Props extends AnyRecord> = Simplify<Props & { portalHost?: string }>

// type ThemeKey = keyof Exclude<Theme, Function>
// type ThemeConfigKey<TKey extends ThemeKey> = keyof Theme[TKey]

// /**
//  * Represents a raw, valid style value type as defined in React/React-Native or a breakpoint
//  * object with those type of value assigned.
//  *
//  * !NOTE: Not for setting Theme configured values!
//  *
//  * @example
//  * ```tsx
//  * <MyComponent justifyContent="center" />
//  * ```
//  *
//  * OR
//  *
//  * ```tsx
//  * <MyComponent justifyContent={{ sm: 'flex-start', lg: 'center' }} />
//  * ```
//  */
// export type StyleValue<StyleKey extends $Unistyle.StyleKey> =
//     | $Unistyle.Styles[StyleKey]
//     | { [key in $Unistyle.Breakpoints]: $Unistyle.Styles[StyleKey] }

// /**
//  * Represents a value that is either a variant of a configured Theme item or a breakpoint
//  * object with those values assigned.
//  *
//  * @example
//  * ```tsx
//  * <MyComponent padding="md" />
//  * ```
//  * OR
//  * ```tsx
//  * <MyComponent padding={{ sm: 'xs', md: 'default' }} />
//  * ```
//  */
// export type ThemeItemVariant<TKey extends ThemeKey> =
//     | ThemeConfigKey<TKey>
//     | {
//           [key in $Unistyle.Breakpoints]?: ThemeConfigKey<TKey>
//       }

// export type ThemeStyleProps = {
//     absoluteFill?: boolean
//     alignItems?: StyleValue<'alignItems'>
//     backgroundColor?: ThemeItemVariant<'colors'>
//     border?: boolean | StyleValue<'borderWidth'>
//     borderColor?: ThemeItemVariant<'colors'>
//     borderRadius?: ThemeItemVariant<'radii'>
//     boxShadow?: ThemeItemVariant<'boxShadows'>
//     color?: ThemeItemVariant<'colors'>
//     display?: StyleValue<'display'>
//     height?: ThemeItemVariant<'sizes'>
//     justifyContent?: StyleValue<'justifyContent'>
//     padding?: ThemeItemVariant<'space'>
//     paddingLeft?: ThemeItemVariant<'space'>
//     paddingRight?: ThemeItemVariant<'space'>
//     paddingTop?: ThemeItemVariant<'space'>
//     paddingBottom?: ThemeItemVariant<'space'>
//     paddingX?: ThemeItemVariant<'space'>
//     paddingY?: ThemeItemVariant<'space'>
//     ringOffsetColor?: StyleValue<'color'>
//     ringOffsetWidth?: StyleValue<'borderWidth'>
//     ringOpacity?: StyleValue<'opacity'>
//     size?: ThemeItemVariant<'sizes'>
//     width?: ThemeItemVariant<'sizes'>
//     zIndex?: ThemeItemVariant<'zIndices'>
// }

// export type WithThemeStyleProps<Props extends AnyRecord> = ThemeStyleProps & Props
