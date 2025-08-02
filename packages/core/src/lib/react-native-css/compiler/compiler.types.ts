import type {
    AnimationDirection,
    AnimationFillMode,
    AnimationPlayState,
    MediaFeatureNameFor_MediaFeatureId,
    PropertyId,
} from 'lightningcss'
import { ValueOf } from 'type-fest'

import { BaseTokenProperties } from '../../design-tokens/types'
import { RNStyleProperty } from '../../restyle/restyle.types'
import { STYLE_FUNCTION_SYMBOL, VAR_SYMBOL } from '../runtime/constants'

export interface CompilerOptions {
    inlineRem?: number | false
    grouping?: (string | RegExp)[]
    selectorPrefix?: string
    stylesheetOrder?: number
    features?: FeatureFlagRecord
    logger?: (message: string) => void

    /** Strip unused variables declarations. Defaults: false */
    stripUnusedVariables?: boolean

    /** @internal */
    ignorePropertyWarningRegex?: (string | RegExp)[]
    preserveVariables?: boolean
    hexColors?: boolean
    colorPrecision?: number
}

export type StyleRuleSetRecord = Record<string, StyleRuleSet>

export type SharedStyleSheetConfig = {
    ruleSets: StyleRuleSetRecord
    rootVariables?: VariableRecord
    universalVariables?: VariableRecord
    animations?: AnimationRecord_V2 // Animation_V2[]
    rem: number
    ruleOrder: number
}

/**
 * A `react-native-css` StyleSheet
 */
export type ReactNativeCssStyleSheet = ReactNativeCssStyleSheet_V2

interface ReactNativeCssStyleSheet_V2 {
    /** Feature flags */
    flags?: FeatureFlagRecord // was `f`

    /** rem */
    rem?: number // was `r`

    /** StyleRuleSets */
    ruleSets?: StyleRuleSetRecord // (readonly [string, StyleRuleSet])[] // was `s`

    /** KeyFrames */
    keyframes?: AnimationRecord_V2 // Animation_V2[] // was `k`

    /** Root Variables */
    rootVars?: Record<string, LightDarkVariable> // [string, LightDarkVariable][] // was `vr`

    /** Universal Variables */
    universalVars?: Record<string, LightDarkVariable> // [string, LightDarkVariable][] // was `uv`
}

/**********************************************************************
 * Styles
 **********************************************************************/

/**
 * The JS representation of a style object
 *
 * This CSS rule is a single StyleRuleSet, made up of multiple StyleRules
 *
 * ```css
 * .my-class {
 *   color: red;
 * }
 * ```
 * Properties are split into normal and important properties, and then split
 * into different StyleRules depending on their specificity, conditions, etc
 */
export type StyleRuleSet = StyleRule[]

export interface StyleRule {
    /** Specificity */
    specificity: SpecificityArray // was `s`

    /** Declarations */
    declarations?: StyleDeclaration[] // was `d`

    /** Variables */
    vars?: VariableDescriptorRecord // VariableDescriptor[] // was `v`

    /** Named Containers */
    containers?: string[] // was `c`

    /** Declarations use variables */
    declarationsWithVars?: number // was `dv`

    // Target override
    target?: string | string[] | false

    /**
     * Conditionals
     */

    /** MediaQuery */
    mediaQueries?: MediaCondition[] // was `mq`

    /** PseudoClassesQuery */
    pseudoClassesQuery?: PseudoClassesQuery // was `pq`

    /** Container Query */
    containerQueries?: ContainerQuery[] // was `cq`

    /** Attribute Conditions */
    attrQueries?: AttributeQuery[] // was `aq`

    /** Animations and Transitions */

    /** Animations */
    animations?: boolean // was `a`
}

export type StyleTransformFunction = <V, U extends any = V, Args extends any[] = any[]>(
    value: V,
    ...args: Args
) => U

export type PropertyName = PropertyId['property']

export type StyleFunctionDescriptor<
    P extends PropertyName,
    S extends RNStyleProperty = RNStyleProperty,
> = {
    property: P

    /**
     * Follow pattern similar to Design Tokens specification. Type can be:
     * 'border', 'color', 'cubicBezier', 'dimension', 'duration', gradient', 'number',
     * 'fontFamily', 'fontWeight', 'shadow', 'stroke', 'transition', 'Typography'
     */
    type: string
    value?: any // string | number | boolean | Record<PropertyId, any> | any[] | undefined
    func?: string | StyleTransformFunction
    styleProperty?: S
    processLast?: boolean
    // rawValue?: any // could be a CSS Token, a string, or a number... its the original value
    [STYLE_FUNCTION_SYMBOL]: boolean
}

// This is a static style object
type StaticStyleObj = Record<string, StyleDescriptor>
// A style that needs to be set
type NextStyleArgs = [StyleDescriptor, string | string[]]
// A value that can only be computed at runtime
type ComputedStyleArgs = [StyleFunction, string | string[]]
// A value that can only be computed at runtime, and only after styles have been calculated
type LazyStyleArgs = [StyleFunction, string | string[], 1]

export type StyleDeclaration = StaticStyleObj | NextStyleArgs | ComputedStyleArgs | LazyStyleArgs

/**
 * TODO: Convert StyleDescriptor to non-argument-based schema
 * based on the Design Token specification used elsewhere.
 */
// export type StyleDescriptorToken = BaseTokenProperties<string> & {
//     $value: any
// }
// export type StyleDescriptorGroup = BaseTokenProperties<string> & {
//     [key: string]: StyleDescriptorToken | StyleDescriptorGroup
// }

export type StyleDescriptorObject = { [key: string]: StyleDescriptor }

export type StyleDescriptor =
    | string
    | number
    | boolean
    | undefined
    | StyleFunction
    | StyleDescriptorObject
    | StyleDescriptor[]
// | StyleDescriptorToken

export type StyleFunction =
    | [
          Record<never, never>,
          string, // string
      ]
    | [
          Record<never, never>,
          string, // string
          undefined | StyleDescriptor[], // arguments
      ]
    | [
          Record<never, never>,
          string, // string
          undefined | StyleDescriptor[], // arguments
          1, // Should process after styles have been calculated
      ]

/**********************************************************************
 * Variables
 **********************************************************************/

/** @deprecated - use `VariableDescriptorRecord` instead */
export type VariableDescriptor = [string, StyleDescriptor]
export type VariableDescriptorRecord = Record<string, StyleDescriptor>
export type VariableRecord = Record<string, LightDarkVariable>
export type LightDarkVariable = [StyleDescriptor] | [StyleDescriptor, StyleDescriptor]

export type InlineVariable = {
    [VAR_SYMBOL]: 'inline'
    [key: string | symbol]: StyleDescriptor | undefined
}

/**********************************************************************
 * Animations V1
 **********************************************************************/

/**
 * An animation with a fallback style value
 */
export type AnimationWithDefault_V1 = [AnimationRule_V1] | [AnimationRule_V1, StyleFunction]

/**
 * A CSS Animation rule
 */
export interface AnimationRule_V1 {
    /** The animation delay. */
    delay?: number[] // was `de`

    /** The direction of the animation. */
    direction?: AnimationDirection[] // was `di`

    /** The animation duration. */
    duration?: number[] // was `du`

    /** The animation fill mode. */
    fill?: AnimationFillMode[] // was `f`

    /** The number of times the animation will run. */
    iteration?: number[] // was `i`

    /** The animation name. */
    name?: string[] // was `n`

    /** The current play state of the animation. */
    playState?: AnimationPlayState[] // was `p`

    /** The animation timeline. */
    timeline?: never[] // was `t`

    /** The easing function for the animation. */
    timingFunction?: EasingFunction[] // was `e`
}

export type AnimationKeyframes_V1 =
    | [AnimationInterpolation_V1[]]
    | [AnimationInterpolation_V1[], AnimationEasing[]]

export type AnimationEasing = number | [number, EasingFunction]

export type AnimationInterpolation_V1 =
    | [string, number[], StyleDescriptor[]]
    | [string, number[], StyleDescriptor[], number]
    | [string, number[], StyleDescriptor[], number, AnimationInterpolationType]

export type AnimationInterpolationType = 'color' | '%' | undefined

export type EasingFunction =
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | {
          type: 'cubic-bezier'
          /** The x-position of the first point in the curve. */
          x1: number
          /** The x-position of the second point in the curve. */
          x2: number
          /** The y-position of the first point in the curve. */
          y1: number
          /** The y-position of the second point in the curve. */
          y2: number
      }
    | {
          type: 'steps'

          /** The number of intervals in the function. */
          count: number // was `c`

          /** The step position. */
          position?: 'start' | 'end' | 'jump-none' | 'jump-both' // was `p`
      }

/**********************************************************************
 * Animations V2
 **********************************************************************/

/**
 * Example:
 * ```ts
 * const animation: AnimationRecord_V2 = {
 *   fadeIn: {
 *       '0': { opacity: 0 }, // value is StaticStyleObj
 *       '100': { opacity: 1 },
 *   ],
 *   spin: ['rotate', { '0': 0, '100': 360 }, 1],
 * }
 * ```
 */
export type AnimationRecord_V2 = Record<string, AnimationKeyframesRecord_V2>
export type AnimationKeyframesRecord_V2 = Record<string | number, StyleDeclaration[]>

export type Animation_V2 = [string, AnimationKeyframes_V2[]]
export type AnimationKeyframes_V2 = [string | number, StyleDeclaration[]]

/**********************************************************************
 * Transitions
 **********************************************************************/

export type TransitionRule = {
    /** Delay before the transition starts in milliseconds. */
    delay?: number[] // was `de`

    /** Duration of the transition in milliseconds. */
    duration?: number[] // was `du`

    /** Property to transition. */
    properties?: string[] // was `p`

    /** Easing function for the transition. */
    timingFunction?: EasingFunction[] // was `e`
}

/**********************************************************************
 * Conditions
 **********************************************************************/

export type MediaCondition =
    // Boolean
    | ['!!', MediaFeatureNameFor_MediaFeatureId]
    // Not
    | ['!', MediaCondition]
    // And
    | ['&', MediaCondition[]]
    // Or
    | ['|', MediaCondition[]]
    // Comparison
    | [
          MediaFeatureComparison,
          MediaFeatureNameFor_MediaFeatureId | MediaFeatureNameFor_MediaFeatureId,
          StyleDescriptor,
      ]
    // [Start, End]
    | [
          '[]',
          MediaFeatureNameFor_MediaFeatureId,
          StyleDescriptor, // Start
          MediaFeatureComparison, // Start comparison
          StyleDescriptor, // End
          MediaFeatureComparison, // End comparison
      ]

export type MediaFeatureComparison = '=' | '>' | '>=' | '<' | '<='

export interface PseudoClassesQuery {
    /** Hover */
    hover?: 1 // was `h`
    /** Active */
    active?: 1 // was `a`
    /** Focus */
    focus?: 1 // was `focus`
}

type AttributeQueryType =
    | 'attr' // Attribute
    | 'dataSet' // Data-Attribute

const AttrSelectorOperatorObj = {
    equal: '=',
    includes: '~=',
    'dash-match': '|=',
    prefix: '^=',
    suffix: '$=',
    substring: '*=',
} as const
export const AttrSelectorOperatorMap = new Map(Object.entries(AttrSelectorOperatorObj))

export type AttributeQuery =
    | [AttributeQueryType, string] // Exists
    | [AttributeQueryType, string, '!'] // Falsy
    | [AttributeQueryType, string, AttrSelectorOperatorToken, string] // Use operator
    | [AttributeQueryType, string, AttrSelectorOperatorToken, string, 'i' | 'specificity'] // Case sensitivity

// TODO: This is confusing since lightningcss defines a `AttrSelectorOperator`
// as well, which is a union of the label names for these symbols.
// Changing to `AttrSelectorOperatorToken` in the meantime.
export type AttrSelectorOperatorToken = ValueOf<typeof AttrSelectorOperatorObj> // '=' | '~=' | '|=' | '^=' | '$=' | '*='

/**********************************************************************
 * Containers
 **********************************************************************/

export interface ContainerQuery {
    /** Name */
    name?: string | null // was `n`
    mediaCondition?: MediaCondition // was `m`
    pseudoClassesQuery?: PseudoClassesQuery // was `p`
    attrQuery?: AttributeQuery[] // was `a`
}

/**********************************************************************
 * Specificity
 **********************************************************************/

/**
 * https://drafts.csswg.org/selectors/#specificity-rules
 *
 * This array is sorted by most common values when parsing a StyleSheet
 */
export type SpecificityArray = SpecificityValue[]
export type SpecificityValue = number | undefined

/**********************************************************************
 * Compiler
 **********************************************************************/

type FeatureFlags = never
export type FeatureFlagRecord = Partial<Record<FeatureFlags, boolean>>

/** @internal */
export type PathTokens = string | string[]
/** @internal */
export type StyleRuleMapping = Record<string, PathTokens>

/**
 * @internal
 */
export type LoggerOptions = {
    logger: (message: string) => void
}

/**
 * @internal
 */
export interface CompilerCollection extends CompilerOptions {
    features: FeatureFlagRecord
    rules: Map<string, StyleRule[]>
    keyframes: Map<string, AnimationKeyframes_V1 | AnimationKeyframes_V2[]>
    darkMode?: string | null
    rootVariables: VariableRecord
    universalVariables: VariableRecord
    selectorPrefix?: string
    appearanceOrder: number
    rem?: number | boolean
    varUsageCount: Map<string, number>
}
