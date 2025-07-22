export type ThemeMode = 'dark' | 'light' | 'system'

export type ThemeBaseColorSchemes = typeof THEME_COLOR_SCHEMES
export type ThemeColorScheme = keyof ThemeBaseColorSchemes

type PaletteColorNames = typeof PALETTE_COLOR_NAMES
export type PaletteColorName = keyof PaletteColorNames

/**
 * Provides a map of color names where the generic value could be either:
 * - an array of raw color values in the form of a decimal array (see color tokens)
 * - an array of 'hsl' or 'oklch' formatted strings ready to be used in CSS
 */
export type PaletteColors<T = any> = Record<PaletteColorName, T[]>

type SimpleMerge<T, U> = {
    [K in keyof T | keyof U]: K extends keyof U ? U[K]
    : K extends keyof T ? T[K]
    : never
}

type Mapped<T, U> = {
    [K in keyof T]: U
}

type ColorSchemeMap = Record<PropertyKey, PaletteColorName>

/**
 * Some components may require additional color schemes that are not part of the base theme.
 * This type allows for extending the base color schemes with additional ones.
 */
export type CustomColorSchemes<TColorScheme extends ColorSchemeMap = ColorSchemeMap> = Exclude<
    TColorScheme,
    ThemeColorScheme
>
export type ThemeColorSchemes<TColorSchemes extends ColorSchemeMap = ColorSchemeMap> = SimpleMerge<
    ThemeBaseColorSchemes,
    Exclude<TColorSchemes, ThemeColorScheme>
>

export type ThemeColorSchemeMap<
    TColorValue,
    TColorSchemes extends ColorSchemeMap = ColorSchemeMap,
> = Mapped<ThemeColorSchemes<TColorSchemes>, TColorValue>

// export type ThemeColors<
//     TColors extends Record<string, any>,
//     TExtendedColorSchemes extends ExtendedColorSchemes = {},
// > = Record<keyof ThemeColorSchemes<string, TExtendedColorSchemes>, keyof TColors>

export type OklchValueString = `oklch(${number}% ${number} ${number}${string}`
export type HslValueString = `hsl(${number} ${number}% ${number}%${string}`
