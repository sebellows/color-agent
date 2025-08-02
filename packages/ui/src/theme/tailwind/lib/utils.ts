import { getKeys, isPlainObject } from '@coloragent/utils'
import {
    BaseTheme,
    Breakpoint,
    BreakpointDimensions,
    BreakpointIterator,
    BreakpointIteratorItem,
    Breakpoints,
    DeviceContext,
    Dimensions,
    ResponsiveBaseTheme,
    RNStyleProperty,
    Style,
    Unit,
} from '../types'
import { formatNumericValue, parseNumericValue } from './normalize-units'

function consoleWarn(...args: any[]): void {
    console.warn(...args) // eslint-disable-line no-console
}

function noopWarn(..._: any[]): void {
    // ¯\_(ツ)_/¯
}

export const warn: (...args: any[]) => void =
    typeof process === 'undefined' || process?.env?.JEST_WORKER_ID === undefined ?
        consoleWarn
    :   noopWarn
//

const getMemoizedMapHashKey = (
    dimensions: Dimensions | null,
    themeKey: string,
    property: string,
    value: string | number | boolean,
) => {
    return `${dimensions?.height}x${dimensions?.width}-${themeKey}-${property}-${value}`
}

const memoizedThemes: WeakMap<BaseTheme, any> = new WeakMap()

export type StyleConfig<
    Theme extends BaseTheme = BaseTheme,
    K extends keyof Theme | undefined = keyof Theme | undefined,
> = {
    property: string | string[] // The Tailwind base utility class name(s), e.g. 'w', 'rounded', etc.
    styleProperty: RNStyleProperty
    themeKey?: K
    twValues?: string[] // The Tailwind utility class values, e.g. '-1/2', 'rounded-lg', etc.
}

export type StyleResolver = <
    Theme extends BaseTheme = BaseTheme,
    K extends keyof Theme | undefined = keyof Theme | undefined,
>(
    config: StyleConfig<Theme, K>,
    style: Style,
) => Style

export interface ParseContext {
    isDark?: boolean
    isNegative?: boolean
    fractions?: boolean
    breakpoint?: [string, Breakpoint]
    states?: string[] // i.e., `hover`, `active`, disabled`
}

export function toBreakpointIterator<BreakpointObj extends Breakpoints>(
    breakpoints: BreakpointObj,
): BreakpointIterator<BreakpointObj> {
    const breakpointKeys = getKeys(breakpoints)
    return breakpointKeys.reduce((acc, bpName, i, arr) => {
        const bp = breakpoints[bpName]
        const bpItem = {
            name: bpName,
            width: isPlainObject(bp) ? bp.width : bp,
            height: isPlainObject(bp) ? bp.height : undefined,
            next: () => undefined,
            prev: () => undefined,
        } as BreakpointIteratorItem<BreakpointObj>

        if (i !== arr.length - 1) {
            bpItem.next = () => acc[i + 1]
        }
        if (i !== 0) {
            bpItem.prev = () => acc[i - 1]
        }

        acc.push(bpItem)

        return acc
    }, {} as BreakpointIterator<BreakpointObj>)
}

function validBreakpoint(
    theme: BaseTheme,
    breakpoint: string | undefined,
    deviceWidth: number,
): boolean {
    if (!breakpoint || !(breakpoint in theme.breakpoints)) {
        return false
    }
    const breakpoints = Object.keys(theme.breakpoints)
    const bp = theme.breakpoints[breakpoint]
    const lastBp = theme.breakpoints[breakpoints[breakpoints.length - 1]]
    const isLastBp = Object.is(bp, lastBp)
    const bpWidth = typeof bp === 'number' ? bp : bp.width
    if (isLastBp) {
        return deviceWidth >= bpWidth
    }
    const nextBp = theme.breakpoints[breakpoints[breakpoints.indexOf(breakpoint) + 1]]
    const nextBpWidth = typeof nextBp === 'number' ? nextBp : nextBp.width
    return bpWidth >= deviceWidth && deviceWidth < nextBpWidth
}

// Find instances like `bg-(color:--body-bg)` or `text-(size:--text-lg)`
const customPropertyRE = /\(\w*:?\s*(--[a-zA-Z0-9\-]*?)\)/

type ThemeProps = Record<string, string>

export function parseCustomProperty<TProps extends ThemeProps = ThemeProps>(
    value: string,
    themeProps: TProps = {} as TProps,
): [number, Unit] | string | null {
    if (customPropertyRE.test(value)) {
        const match = value.match(customPropertyRE)
        if (match) {
            if (match[1] in themeProps) {
                const themeValue = parseNumericValue(themeProps[match[1]])
                if (themeValue) {
                    return themeValue
                }
            } else if (match[1].length) {
                return match[1]
            }
        }
    }

    return null
}

export function createParser<Theme extends BaseTheme>(
    input: string,
    config: DeviceContext<Theme>,
    ref?: React.RefObject<React.Component>,
    style: Style = {},
) {
    let position = 0
    const paths = input.trim().split(':')
    let classStr = paths.pop() ?? ''

    if (!classStr.length) return null

    let context = {} as ParseContext
    let char = classStr[position]

    const {
        theme,
        colorScheme,
        orientation,
        dimensions: { width },
    } = config

    if (paths.length) {
        context = paths.reduce((acc, path) => {
            const prefix = path.trim()
            if (prefix === 'dark') {
                acc.isDark = true
            } else if (prefix === 'light') {
                acc.isDark = false
            } else if (prefix in theme.breakpoints && validBreakpoint(theme, prefix, width)) {
                acc.breakpoint = [prefix, theme.breakpoints[prefix]]
            }
            return acc
        }, {} as ParseContext)
        // classStr = classStr.trim()
    }

    function next(amount = 1): void {
        position += amount
        char = classStr[position]
    }

    function remainder(): string {
        return peekNext(0, classStr.length)
    }

    function peekNext(begin: number, end: number): string {
        return classStr.slice(position + begin, position + end)
    }

    function proceedNext(twClass: string): boolean {
        if (peekNext(0, twClass.length) === twClass) {
            next(twClass.length)
            return true
        }

        return false
    }

    type ThemeConfig<K extends keyof Theme | undefined = keyof Theme | undefined> =
        K extends keyof Theme ? Theme[K] : never

    function parse(
        { property, styleProperty, themeKey, twValues = [] }: StyleConfig,
        resolver: <V extends string | number | undefined>(
            value: V,
            ctx: ParseContext,
            themeConfig?: ThemeConfig<typeof themeKey>,
        ) => V,
    ): Style | null {
        if (!memoizedThemes.has(theme)) {
            memoizedThemes.set(theme, {})
        }

        // const value = resolve(remainder(), context)
        // if (value) {
        if (typeof property === 'string' && proceedNext(property)) {
            const memoizedMapHashKey = (() => {
                if (typeof themeKey === 'string') {
                    let propertyValue = ''
                    if (context?.breakpoint) {
                        const [breakpoint, value] = context.breakpoint
                        propertyValue += `${breakpoint}:${
                            typeof value === 'object' ? value.width : value
                        }`
                    } else {
                        propertyValue += remainder() ?? ''
                    }

                    return getMemoizedMapHashKey(
                        config.dimensions,
                        themeKey,
                        property,
                        propertyValue,
                    )
                } else {
                    return null
                }
            })()

            if (memoizedMapHashKey !== null) {
                const memoizedValue = memoizedThemes.get(theme)?.[memoizedMapHashKey]
                if (memoizedValue) {
                    return memoizedValue
                }
            }

            if (themeKey && theme?.[themeKey]) {
                const value = remainder()
                const themeValue = theme[themeKey]?.[value]

                if (typeof themeValue === 'string') {
                    const parsedValue = parseNumericValue(themeValue)
                    if (parsedValue) {
                        const [number, unit] = parsedValue
                        const formattedValue = formatNumericValue(number, unit, config.dimensions)
                        if (formattedValue) {
                            style[styleProperty] = formattedValue
                        }
                    } else {
                        const customValue = parseCustomProperty(themeValue, theme[themeKey])
                        if (customValue) {
                            if (Array.isArray(customValue)) {
                                const [number, unit] = customValue
                                const formattedValue = formatNumericValue(
                                    number,
                                    unit,
                                    config.dimensions,
                                )
                                if (formattedValue) {
                                    style[styleProperty] = formattedValue
                                }
                            } else if (typeof customValue === 'string') {
                                style[styleProperty] = customValue
                            }
                        }
                    }
                } else if (Array.isArray(themeValue)) {
                    style[styleProperty] = themeValue.join(' ')
                } else if (typeof themeValue === 'object') {
                    Object.assign(style, themeValue)
                }
            }
        }

        return Object.keys(style).length > 0 ? style : null
    }
}
