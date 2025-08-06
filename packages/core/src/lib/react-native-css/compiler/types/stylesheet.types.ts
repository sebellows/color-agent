import { MediaCondition } from 'lightningcss'

import { ContainerQuery } from '../types'
import { AnimationRecord_V2 } from './animation.types'
import { FeatureFlagRecord } from './compiler.types'
import { AttributeQuery, PseudoClassesQuery } from './query.types'
import { SpecificityArray } from './selector.types'
import {
    LightDarkVariable,
    StyleDeclaration,
    VariableDescriptorRecord,
    VariableRecord,
} from './style-functions'

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
