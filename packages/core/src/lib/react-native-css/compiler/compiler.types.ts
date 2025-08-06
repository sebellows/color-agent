// import { getEntries } from '@coloragent/utils'
// import type {
//     AnimationDirection,
//     AnimationFillMode,
//     AnimationPlayState,
//     AttrSelectorOperator,
//     CssColor,
//     Declaration,
//     MediaCondition,
//     PropertyId,
//     TokenOrValue,
// } from 'lightningcss'
// import { SetRequired, ValueOf } from 'type-fest'

// import { STYLE_FUNCTION_SYMBOL, VAR_SYMBOL } from '../runtime/constants'
// import { RenderGuard } from '../runtime/native/conditions/guards'
// import { Getter, VariableContextValue } from '../runtime/native/reactivity'

// export interface CompilerOptions {
//     baseFontSize?: number
//     grouping?: (string | RegExp)[]
//     selectorPrefix?: string
//     stylesheetOrder?: number
//     features?: FeatureFlagRecord
//     logger?: (message: string) => void

//     /** Strip unused variables declarations. Defaults: false */
//     stripUnusedVariables?: boolean

//     /** @internal */
//     ignorePropertyWarningRegex?: (string | RegExp)[]
//     preserveVariables?: boolean
//     colorPrecision?: number
// }

// export type StyleRuleSetRecord = Record<string, StyleRuleSet>

// export type SharedStyleSheetConfig = {
//     ruleSets: StyleRuleSetRecord
//     rootVariables?: VariableRecord
//     universalVariables?: VariableRecord
//     animations?: AnimationRecord_V2 // Animation_V2[]
//     rem: number
//     ruleOrder: number
// }

// /**
//  * A `react-native-css` StyleSheet
//  */
// export type ReactNativeCssStyleSheet = ReactNativeCssStyleSheet_V2

// interface ReactNativeCssStyleSheet_V2 {
//     /** Feature flags */
//     flags?: FeatureFlagRecord // was `f`

//     /** rem */
//     rem?: number // was `r`

//     /** StyleRuleSets */
//     ruleSets?: StyleRuleSetRecord // (readonly [string, StyleRuleSet])[] // was `s`

//     /** KeyFrames */
//     keyframes?: AnimationRecord_V2 // Animation_V2[] // was `k`

//     /** Root Variables */
//     rootVars?: Record<string, LightDarkVariable> // [string, LightDarkVariable][] // was `vr`

//     /** Universal Variables */
//     universalVars?: Record<string, LightDarkVariable> // [string, LightDarkVariable][] // was `uv`
// }

// /**********************************************************************
//  * Styles
//  **********************************************************************/

// /**
//  * The JS representation of a style object
//  *
//  * This CSS rule is a single StyleRuleSet, made up of multiple StyleRules
//  *
//  * ```css
//  * .my-class {
//  *   color: red;
//  * }
//  * ```
//  * Properties are split into normal and important properties, and then split
//  * into different StyleRules depending on their specificity, conditions, etc
//  */
// export type StyleRuleSet = StyleRule[]

// export interface StyleRule {
//     /** Specificity */
//     specificity: SpecificityArray // was `s`

//     /** Declarations */
//     declarations?: StyleDeclaration[] // was `d`

//     /** Variables */
//     vars?: VariableDescriptorRecord // VariableDescriptor[] // was `v`

//     /** Named Containers */
//     containers?: string[] // was `c`

//     /** Declarations use variables */
//     declarationsWithVars?: number // was `dv`

//     // Target override
//     target?: string | string[] | false

//     /**
//      * Conditionals
//      */

//     /** MediaQuery */
//     mediaQueries?: MediaCondition[] // was `mq`

//     /** PseudoClassesQuery */
//     pseudoClassesQuery?: PseudoClassesQuery // was `pq`

//     /** Container Query */
//     containerQueries?: ContainerQuery[] // was `cq`

//     /** Attribute Conditions */
//     attrQueries?: AttributeQuery[] // was `aq`

//     /** Animations and Transitions */

//     /** Animations */
//     animations?: boolean // was `a`
// }

// export type PropertyName = PropertyId['property']

// export type ResolveValueOptions = {
//     castToArray?: boolean
//     inheritedVariables?: VariableContextValue
//     inlineVariables?: InlineVariable | undefined
//     renderGuards?: RenderGuard[]
//     variableHistory?: Set<string>
// }

// export type SimpleResolveValue = (
//     styleFn: StyleFunction,
//     value: StyleDescriptor,
//     castToArray?: boolean,
// ) => any

// export type StyleFunctionResolver<T extends StyleTokenType = StyleTokenType> = (
//     resolveValue: SimpleResolveValue,

//     /**
//      * The token value to either parse, return, or pass to the `resolveValue` function
//      */
//     value: StyleFunctionDescriptor<T>,

//     /**
//      * The getter is passed to the callback which was passed to an Observable instance.
//      *
//      * @example
//      * ```ts
//      * const obs = observable((read: Getter) => resolve(read, sortedRules))
//      * ```
//      */
//     get: Getter,

//     /**
//      * Options for dealing with and resolving CSS variables (mostly)
//      */
//     options: ResolveValueOptions,
// ) => StyleDescriptor | undefined

// /**
//  * We use an object to register the style resolver functions so we can
//  * refer to them by name/key, rather than directly calling them every time.
//  */
// export type StyleFunctionsRegistry = Readonly<Record<string, StyleFunctionResolver>>

// /**
//  * The key a StyleFunctionResolver was registered under, e.g.:
//  * `em`, `rem`, `vw`, etc.
//  */
// export type StyleFunction = keyof StyleFunctionsRegistry

// type ColorTokenValue = {
//     colorSpace: Extract<CssColor, { alpha?: number }>
//     components: [number, number, number]
//     alpha?: number
// }

// type TokenValueMap = {
//     color: ColorTokenValue
// }

// export type TokenDescriptor<$T extends keyof TokenValueMap = keyof TokenValueMap> = {
//     $type: $T
//     $value: TokenValueMap[$T]
// }

// type TokenWithValue = SetRequired<TokenOrValue, 'type' | 'value'>

// export type StyleTokenType = TokenOrValue['type']

// export type GetTokenOrValue<T extends StyleTokenType> = Extract<TokenOrValue, { type: T }>

// type NestedTokenType<
//     T extends StyleTokenType,
//     TToken extends GetTokenOrValue<T> = GetTokenOrValue<T>,
// > = TToken extends TokenWithValue ?
//     TToken['value'] extends { type: infer NestedType } ?
//         NestedType
//     :   never
// :   never

// export type StyleFunctionDescriptor<
//     T extends StyleTokenType = StyleTokenType,
//     VType extends NestedTokenType<T> = NestedTokenType<T>,
// > = {
//     type: T

//     /** The type of the token value if that value is another token. */
//     valueType?: VType

//     /** The name of a registered function that will parse a value */
//     func: StyleFunction | TokenDescriptor

//     /**
//      * If `func` refers to a registered function, set the value or function arguments
//      * to be applied to that function here.
//      */
//     value: StyleDescriptor

//     // styleProperty?: S

//     /** Will the value be computed at runtime? */
//     computed?: boolean

//     /** Should the value be computed only after styles have been calculated? */
//     processLast?: boolean
//     // rawValue?: any // could be a CSS Token, a string, or a number... its the original value
//     [STYLE_FUNCTION_SYMBOL]: boolean
// }

// // type StringKeyOf<T, K extends keyof T = keyof T> = K extends string ? K : never

// type Property = Declaration['property']
// export type DeclarationToken<P extends Property> = Extract<Declaration, { property: P }>
// export type DeclarationValue<
//     P extends Property,
//     Decl extends Declaration = Extract<Declaration, { property: P }>,
// > = Decl['value']

// export interface RestyleFunctionContainer<P extends Property> {
//     shorthand: boolean
//     property: P
//     enum?: string[] | { [key: string]: string }
//     transform: <V = any>(declaration: DeclarationValue<P>, builder: StyleSheet) => V
// }

// // This is a static style object
// // type StaticStyleObj = Record<string, StyleDescriptor>
// // // A style that needs to be set
// // type NextStyleArgs = [StyleDescriptor, string | string[]]
// // // A value that can only be computed at runtime
// // type ComputedStyleArgs = [StyleFunction, string | string[]]
// // // A value that can only be computed at runtime, and only after styles have been calculated
// // type LazyStyleArgs = [StyleFunction, string | string[], 1]

// export type StyleDeclaration = {
//     // If descriptor is:
//     // - An object composed of keys with primitive values set
//     // - A StyleFunctionDescriptor, the value will be computed at runtime,
//     // - If a primitive value, its a style that needs to be set
//     type: 'static-object' | 'descriptor' | 'value'
//     descriptor: Record<string, StyleDescriptor> | StyleFunctionDescriptor | StyleDescriptor
//     propertyPath?: string | string[]
//     delay?: boolean
// } // StaticStyleObj | NextStyleArgs | ComputedStyleArgs | LazyStyleArgs

// export type StyleDescriptorRecord = { [key: string]: StyleDescriptor }

// export type StyleValue = string | number | boolean | undefined

// export type StyleDescriptor =
//     | string
//     | number
//     | boolean
//     | undefined
//     // | StyleFunction
//     | StyleFunctionDescriptor
//     | StyleDescriptorRecord
//     | StyleDescriptor[]
// // | StyleDescriptorToken

// export type RNStyleDescriptor<P extends PropertyName> = {
//     property: P
//     value: StyleDescriptor
//     declarations: any
//     forceTuple?: boolean
//     delayed?: boolean // may already be defined in value if value is a StyleFunctionDescriptor
// }

// // export type StyleFunction =
// //     | [
// //           Record<never, never>,
// //           string, // string
// //       ]
// //     | [
// //           Record<never, never>,
// //           string, // string
// //           undefined | StyleDescriptor[], // arguments
// //       ]
// //     | [
// //           Record<never, never>,
// //           string, // string
// //           undefined | StyleDescriptor[], // arguments
// //           1, // Should process after styles have been calculated
// //       ]

// /**********************************************************************
//  * Variables
//  **********************************************************************/

// /** @deprecated - use `VariableDescriptorRecord` instead */
// export type VariableDescriptor = [string, StyleDescriptor]
// export type VariableDescriptorRecord = Record<string, StyleDescriptor>
// export type VariableRecord = Record<string, LightDarkVariable>
// export type LightDarkVariable = [StyleDescriptor] | [StyleDescriptor, StyleDescriptor]

// export type InlineVariable = {
//     [VAR_SYMBOL]: 'inline'
//     [key: string | symbol]: StyleDescriptor | undefined
// }

// /**********************************************************************
//  * Animations V1
//  **********************************************************************/

// /**
//  * An animation with a fallback style value
//  */
// export type AnimationWithDefault_V1 = [AnimationRule_V1] | [AnimationRule_V1, StyleFunction]

// /**
//  * A CSS Animation rule
//  */
// export interface AnimationRule_V1 {
//     /** The animation delay. */
//     delay?: number[] // was `de`

//     /** The direction of the animation. */
//     direction?: AnimationDirection[] // was `di`

//     /** The animation duration. */
//     duration?: number[] // was `du`

//     /** The animation fill mode. */
//     fill?: AnimationFillMode[] // was `f`

//     /** The number of times the animation will run. */
//     iteration?: number[] // was `i`

//     /** The animation name. */
//     name?: string[] // was `n`

//     /** The current play state of the animation. */
//     playState?: AnimationPlayState[] // was `p`

//     /** The animation timeline. */
//     timeline?: never[] // was `t`

//     /** The easing function for the animation. */
//     timingFunction?: EasingFunction[] // was `e`
// }

// export type AnimationKeyframes_V1 =
//     | [AnimationInterpolation_V1[]]
//     | [AnimationInterpolation_V1[], AnimationEasing[]]

// export type AnimationEasing = number | [number, EasingFunction]

// export type AnimationInterpolation_V1 =
//     | [string, number[], StyleDescriptor[]]
//     | [string, number[], StyleDescriptor[], number]
//     | [string, number[], StyleDescriptor[], number, AnimationInterpolationType]

// export type AnimationInterpolationType = 'color' | '%' | undefined

// export type EasingFunction =
//     | 'linear'
//     | 'ease'
//     | 'ease-in'
//     | 'ease-out'
//     | 'ease-in-out'
//     | {
//           type: 'cubic-bezier'
//           /** The x-position of the first point in the curve. */
//           x1: number
//           /** The x-position of the second point in the curve. */
//           x2: number
//           /** The y-position of the first point in the curve. */
//           y1: number
//           /** The y-position of the second point in the curve. */
//           y2: number
//       }
//     | {
//           type: 'steps'

//           /** The number of intervals in the function. */
//           count: number // was `c`

//           /** The step position. */
//           position?: 'start' | 'end' | 'jump-none' | 'jump-both' // was `p`
//       }

// /**********************************************************************
//  * Animations V2
//  **********************************************************************/

// /**
//  * Example:
//  * ```ts
//  * const animation: AnimationRecord_V2 = {
//  *   fadeIn: {
//  *       '0': { opacity: 0 }, // value is StaticStyleObj
//  *       '100': { opacity: 1 },
//  *   ],
//  *   spin: ['rotate', { '0': 0, '100': 360 }, 1],
//  * }
//  * ```
//  */
// export type AnimationRecord_V2 = Record<string, AnimationKeyframesRecord_V2>
// export type AnimationKeyframesRecord_V2 = Record<string | number, StyleDeclaration[]>

// export type Animation_V2 = [string, AnimationKeyframes_V2[]]
// export type AnimationKeyframes_V2 = [string | number, StyleDeclaration[]]

// /**********************************************************************
//  * Transitions
//  **********************************************************************/

// export type TransitionRule = {
//     /** Delay before the transition starts in milliseconds. */
//     delay?: number[] // was `de`

//     /** Duration of the transition in milliseconds. */
//     duration?: number[] // was `du`

//     /** Property to transition. */
//     properties?: string[] // was `p`

//     /** Easing function for the transition. */
//     timingFunction?: EasingFunction[] // was `e`
// }

// /**********************************************************************
//  * Conditions
//  **********************************************************************/

// // export type MediaCondition =
// //     // Boolean
// //     | ['!!', MediaFeatureNameFor_MediaFeatureId]
// //     // Not
// //     | ['!', MediaCondition]
// //     // And
// //     | ['&', MediaCondition[]]
// //     // Or
// //     | ['|', MediaCondition[]]
// //     // Comparison
// //     | [
// //           MediaFeatureComparison,
// //           MediaFeatureNameFor_MediaFeatureId | MediaFeatureNameFor_MediaFeatureId,
// //           StyleDescriptor,
// //       ]
// //     // [Start, End]
// //     | [
// //           '[]',
// //           MediaFeatureNameFor_MediaFeatureId,
// //           StyleDescriptor, // Start
// //           MediaFeatureComparison, // Start comparison
// //           StyleDescriptor, // End
// //           MediaFeatureComparison, // End comparison
// //       ]

// export type MediaFeatureComparison = '=' | '>' | '>=' | '<' | '<='

// export interface PseudoClassesQuery {
//     /** Hover */
//     hover?: 1 // was `h`
//     /** Active */
//     active?: 1 // was `a`
//     /** Focus */
//     focus?: 1 // was `focus`
// }

// type AttributeQueryType =
//     | 'attr' // Attribute
//     | 'dataSet' // Data-Attribute

// const AttrSelectorOperatorObj = {
//     equal: '=',
//     includes: '~=',
//     'dash-match': '|=',
//     prefix: '^=',
//     suffix: '$=',
//     substring: '*=',
// } as const

// // TODO: This is confusing since lightningcss defines a `AttrSelectorOperator`
// // as well, which is a union of the label names for these symbols.
// // Changing to `AttrSelectorOperatorToken` in the meantime.
// export type AttrSelectorOperatorToken = ValueOf<typeof AttrSelectorOperatorObj>

// export const AttrSelectorOperatorMap = new Map<AttrSelectorOperator, AttrSelectorOperatorToken>(
//     getEntries(AttrSelectorOperatorObj),
// )

// export type AttributeQuery = {
//     type: AttributeQueryType
// }
// // | [AttributeQueryType, string] // Exists
// // | [AttributeQueryType, string, '!'] // Falsy
// // | [AttributeQueryType, string, AttrSelectorOperatorToken, string] // Use operator
// // | [AttributeQueryType, string, AttrSelectorOperatorToken, string, 'i' | 'specificity'] // Case sensitivity

// /**********************************************************************
//  * Containers
//  **********************************************************************/

// export interface ContainerQuery {
//     /** Name */
//     name?: string | null // was `n`
//     mediaCondition?: MediaCondition // was `m`
//     pseudoClassesQuery?: PseudoClassesQuery // was `p`
//     attrQuery?: AttributeQuery[] // was `a`
// }

// /**********************************************************************
//  * Specificity
//  **********************************************************************/

// /**
//  * https://drafts.csswg.org/selectors/#specificity-rules
//  *
//  * This array is sorted by most common values when parsing a StyleSheet
//  */
// export type SpecificityArray = SpecificityValue[]
// export type SpecificityValue = number | undefined

// /**********************************************************************
//  * Compiler
//  **********************************************************************/

// type FeatureFlags = never
// export type FeatureFlagRecord = Partial<Record<FeatureFlags, boolean>>

// /** @internal */
// export type PathTokens = string | string[]
// /** @internal */
// export type StyleRuleMapping = Record<string, PathTokens>

// /**
//  * @internal
//  */
// export type LoggerOptions = {
//     logger: (message: string) => void
// }
