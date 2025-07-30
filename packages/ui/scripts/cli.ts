import fs from 'fs'
import {
    DimensionTokenValue,
    fontWeightPredefinedValues,
    FontWeightTokenValue,
    LineCap,
    lineCapPredefinedValues,
    LineStyle,
    MetadataExtension,
    ShadowTokenObjectValue,
    strokePredefinedValues,
    TransitionTokenObjectValue,
    TypographyTokenObjectValue,
    type ReferenceValue,
    type Token,
    type TokenGroup,
    type TokenType,
    type TokenValue,
} from './types'
import { METADATA_EXTENSION, PARSED_TOKENS_FILE_PATH, TOKENS_OUTPUT_FILE_PATH } from './constants'
import { TokenMap } from './token.utils'
import Color, { Coords } from 'colorjs.io'

function isPlainObject<T extends Record<PropertyKey, any>>(value: any): value is T {
    return Object.prototype.toString.call(value) === '[object Object]'
}

function titleCase(str: string): string {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

function isTokenGroup(value: any): value is TokenGroup {
    return isPlainObject(value) && !value?.$value
}

type TokenJSON = {
    theme: { [key: string]: TokenGroup }
}

function toTokenMap(tokens: TokenJSON): TokenMap {
    const tokenMap = new Map<string, Token>()

    function addTokens(group: TokenGroup, parentKey: string) {
        // console.info('Adding tokens for group:', parentKey, group)
        for (const [key, value] of Object.entries(group)) {
            if (key.startsWith('$') || !isPlainObject(value)) {
                continue
            }
            const tokenKey = `${parentKey}.${key}`
            if ('$value' in value) {
                tokenMap.set(tokenKey, value as Token)
            } else {
                addTokens(value, tokenKey)
            }
        }
    }

    for (const [groupName, group] of Object.entries(tokens.theme)) {
        addTokens(group, `theme.${groupName}`)
    }

    return tokenMap
}

type PureTokenValue<$T extends TokenType> = Exclude<TokenValue<$T>, ReferenceValue>

const tokenReferenceRegex = /^\{[a-zA-Z0-9\s@_-]+(?:\.[a-zA-Z0-9\s@_-]+)*\}$/

/** Check if the value is a reference. */
function isReference(value: any): value is ReferenceValue {
    return typeof value === 'string' && tokenReferenceRegex.test(value)
}

function unwrapReference(value: any): string {
    if (!isReference(value)) {
        throw new Error(`The token is not a reference. Got ${value}`)
    }

    return value.replace('{', '').replace('}', '')
}

function findReferencedToken<$T extends TokenType>(
    value: TokenValue<$T>,
    tokenMap: TokenMap,
): PureTokenValue<$T> {
    if (isReference(value)) {
        const tokenReference = unwrapReference(value) // unwrapReference(value)
        const referencedToken = tokenMap.get(tokenReference)?.$value

        if (referencedToken) {
            return referencedToken as PureTokenValue<$T>
        }
    }

    return value as PureTokenValue<$T>
}

function referenceToCustomProperty(value: ReferenceValue): string {
    const referencedToken = unwrapReference(value)
    const paths = referencedToken.split('.').slice(1) // remove `theme` prefix
    return `var(--${paths.join('-')})`
}

export type OklchValueString = `oklch(${number}% ${number} ${number}${string}`
export type HslValueString = `hsl(${number} ${number}% ${number}%${string}`

function normalizeAlpha(alpha?: number) {
    if (typeof alpha === 'number') {
        if (alpha <= 1.0) {
            alpha = alpha <= 0 ? 0 : alpha
        } else if (alpha > 1) {
            alpha = alpha > 100 ? 100 : alpha
            alpha = alpha / 100
        }
    }
    return alpha
}

function toOklchString(values: Coords, alpha?: number): OklchValueString {
    return new Color('oklch', values, normalizeAlpha(alpha)).toString() as OklchValueString
}

function toHslString(values: Coords, alpha = 1): HslValueString {
    return new Color(toOklchString(values, alpha)).to('hsl').toString() as HslValueString
}

function parseColorTokenValue(value: TokenValue<'color'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'color'> | undefined

    if (isReference(value)) {
        // tokenValue = findReferencedToken<'color'>(value, tokenMap)
        return referenceToCustomProperty(value)
    } else if (isPlainObject(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid color token value: ${JSON.stringify(value)}`)
    }

    const colorFn = tokenValue.colorSpace === 'hsl' ? toHslString : toOklchString

    return colorFn(tokenValue.components, tokenValue.alpha)
}

function toUnitValue(tokenValue: TokenValue<'dimension'> | TokenValue<'duration'>): string {
    if (isPlainObject(tokenValue)) {
        return `${tokenValue.value}${tokenValue.unit}`
    }

    return tokenValue
}

function parseDimensionTokenValue(value: TokenValue<'dimension'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'dimension'> | undefined

    if (isReference(value)) {
        // tokenValue = findReferencedToken<'dimension'>(value, tokenMap)
        return referenceToCustomProperty(value)
    } else if (isPlainObject(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid dimension token value: ${JSON.stringify(value)}`)
    }

    return toUnitValue(tokenValue)
}

function parseDurationTokenValue(value: TokenValue<'duration'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'duration'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'duration'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid duration token value: ${JSON.stringify(value)}`)
    }

    return toUnitValue(tokenValue)
}

function parseNumberTokenValue(value: TokenValue<'number'>, tokenMap: TokenMap): number {
    let tokenValue: PureTokenValue<'number'> | undefined

    if (typeof value === 'number') {
        tokenValue = value
    } else {
        tokenValue = findReferencedToken<'number'>(value, tokenMap)
    }

    if (typeof tokenValue === 'number') {
        return tokenValue
    }

    throw new Error(`Invalid number token value: ${JSON.stringify(value)}`)
}

type StrokeStyleProperties = { dashArray?: string; lineCap?: LineCap }

function parseStrokeStyleTokenValue(
    value: TokenValue<'strokeStyle'>,
    tokenMap: TokenMap,
): string | StrokeStyleProperties {
    let tokenValue: PureTokenValue<'strokeStyle'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'strokeStyle'>(value, tokenMap)
    } else if (typeof value == 'string' && strokePredefinedValues.includes(value)) {
        tokenValue = value as PureTokenValue<'strokeStyle'>
    } else if (isPlainObject(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid stroke style token value: ${JSON.stringify(value)}`)
    }

    if (typeof tokenValue === 'string') {
        return tokenValue
    }

    const tokenProperties = {} as StrokeStyleProperties
    if ('dashArray' in tokenValue) {
        let dashArrayObj: DimensionTokenValue[] = []
        if (isReference(tokenValue.dashArray)) {
            const dashArrayRef = findReferencedToken<'dimension'>(tokenValue.dashArray, tokenMap)
            dashArrayObj = Array.isArray(dashArrayRef) ? dashArrayRef : [dashArrayRef]
        } else if (Array.isArray(tokenValue.dashArray)) {
            dashArrayObj = tokenValue.dashArray.map(d => {
                if (isReference(d)) {
                    return findReferencedToken<'dimension'>(d, tokenMap)
                }
                return d as DimensionTokenValue
            })
        } else {
            throw new Error(`Invalid dashArray value: ${JSON.stringify(tokenValue.dashArray)}`)
        }
        tokenProperties.dashArray = dashArrayObj.map(toUnitValue).join(' ')
    }
    if ('lineCap' in tokenValue && lineCapPredefinedValues.includes(tokenValue.lineCap)) {
        tokenProperties.lineCap = tokenValue.lineCap
    }

    return tokenProperties
}

function parseBorderTokenValue(value: TokenValue<'border'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'border'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'border'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    }

    if (!isPlainObject(tokenValue)) {
        throw new Error(`Invalid color token value: ${JSON.stringify(value)}`)
    }

    const tokenProperties: string[] = []

    if (isPlainObject(tokenValue)) {
        if (!('width' in tokenValue) || !('style' in tokenValue) || !('color' in tokenValue)) {
            throw new Error(`Invalid border token value: ${JSON.stringify(tokenValue)}`)
        }

        tokenProperties.push(parseDimensionTokenValue(tokenValue.width, tokenMap))

        const borderStyle = parseStrokeStyleTokenValue(tokenValue.style, tokenMap) as LineStyle
        tokenProperties.push(typeof borderStyle === 'string' ? borderStyle : 'solid')

        tokenProperties.push(parseColorTokenValue(tokenValue.color, tokenMap))
    }

    return tokenProperties.join(' ')
}

function parseFontFamilyTokenValue(value: TokenValue<'fontFamily'>, tokenMap: TokenMap): string {
    if (typeof value == 'string') {
        if (isReference(value)) {
            return referenceToCustomProperty(value)
        }
        return value
    } else if (Array.isArray(value)) {
        return value.map(v => (isReference(v) ? unwrapReference(v) : v)).join(', ')
    } else {
        throw new Error(`Invalid font family token value: ${JSON.stringify(value)}`)
    }
}

function parseFontWeightTokenValue(
    value: TokenValue<'fontWeight'>,
    tokenMap: TokenMap,
): string | number {
    let tokenValue: FontWeightTokenValue = 'normal'

    if (isReference(value)) {
        return referenceToCustomProperty(value)
    } else if (fontWeightPredefinedValues.includes(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid font weight token value: ${JSON.stringify(value)}`)
    }

    return tokenValue
}

function parseCubicBezierTokenValue(value: TokenValue<'cubicBezier'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'cubicBezier'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'cubicBezier'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    } else {
        throw new Error(`Invalid cubic bezier token value: ${JSON.stringify(value)}`)
    }

    if (typeof tokenValue === 'string') {
        return tokenValue
    }

    if (
        Array.isArray(tokenValue) &&
        tokenValue.length === 4 &&
        tokenValue.every(v => typeof v === 'number')
    ) {
        return `cubic-bezier(${tokenValue.join(', ')})`
    }

    throw new Error(`Invalid cubic bezier token value: ${JSON.stringify(tokenValue)}`)
}

type TransitionProperties = { [key in keyof TransitionTokenObjectValue]?: string }

function parseTransitionTokenValue(
    value: TokenValue<'transition'>,
    tokenMap: TokenMap,
): TransitionProperties {
    let tokenValue: PureTokenValue<'transition'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'transition'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    }

    if (!isPlainObject(tokenValue)) {
        throw new Error(`Invalid transition token value: ${JSON.stringify(value)}`)
    }

    const tokenProperties: { [key in keyof TransitionTokenObjectValue]?: string } = {}

    if ('delay' in tokenValue) {
        tokenProperties.delay = parseDurationTokenValue(tokenValue.delay, tokenMap)
    }
    if ('duration' in tokenValue) {
        tokenProperties.duration = parseDurationTokenValue(tokenValue.duration, tokenMap)
    }
    if ('timingFunction' in tokenValue) {
        tokenProperties.timingFunction = parseCubicBezierTokenValue(
            tokenValue.timingFunction,
            tokenMap,
        )
    }

    return tokenProperties
}

// type ShadowTokenProperties = { [key in keyof ShadowTokenObjectValue]?: string | number }

function toShadowString(shadow: ShadowTokenObjectValue, tokenMap: TokenMap): string {
    const { offsetX, offsetY, blur, spread, color, inset } = shadow

    return [
        inset ? 'inset' : '',
        parseDimensionTokenValue(offsetX, tokenMap),
        parseDimensionTokenValue(offsetY, tokenMap),
        parseDimensionTokenValue(blur, tokenMap),
        parseDimensionTokenValue(spread, tokenMap),
        parseColorTokenValue(color, tokenMap),
    ]
        .filter(Boolean)
        .join(' ')
}

function parseShadowTokenValue(value: TokenValue<'shadow'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'shadow'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'shadow'>(value, tokenMap)
    } else if (isPlainObject(value) || Array.isArray(value)) {
        tokenValue = value
    }

    if (isPlainObject(tokenValue)) {
        return toShadowString(tokenValue as ShadowTokenObjectValue, tokenMap)
    }
    if (Array.isArray(tokenValue)) {
        const tokenValues = tokenValue as ShadowTokenObjectValue[]
        const shadowProperties = tokenValues.reduce((acc, props, index) => {
            acc.push(toShadowString(props, tokenMap))
            return acc
        }, [] as string[])

        return shadowProperties.join(', ')
    }

    throw new Error(`Invalid shadow token value: ${JSON.stringify(value)}`)
}

function parseRatioTokenValue(value: TokenValue<'ratio'>, tokenMap: TokenMap): string {
    let tokenValue: PureTokenValue<'ratio'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'ratio'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    }

    if (isPlainObject(tokenValue)) {
        const { x, y } = tokenValue
        return `${parseNumberTokenValue(x, tokenMap)} / ${parseNumberTokenValue(y, tokenMap)}`
    }

    throw new Error(`Invalid ratio token value: ${JSON.stringify(tokenValue)}`)
}

type TypographyTokenProperties = { [key in keyof TypographyTokenObjectValue]: string }

function parseTypographyTokenValue(
    value: TokenValue<'typography'>,
    tokenMap: TokenMap,
): TypographyTokenProperties {
    let tokenValue: PureTokenValue<'typography'> | undefined

    if (isReference(value)) {
        tokenValue = findReferencedToken<'typography'>(value, tokenMap)
    } else if (isPlainObject(value)) {
        tokenValue = value
    }

    if (!isPlainObject(tokenValue)) {
        throw new Error(`Invalid typography token value: ${JSON.stringify(value)}`)
    }

    const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } = tokenValue

    return {
        fontFamily: parseFontFamilyTokenValue(fontFamily, tokenMap),
        fontSize: parseDimensionTokenValue(fontSize, tokenMap),
        fontWeight: parseFontWeightTokenValue(fontWeight, tokenMap),
        letterSpacing: parseDimensionTokenValue(letterSpacing, tokenMap),
        lineHeight: parseNumberTokenValue(lineHeight, tokenMap).toString(),
    } as TypographyTokenProperties
}

const assignToSelector = (currentGroup: TokenGroup, init: Record<string, any>) => {
    const { $extensions = {} } = currentGroup
    const metadata = ($extensions?.[METADATA_EXTENSION] ?? {}) as MetadataExtension
    const { customPropertyPrefix, parentSelector } = metadata

    if (!parentSelector) {
        console.warn(`No parent selector found for group: ${currentGroup.$type}`)
        return
    }

    if (!customPropertyPrefix) {
        console.warn(
            `No custom property prefix found for group: ${currentGroup.$type}`,
            `\nparentSelector: ${parentSelector}`,
        )
        return
    }

    for (const [key, value] of Object.entries(currentGroup)) {
        let propertyKey = customPropertyPrefix ? `${customPropertyPrefix}-${key}` : key
        if (key.startsWith('$') || typeof value != 'object') {
            continue
        }

        init[`--${[propertyKey]}`] = referenceToCustomProperty(value.$value)
    }
}

const flattenGroupUtility = (currentGroup: TokenGroup, init: Record<string, any>) => {
    const { $type, $extensions = {} } = currentGroup
    const metadata = ($extensions?.[METADATA_EXTENSION] ?? {}) as MetadataExtension
    const { customPropertyPrefix, directive, properties } = metadata

    if (!directive || !properties?.length) {
        console.warn(`No directive found for group: ${currentGroup.$type}`)
        return
    }

    if (!customPropertyPrefix) {
        console.warn(
            `No custom property prefix found for group: ${currentGroup.$type}`,
            `\ndirective: ${directive}`,
        )
        return
    }

    const utilKey = `@utility ${customPropertyPrefix}-*`
    let tokenObj = init[utilKey]
    if (!tokenObj) {
        tokenObj = init[utilKey] = {}
    }

    switch ($type) {
        case 'dimension':
            tokenObj[`${customPropertyPrefix}-size`] = properties.reduce(
                (acc, prop) => {
                    acc[prop] = `--value(--${customPropertyPrefix}-*)`
                    return acc
                },
                {} as Record<string, string>,
            )
            break
        default:
            console.warn(`Unknown token type: ${$type} for key: ${utilKey}`)
            break
    }
}

const globalStyles = `
@layer base {
    * {
        @apply border-border outline-ring/50;
    }
    ::selection {
        @apply bg-selection text-selection-foreground;
    }
    html {
        @apply scroll-smooth;
    }
    body {
        font-synthesis-weight: none;
        text-rendering: optimizeLegibility;
    }

    @supports (font: -apple-system-body) and (-webkit-appearance: none) {
        [data-wrapper] {
            @apply min-[1800px]:border-t;
        }
    }

    a:active,
    button:active {
        @apply opacity-60 md:opacity-100;
    }
}

@utility border-grid {
    @apply border-border/50 dark:border-border;
}

@utility section-soft {
    @apply from-background to-surface/40 dark:bg-background 3xl:fixed:bg-none bg-gradient-to-b;
}

@utility theme-container {
    @apply font-sans;
}

@utility container-wrapper {
    @apply 3xl:fixed:max-w-[calc(var(--breakpoint-2xl)+2rem)] mx-auto w-full px-2;
}

@utility container {
    @apply 3xl:max-w-screen-2xl mx-auto max-w-[1400px] px-4 lg:px-8;
}

@utility no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

@utility border-ghost {
    @apply after:border-border relative after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten;
}

@utility step {
    counter-increment: step;
    @apply relative;

    &:before {
        @apply text-muted-foreground right-0 mr-2 hidden size-7 items-center justify-center rounded-full text-center -indent-px font-mono text-sm font-medium md:absolute;
        content: counter(step);
    }
}

@utility extend-touch-target {
    @media (pointer: coarse) {
        @apply relative touch-manipulation after:absolute after:-inset-2;
    }
}

@layer components {
    .steps {
        &:first-child {
            @apply !mt-0;
        }

        &:first-child > h3:first-child {
            @apply !mt-0;
        }

        > h3 {
            @apply !mt-16;
        }

        > h3 + p {
            @apply !mt-2;
        }
    }

    [data-rehype-pretty-code-figure] {
        background-color: var(--color-code);
        color: var(--color-code-foreground);
        border-radius: var(--radius-lg);
        border-width: 0px;
        border-color: var(--border);
        margin-top: calc(var(--spacing) * 6);
        overflow: hidden;
        font-size: var(--text-sm);
        outline: none;
        position: relative;
        @apply md:-mx-1;

        &:has([data-rehype-pretty-code-title]) [data-slot="copy-button"] {
            top: calc(var(--spacing) * 1.5) !important;
        }
    }

    [data-rehype-pretty-code-title] {
        border-bottom: color-mix(in oklab, var(--border) 30%, transparent);
        border-bottom-width: 1px;
        border-bottom-style: solid;
        padding-block: calc(var(--spacing) * 2.5);
        padding-inline: calc(var(--spacing) * 4);
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        color: var(--color-code-foreground);
    }

    [data-line-numbers] {
        display: grid;
        min-width: 100%;
        white-space: pre;
        border: 0;
        background: transparent;
        padding: 0;
        counter-reset: line;
        box-decoration-break: clone;
    }

    [data-line-numbers] [data-line]::before {
        font-size: var(--text-sm);
        counter-increment: line;
        content: counter(line);
        display: inline-block;
        width: calc(var(--spacing) * 16);
        padding-right: calc(var(--spacing) * 6);
        text-align: right;
        color: var(--color-code-number);
        background-color: var(--color-code);
        position: sticky;
        left: 0;
    }

    [data-line-numbers] [data-highlighted-line][data-line]::before {
        background-color: var(--color-code-highlight);
    }

    [data-line] {
        padding-top: calc(var(--spacing) * 0.5);
        padding-bottom: calc(var(--spacing) * 0.5);
        min-height: calc(var(--spacing) * 1);
        width: 100%;
        display: inline-block;
    }

    [data-line] span {
        color: var(--shiki-light);

        @variant dark {
            color: var(--shiki-dark) !important;
        }
    }

    [data-highlighted-line],
    [data-highlighted-chars] {
        position: relative;
        background-color: var(--color-code-highlight);
    }

    [data-highlighted-line] {
        &:after {
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            content: "";
            background-color: color-mix(
                in oklab,
                var(--muted-foreground) 50%,
                transparent
            );
        }
    }

    [data-highlighted-chars] {
        border-radius: var(--radius-sm);
        padding-inline: 0.3rem;
        padding-block: 0.1rem;
        font-family: var(--font-mono);
        font-size: 0.8rem;
    }
}
`

const TAB = '    '

function main() {
    const themeTokens: TokenJSON = JSON.parse(fs.readFileSync(PARSED_TOKENS_FILE_PATH, 'utf-8'))

    const tokenMap = toTokenMap(themeTokens)

    let outputContent = `/**\n * This file is auto-generated from the theme tokens.\n */
    
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@custom-variant fixed (&:is(.layout-fixed *));\n\n
`

    const flattenGroup = (currentGroup: TokenGroup, init: Record<string, any>) => {
        const { $type, $extensions = {} } = currentGroup
        const metadata = $extensions?.[METADATA_EXTENSION] ?? {}
        const { customPropertyPrefix } = metadata

        for (const [key, value] of Object.entries(currentGroup)) {
            if (key.startsWith('$') || typeof value != 'object') {
                continue
            }

            let propertyKey = customPropertyPrefix ? `${customPropertyPrefix}-${key}` : key

            if ('$value' in value) {
                switch ($type) {
                    case 'color':
                        init[`--${propertyKey}`] = parseColorTokenValue(
                            value.$value as TokenValue<'color'>,
                            tokenMap,
                        )
                        break
                    case 'dimension':
                        init[`--${propertyKey}`] = parseDimensionTokenValue(
                            value.$value as TokenValue<'dimension'>,
                            tokenMap,
                        )
                        break
                    case 'border':
                        init[`--${propertyKey}`] = parseBorderTokenValue(
                            value.$value as TokenValue<'border'>,
                            tokenMap,
                        )
                        break
                    case 'fontFamily':
                        init[`--${propertyKey}`] = parseFontFamilyTokenValue(
                            value.$value as TokenValue<'fontFamily'>,
                            tokenMap,
                        )
                        break
                    case 'fontWeight':
                        init[`--${propertyKey}`] = parseFontWeightTokenValue(
                            value.$value as TokenValue<'fontWeight'>,
                            tokenMap,
                        )
                        break
                    case 'cubicBezier':
                        init[`--${propertyKey}`] = parseCubicBezierTokenValue(
                            value.$value as TokenValue<'cubicBezier'>,
                            tokenMap,
                        )
                        break
                    case 'shadow':
                        init[`--${propertyKey}`] = parseShadowTokenValue(
                            value.$value as TokenValue<'shadow'>,
                            tokenMap,
                        )
                        break
                    case 'typography':
                        const typographyProps = parseTypographyTokenValue(
                            value.$value as TokenValue<'typography'>,
                            tokenMap,
                        )
                        init[`--${propertyKey}`] = typographyProps.fontSize
                        init[`--${propertyKey}--line-height`] = typographyProps.lineHeight
                        init[`--${propertyKey}--font-family`] = typographyProps.fontFamily
                        init[`--${propertyKey}--font-weight`] = typographyProps.fontWeight
                        init[`--${propertyKey}--letter-spacing`] = typographyProps.letterSpacing
                        break
                    case 'ratio':
                        init[`--${propertyKey}`] = parseRatioTokenValue(
                            value.$value as TokenValue<'ratio'>,
                            tokenMap,
                        )
                        break
                    default:
                        console.warn(`Unknown token type: ${$type} for key: ${key}`)
                        init[`--${propertyKey}`] = value.$value
                        break
                }
            } else {
                flattenGroup(value, init)
            }
        }
    }

    const customProperties: {
        theme: Record<string, Record<string, any>>
        directives: Record<string, Record<string, any>>
        [key: string]: Record<string, Record<string, any>>
    } = {
        theme: {},
        directives: {},
    }

    for (const tokenGroup of Object.values(themeTokens.theme)) {
        if (!isTokenGroup(tokenGroup)) {
            continue
        }

        const metadata = tokenGroup?.$extensions?.[METADATA_EXTENSION] ?? {}
        const parentSelector = metadata?.parentSelector

        let themeCustomProps = customProperties.theme

        const typeKey = tokenGroup.$type
        if (typeKey) {
            if (!customProperties.theme?.[typeKey]) {
                customProperties.theme[typeKey] = {}
            }
            themeCustomProps = customProperties.theme[typeKey]
        }

        if (!parentSelector) {
            flattenGroup(tokenGroup, themeCustomProps)
        } else {
            let selectorSpecific = customProperties?.[parentSelector]
            if (!customProperties?.[parentSelector]) {
                customProperties[parentSelector] = {}
                selectorSpecific = customProperties[parentSelector]
            }
            assignToSelector(tokenGroup, selectorSpecific)
        }

        const twDirective = metadata?.directive
        if (typeof twDirective == 'string' && twDirective !== 'theme') {
            flattenGroupUtility(tokenGroup, customProperties.directives)
        }
    }

    // Write the generated CSS Custom Properties to the output file using
    // Tailwind's `@theme` directive
    const { theme, directives, ...selectorSpecific } = customProperties
    const utils = {
        theme: [] as [string, [string, string]][],
        // root: [] as [string, [string, string]][],
        inline: [] as [string, [string, string]][],
    }
    const entries = Object.entries(customProperties.theme).map(([$type, tokens]) => {
        const entry = [$type, Object.entries(tokens)] as [string, [string, string][]]
        return entry
    })

    entries.forEach(([varName, varValue]) => {
        varValue.forEach(([vkey, vvalue]) => {
            if (vvalue.startsWith('var(--')) {
                utils.inline.push([varName, [vkey, vvalue]])
            } else {
                utils.theme.push([varName, [vkey, vvalue]])
            }
        })
    })

    // Tailwind prefers that any custom CSS Custom Properties be added within the
    // `@theme` directive rather than the `:root` selector.
    //! NOTE: There should never be any custom properties assigned here that are references
    //! to other properties defined within the `@theme` directive.
    outputContent += `@theme {\n`
    outputContent += utils.theme.reduce((acc, [$type, tokens], idx) => {
        if (idx === 0 && $type) {
            acc += `${TAB}/* ${titleCase($type)} Tokens */\n`
        }
        acc += `${TAB}${tokens[0]}: ${tokens[1]};\n`
        return acc
    }, '')
    outputContent += `}\n`

    // Any CSS Custom Properties that reference other CSS Custom Properties should be
    // defined as `inline` in the `@theme` directive to avoid circular references.
    outputContent += `@theme inline {\n`
    outputContent += utils.inline.reduce((acc, [$type, tokens], idx) => {
        if (idx === 0 && $type) {
            acc += `${TAB}/* ${titleCase($type)} Tokens */\n`
        }
        acc += `${TAB}${tokens[0]}: ${tokens[1]};\n`
        return acc
    }, '')
    outputContent += `}\n`

    // Format any selector-specific custom properties under their provided parent selector
    // e.g. `:root`, `.dark`, etc.
    const selectorKeys = Object.keys(selectorSpecific)
    if (selectorKeys.length > 0) {
        for (const selector of selectorKeys) {
            outputContent += `\n${selector} {\n`
            outputContent += Object.entries(selectorSpecific[selector]).reduce(
                (acc, [key, value]) => {
                    acc += `${TAB}${key}: ${value};\n`
                    return acc
                },
                '',
            )
            outputContent += `}\n`
        }
    }

    // Write any additional directives defined in the tokens, such as `@utility`
    // and `@layer components`
    const directiveKeys = Object.keys(customProperties.directives)
    if (directiveKeys.length > 0) {
        for (const directive of directiveKeys) {
            outputContent += `\n${directive} {\n`
            outputContent += Object.entries(customProperties.directives[directive]).reduce(
                (acc, [key, value]) => {
                    acc += `${TAB}${key}: {\n`
                    for (const [prop, propValue] of Object.entries(value)) {
                        acc += `${TAB}${TAB}${prop}: ${propValue};\n`
                    }
                    acc += `${TAB}}\n`
                    return acc
                },
                '',
            )
            outputContent += `}\n`
        }
    }

    outputContent += globalStyles

    fs.writeFileSync(TOKENS_OUTPUT_FILE_PATH, outputContent, 'utf-8')
}

main()
