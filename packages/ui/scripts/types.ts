import { CamelCase, KebabCase, PascalCase, SnakeCase, ValueOf } from 'type-fest'

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type ModifyProperties<T, Changes extends Partial<Record<keyof T, any>>> = Omit<
    T,
    keyof Changes
> & {
    [K in keyof Changes]: Changes[K]
}

export type Style = {
    [key: string]: string[] | string | number | boolean | Style | Style[]
}

export const strokePredefinedValues = [
    'solid',
    'dashed',
    'dotted',
    'double',
    'groove',
    'ridge',
    'outset',
    'inset',
] as const
export type LineStyle = (typeof strokePredefinedValues)[number]
export const lineCapPredefinedValues = ['butt', 'round', 'square'] as const
export type LineCap = (typeof lineCapPredefinedValues)[number]

/**
 * Values come from React Native's TextStyle fontWeight property.
 *
 * @see {@link https://reactnative.dev/docs/text-style-props#fontweight}
 */
export const fontWeightPredefinedValues = [
    'normal',
    'bold',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    'ultralight',
    'thin',
    'light',
    'medium',
    'regular',
    'semibold',
    'condensedBold',
    'condensed',
    'heavy',
    'black',
] as const
export type FontWeight = (typeof fontWeightPredefinedValues)[number]

export type BaseTokenProperties<$Type> = {
    $type?: $Type
    $description?: string
    $extensions?: Record<string, any>
}

export type ReferenceValue = `{${string}}`

export type ColorTokenValue =
    | {
          colorSpace: 'hsl' | 'oklch'
          components: [number, number, number]
          alpha?: number
          hex?: string
      }
    | ReferenceValue

export type DimensionTokenValue =
    | {
          value: number
          unit: 'px' | 'rem'
      }
    | ReferenceValue

export type FontFamilyTokenValue = string | (string | ReferenceValue)[] | ReferenceValue

export type FontWeightTokenValue = FontWeight | ReferenceValue

export type DurationTokenValue =
    | {
          value: number
          unit: 'ms' | 's'
      }
    | ReferenceValue

export type CubicBezierTokenValue =
    | [
          number | ReferenceValue,
          number | ReferenceValue,
          number | ReferenceValue,
          number | ReferenceValue,
      ]
    | ReferenceValue

export type NumberTokenValue = number | ReferenceValue

export type StrokeStyleObjectValue = {
    dashArray: DimensionToken['$value'][]
    lineCap: LineCap
}

export type StrokeStyleTokenValue = LineStyle | StrokeStyleObjectValue | ReferenceValue

export type BorderTokenValue =
    | {
          width: DimensionToken['$value']
          style: LineStyle
          color: ColorToken['$value']
      }
    | ReferenceValue

export type TransitionTokenObjectValue = {
    duration: DurationToken['$value']
    delay: DurationToken['$value']
    timingFunction: CubicBezierToken['$value']
}

export type TransitionTokenValue = TransitionTokenObjectValue | ReferenceValue

export type ShadowTokenObjectValue = {
    color: ColorToken['$value']
    offsetX: DimensionToken['$value']
    offsetY: DimensionToken['$value']
    blur: DimensionToken['$value']
    spread: DimensionToken['$value']
    inset?: boolean
}

type ShadowValue = ShadowTokenObjectValue | ReferenceValue

export type ShadowTokenValue = ShadowValue | ShadowValue[] | ReferenceValue

export type GradientTokenValue =
    | (
          | {
                color: ColorToken['$value']
                position: NumberToken['$value']
            }
          | ReferenceValue
      )[]
    | ReferenceValue

export type TypographyTokenObjectValue = {
    fontFamily: FontFamilyToken['$value']
    fontSize: DimensionToken['$value']
    fontWeight: FontWeightToken['$value']
    letterSpacing: DimensionToken['$value']
    lineHeight: NumberToken['$value']
}
export type TypographyTokenValue = TypographyTokenObjectValue | ReferenceValue

export type RatioTokenObjectValue = {
    x: NumberToken['$value']
    y: NumberToken['$value']
}

export type RatioTokenValue = RatioTokenObjectValue | ReferenceValue

type TokenValueMap = {
    border: BorderTokenValue
    color: ColorTokenValue
    cubicBezier: CubicBezierTokenValue
    dimension: DimensionTokenValue
    duration: DurationTokenValue
    fontFamily: FontFamilyTokenValue
    fontWeight: FontWeightTokenValue
    gradient: GradientTokenValue
    number: NumberTokenValue
    ratio: RatioTokenValue
    shadow: ShadowTokenValue
    strokeStyle: StrokeStyleTokenValue
    transition: TransitionTokenValue
    typography: TypographyTokenValue
}

export type DesignToken<$Type extends keyof TokenValueMap> = BaseTokenProperties<$Type> & {
    $value: TokenValueMap[$Type]
}

export type ColorToken = DesignToken<'color'>

export type DimensionToken = DesignToken<'dimension'>

export type FontFamilyToken = DesignToken<'fontFamily'>

export type FontWeightToken = DesignToken<'fontWeight'>

export type DurationToken = DesignToken<'duration'>

export type CubicBezierToken = DesignToken<'cubicBezier'>

export type NumberToken = DesignToken<'number'>

export type StrokeStyleToken = DesignToken<'strokeStyle'>

export type BorderToken = DesignToken<'border'>

export type TransitionToken = DesignToken<'transition'>

export type ShadowToken = DesignToken<'shadow'>

export type GradientToken = DesignToken<'gradient'>

export type TypographyToken = DesignToken<'typography'>

/**
 * !NOTE: This is a custom type for ratios, not an official token
 * definition from the DTCG.
 *
 * This type is used to define ratios in a way that can be
 * easily used in UI components, such as aspect ratios and
 * can be used for percentages, coordinates, or fractions.
 */
export type RatioToken = DesignToken<'ratio'>

type TokenMap = {
    color: ColorToken
    dimension: DimensionToken
    fontFamily: FontFamilyToken
    fontWeight: FontWeightToken
    duration: DurationToken
    cubicBezier: CubicBezierToken
    number: NumberToken
    transition: TransitionToken
    shadow: ShadowToken
    gradient: GradientToken
    typography: TypographyToken
    strokeStyle: StrokeStyleToken
    border: BorderToken
    ratio: RatioToken
}

export type TokenType<$Type extends keyof TokenValueMap = keyof TokenValueMap> = Exclude<
    ValueOf<TokenMap[$Type], '$type'>,
    undefined
>

export type Token<$Type extends keyof TokenValueMap = keyof TokenValueMap> = DesignToken<$Type>

export type PureToken<$Type extends keyof TokenValueMap = keyof TokenValueMap> = Exclude<
    Token<$Type>,
    { $value: ReferenceValue }
>

export type PureTokenValue<$Type extends keyof TokenValueMap = keyof TokenValueMap> = Exclude<
    TokenValueMap[$Type],
    { $value: ReferenceValue }
>

export type StrictToken = WithRequired<Token, '$type'>
export type LooseToken = ModifyProperties<Token, { $type: string; $value: any }>

export type TokenValue<$Type extends keyof TokenValueMap = keyof TokenValueMap> =
    PureToken<$Type>['$value']

export type TokenCompositeValue = Exclude<
    | TypographyToken['$value']
    | ShadowToken['$value']
    | GradientToken['$value']
    | TransitionToken['$value']
    | StrokeStyleToken['$value']
    | BorderToken['$value'],
    ReferenceValue
>

export type TokenGroup = BaseTokenProperties<TokenType> & {
    [key: string]: Token | TokenGroup
}

/**
 * Transform Types
 */

type NameTransformerMap = {
    camel: <Name extends string = string>(name: Name) => CamelCase<Name>
    kebab: <Name extends string = string>(name: Name) => KebabCase<Name>
    pascal: <Name extends string = string>(name: Name) => PascalCase<Name>
    snake: <Name extends string = string>(name: Name) => SnakeCase<Name>
}

type NameTransformType = keyof NameTransformerMap
type TransformType = TokenType | NameTransformType

type Transformer<T extends TransformType = TransformType> =
    T extends NameTransformType ? NameTransform<T>
    : T extends TokenType ? TokenTransform<T>
    : never

export type Transform<T extends TransformType = TransformType> = {
    name: string
    filter?: (arg: Token) => boolean
} & Transformer<T>

export type TransformGroup = {
    name: string
    transforms: Transform[]
}

// type TokenTransformType<T extends TokenType> = `css/${KebabCase<T>}`
export type TokenTransform<T extends TokenType> = {
    type: `css/${KebabCase<T>}`
    transformer: (token: Token) => Token
}

export type NameTransform<T extends NameTransformType> = {
    type: `name/${KebabCase<T>}`
    transformer: NameTransformerMap[T]
}

export type CustomPropertyTransform<T extends TokenType = TokenType> = {
    name: string
    filter?: (arg: Token) => boolean
} & TokenCustomPropertyTransform<T>

export type TokenCustomPropertyTransform<T extends TokenType> = {
    type: `css/${KebabCase<T>}`
    transformer: (
        key: string,
        token: Token,
    ) => { [key: `--${KebabCase<string>}`]: string | number | boolean }
}

export type MetadataExtension = {
    baseClassNames: string[]
    customPropertyPrefix: 'string'
    directive: 'theme' | 'utility' | null
    properties: string[]
    parentSelector?: string | null
    // statePrefix: string | null
}

export type TokenJSON = {
    theme: { [key: string]: TokenGroup }
}
