import { ImageStyle, TextStyle, ViewStyle, StyleProp } from 'react-native'
import * as React from 'react'

interface ValueObject {
    [themeName: string]: string
}

type DataAttribute = `data-${string}`

interface ScriptProps
    extends React.DetailedHTMLProps<
        React.ScriptHTMLAttributes<HTMLScriptElement>,
        HTMLScriptElement
    > {
    [dataAttribute: DataAttribute]: any
}

export interface UseThemeProps {
    /** List of all available theme names */
    themes: string[]

    /** Forced theme name for the current page */
    forcedTheme?: string | undefined

    /** Update the theme */
    setTheme: React.Dispatch<React.SetStateAction<string>>

    /** Active theme name */
    theme?: string | undefined

    /**
     * If `enableSystem` is true and the active theme is "system", this returns
     * whether the system preference resolved to "dark" or "light". Otherwise,
     * identical to `theme`
     */
    resolvedTheme?: string | undefined

    /**
     * If enableSystem is true, returns the System theme preference ("dark" or "light"),
     * regardless what the active theme is
     */
    systemTheme?: 'dark' | 'light' | undefined
}

export type Attribute = DataAttribute | 'class'

export interface ThemeProviderProps extends React.PropsWithChildren<unknown> {
    /** List of all available theme names */
    themes?: string[] | undefined

    /** Forced theme name for the current page */
    forcedTheme?: string | undefined

    /** Whether to switch between dark and light themes based on prefers-color-scheme */
    enableSystem?: boolean | undefined

    /** Disable all CSS transitions when switching themes */
    disableTransitionOnChange?: boolean | undefined

    /**
     * Whether to indicate to browsers which color scheme is used (dark or light) for
     * built-in UI like inputs and buttons
     */
    enableColorScheme?: boolean | undefined

    /** Key used to store theme setting in localStorage */
    storageKey?: string | undefined

    /**
     * Default theme name (for v0.0.12 and lower the default was light). If `enableSystem`
     * is false, the default theme is light.
     */
    defaultTheme?: string | undefined

    /**
     * HTML attribute modified based on the active theme. Accepts `class`, `data-*`
     * (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array
     * which could include both.
     */
    attribute?: Attribute | Attribute[] | undefined

    /**
     * Mapping of theme name to HTML attribute value. Object where key is the theme
     * name and value is the attribute value.
     */
    value?: ValueObject | undefined

    /** Nonce string to pass to the inline script and style elements for CSP headers */
    nonce?: string

    /** Props to pass the inline script */
    scriptProps?: ScriptProps
}

export type StyleTransformFunction<
    Theme extends BaseTheme,
    K extends keyof Theme | undefined,
    TVal,
> = (params: {
    value: TVal | undefined | null
    theme: Theme
    themeKey?: K
}) => TVal | undefined | null

export type AtLeastOneResponsiveValue<
    Value,
    B extends BaseTheme['breakpoints'],
    R = { [Key in keyof B]: { [key in Key]: Value } },
> = Partial<{
    [K in keyof B]: Value
}> &
    R[keyof R]

export interface BaseTheme {
    [key: string]: any
}

export type Breakpoint = number | Dimensions

export interface Dimensions {
    width: number
    height: number
}

export interface RestyleFunctionContainer<
    TProps extends { [key: string]: any },
    Theme extends BaseTheme = BaseTheme,
    P extends keyof TProps = keyof TProps,
    K extends keyof Theme | undefined = keyof Theme | undefined,
> {
    property: P
    themeKey: K | undefined
    variant: boolean
    func: RestyleFunction<TProps, Theme>
}

export type RestyleFunction<
    TProps extends { [key: string]: any } = { [key: string]: any },
    Theme extends BaseTheme = BaseTheme,
    S extends keyof any = string,
> = (
    props: TProps,
    context: { theme: Theme; dimensions: Dimensions | null },
) => {
    [key in S]?: any
}

export type RNStyle =
    | ViewStyle
    | TextStyle
    | ImageStyle
    | ((...args: any[]) => StyleProp<ViewStyle>)

export type RNStyleProperty = keyof ViewStyle | keyof TextStyle | keyof ImageStyle

export type PropValue = string | number | undefined | null
