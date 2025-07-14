// import type { ViewStyle, TextStyle, ImageStyle } from 'react-native'
import { PixelRatioStatic, ScaledSize, useWindowDimensions } from 'react-native'
import { useColorScheme } from 'react-native'
import { useAccessibilityInfo, useDeviceOrientation } from '@react-native-community/hooks'
import { ColorSchemeName, ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface KnownBaseTheme {
    colors: {
        [key: string]: string
    }
    fonts: {
        [key: string]: {
            fontFamily: string
            fontWeight?: string | number
            fontStyle?: 'normal' | 'italic'
        }
    }
    spacing: {
        /**
         * For Tailwind CSS:
         *   - All values will be divided by 4 and converted to `rem` units which will be assigned
         *       to CSS custom properties defined via the `@theme` directive in `tailwind.css`
         *       (e.g., `--spacing-4: 0.25rem`;).
         *   - Tailwind will then use that to generate spacing utilities
         *       (e.g., `p-4`, `m-4`, `gap-4`, etc.).
         *       @see {@link https://tailwindcss.com/docs/spacing}
         *
         * For React Native:
         *   - All values will be used as-is, which means they should be defined as pixel values, but
         *       without an assigned `px` unit.
         *   - All values will be assignable options for the `margin`, `padding`, and `gap` style
         *       properties.
         *       @see {@link https://reactnative.dev/docs/layout-props
         */
        [key: string]: number
    }
    breakpoints: {
        [key: string]: Breakpoint
    }
    zIndices?: {
        /**
         * For Tailwind CSS:
         *   - Tailwind will generate z-index utility classes (e.g., `z-10`, `z-20`, etc.).
         *         @see {@link https://tailwindcss.com/docs/z-index}
         *
         * For React Native:
         *   - All values will be used as-is, which means they should be defined as integers.
         *   - All values will be assignable options for the `zIndex` style property.
         *         @see {@link https://reactnative.dev/docs/layout-props#zindex}
         */
        [key: string]: number
    }
    borderRadii?: {
        /**
         * For Tailwind CSS:
         *   - All values will be divided by 4 and converted to `rem` units which will be assigned
         *       to CSS custom properties defined via the `@theme` directive in `tailwind.css`
         *       (e.g., `--radius-sm: 0.125rem`).
         *   - Tailwind will then use that to generate border radius utilities
         *       (e.g., `rounded-sm`, `rounded-md`, `rounded-lg`, etc.).
         *       @see {@link https://tailwindcss.com/docs/border-radius}
         *
         * For React Native:
         *   - All values will be used as-is, which means they should be defined as pixel values, but
         *       without an assigned `px` unit.
         *   - All values will be assignable options for the `borderRadius` style property
         */
        [key: string]: number
    }
    shadows?: {
        /**
         * For Tailwind CSS:
         *   - All values will be parsed into CSS custom properties defined via the `@theme`
         *       directive in `tailwind.css` (e.g., `--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)`).
         *   - Tailwind will then use that to generate shadow utilities
         *       (e.g., `shadow-sm`, `shadow-md`, `shadow-lg`, etc.).
         *       @see {@link https://tailwindcss.com/docs/box-shadow}
         *
         * For React Native:
         *   - All values will be parsed to a `ShadowProps` object containing the following
         *        style properties: `shadowColor`, `shadowOffset`, `shadowOpacity`, and
         *       `shadowRadius`.
         *       @see {@link https://reactnative.dev/docs/shadow-props}
         *   - The `ShadowProps` can be either applied directly to a component, in a StyleSheet, or
         *      used with the `boxShadow` or `dropShadow` style properties.
         *
         *   NOTE:
         *   - The `boxShadow` property is only available in React Native's New Architecture.
         *   - The `inset` property ONLY applies to `boxShadow`, not `dropShadow`.
         */
        [key: string]: string
    }
    sizes?: {
        /**
         * For Tailwind CSS:
         *   - Similar to how the `spacing` values are parsed, all values will be divided by 4 to
         *         generate the `size` utilities that use `rem` units.
         *        @see {@link https://tailwindcss.com/docs/size}
         */
        [key: string]: number
    }
    aspectRatios?: {
        /**
         * Formatted as `<width>:<height>`
         *
         * For Tailwind CSS:
         *   - This will be parsed into CSS custom properties defined via the `@theme` directive in
         *         `tailwind.css`.
         *         @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio}
         *   - Tailwind will then use that to generate an `aspect-ratio` utility class
         *         (e.g., `aspect-ratio-16/9`, `aspect-ratio-3/2`, `aspect-video`, etc.).
         *         @see {@link https://tailwindcss.com/docs/aspect-ratio}
         *
         * For React Native:
         *   - This is used to set the `aspectRatio` style property (LayoutProps), which follows
         *         the same format as CSS.
         *         @see {@link https://reactnative.dev/docs/layout-props#aspectratio}
         */
        [key: string]: string
    }
}

export interface BaseTheme extends KnownBaseTheme {
    [key: string]: any
}

export interface ResponsiveBaseTheme extends BaseTheme {
    breakpoints: {
        [key: string]: Breakpoint
    }
}

// export interface RestyleFunctionContainer<
//     TProps extends { [key: string]: any },
//     Theme extends BaseTheme = BaseTheme,
//     P extends keyof TProps = keyof TProps,
//     K extends keyof Theme | undefined = keyof Theme | undefined,
// > {
//     property: P
//     themeKey: K | undefined
//     variant: boolean
//     func: RestyleFunction<TProps, Theme>
// }

export type RNStyle =
    | ViewStyle
    | TextStyle
    | ImageStyle
    | ((...args: any[]) => StyleProp<ViewStyle>)

export type RNStyleProperty = keyof ViewStyle | keyof TextStyle | keyof ImageStyle

export interface Dimensions {
    width: number
    height: number
}

/**
 * For Tailwind CSS, all values will be converted to:
 *   - CSS custom properties defined via the `@theme` directive in `tailwind.css`
 *       (e.g., `--breakpoint-sm: 640px`).
 *   - Prefixes for responsive utility classes (e.g., `sm:`, `md:`, `lg:`, etc.).
 *       @see {@link https://tailwindcss.com/docs/breakpoints}
 *
 * For React Native:
 *   - All values will be used to dynamically update styles based on the current
 *       dimensions of the device.
 */
export type Breakpoint = number | Dimensions

export type Breakpoints = {
    [key: string]: Breakpoint
}

// export type BreakpointDimensions = Omit<Dimensions, 'height'> & { height: number | undefined }

export type BreakpointIteratorItem<BreakpointObj extends Breakpoints> = {
    name: keyof BreakpointObj
    width: number
    height: number | undefined
    next: () => BreakpointIteratorItem<BreakpointObj> | undefined
    prev: () => BreakpointIteratorItem<BreakpointObj> | undefined
}

export type BreakpointIterator<BreakpointObj extends Breakpoints> =
    BreakpointIteratorItem<BreakpointObj>[]

export const PLATFORMS = ['ios', 'android', 'windows', 'macos', 'web'] as const
export type Platform = (typeof PLATFORMS)[number]

export function isPlatform(x: string): x is Platform {
    return PLATFORMS.includes(x as Platform)
}

export const ORIENTATIONS = ['portrait', 'landscape']
export type Orientation = 'portrait' | 'landscape'

export function isOrientation(x: string): x is Orientation {
    return ORIENTATIONS.includes(x as Orientation)
}

/**
 * All of these should come from ThemeProvider
 * Combines sources from other hooks:
 *
 * From @react-native-community/hooks:
 *   - `useAccessibilityInfo` (`reduceMotionEnabled`)
 *   - `useDeviceOrientation` (`orientation`)
 *
 * From react-native:
 *   - `useWindowDimensions` (`dimensions`, `fontScale`, `scale`)
 *   - `useColorScheme` (`colorScheme` [`ColorSchemeName`])
 * to provide a single source of truth for the app's context.
 */
export interface AppContext<Theme extends BaseTheme = BaseTheme>
    extends Pick<ScaledSize, 'width' | 'height' | 'fontScale'> {
    theme: Theme
    breakpoint: [keyof Breakpoints, Breakpoints[keyof Breakpoints]] | undefined
    colorScheme: ColorSchemeName // From `useColorScheme`
    platform: Platform // From `Platform.OS`
    orientation: ReturnType<typeof useDeviceOrientation>
    reduceMotion: ReturnType<typeof useAccessibilityInfo>['reduceMotionEnabled']
    pixelDensity: ScaledSize['scale'] // Renaming `scale` to `pixelDensity` for clarity

    // From `useWindowDimensions` ScaledSize:
    // width: number
    // height: number
    // scale: number
    // fontScale: number
}

export type Style = {
    [key: string]: string[] | string | number | boolean | Style | Style[]
}

export type Utilities = {
    [key: string]: {
        style: Style
        media?: string
    }
}

export enum Unit {
    rem = 'rem',
    em = 'em',
    px = 'px',
    percent = `%`,
    vw = 'vw',
    vh = 'vh',
    deg = 'deg',
    rad = 'rad',
    none = `<no-css-unit>`,
}

export interface TailwindFn {
    (strings: TemplateStringsArray, ...values: (string | number)[]): Style
    // style: (...inputs: ClassInput[]) => Style
    color: (color: string) => string | undefined
    prefixMatch: (...prefixes: string[]) => boolean
    memoBuster: string

    // NB: @see https://www.typescriptlang.org/tsconfig#stripInternal

    /**
     * @internal
     */
    setWindowDimensions: (dimensions: { width: number; height: number }) => unknown
    /**
     * @internal
     */
    setFontScale: (fontScale: number) => unknown
    /**
     * @internal
     */
    setPixelDensity: (pixelDensity: 1 | 2) => unknown
    /**
     * @internal
     */
    setColorScheme: (colorScheme: ColorSchemeName) => unknown
    /**
     * @internal
     */
    getColorScheme: () => ColorSchemeName
    /**
     * @internal
     */
    updateDeviceContext: (
        dimensions: { width: number; height: number },
        fontScale: number,
        pixelDensity: 1 | 2,
        colorScheme: ColorSchemeName | 'skip',
    ) => unknown
}

export type TextVariant =
    | string
    | [string, string]
    | [string, { lineHeight?: string; letterSpacing?: string; fontWeight?: string }]

type TwScreen = string | { max?: string; min?: string }

// eg: { black: #000, gray: { 100: #eaeaea } }
export type TwColors<K extends keyof any = string, V = string> = {
    [key: string]: V | TwColors<K, V>
}

export interface TwTheme {
    fontSize?: Record<string, TextVariant>
    lineHeight?: Record<string, string>
    spacing?: Record<string, string>
    padding?: Record<string, string>
    margin?: Record<string, string>
    inset?: Record<string, string>
    height?: Record<string, string>
    width?: Record<string, string>
    maxWidth?: Record<string, string>
    maxHeight?: Record<string, string>
    minWidth?: Record<string, string>
    minHeight?: Record<string, string>
    letterSpacing?: Record<string, string>
    borderWidth?: Record<string, string>
    borderRadius?: Record<string, string>
    screens?: Record<string, TwScreen>
    opacity?: Record<string, number | string>
    flex?: Record<string, string>
    flexBasis?: Record<string, string>
    flexGrow?: Record<string, number | string>
    flexShrink?: Record<string, number | string>
    gap?: Record<string, string>
    fontWeight?: Record<string, number | string>
    fontFamily?: Record<string, string | string[]>
    zIndex?: Record<string, number | string>
    colors?: TwColors
    backgroundColor?: TwColors
    borderColor?: TwColors
    textColor?: TwColors
    scale?: Record<string, string>
    rotate?: Record<string, string>
    skew?: Record<string, string>
    translate?: Record<string, string>
    extend?: Omit<TwTheme, 'extend'>
}
