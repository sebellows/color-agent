/**********************************************************************
 * Conditions
 **********************************************************************/

import { AttrOperation, MediaCondition } from 'lightningcss'
import { ValueOf } from 'type-fest'

/**
 * Container Query Conditions
 */
export interface ContainerQuery {
    /** Name */
    name?: string | null // was `n`
    mediaCondition?: MediaCondition // was `m`
    pseudoClassesQuery?: PseudoClassesQuery // was `p`
    attrQuery?: AttributeQuery[] // was `a`
}

/**
 * Pseudo-Class Query
 */
export interface PseudoClassesQuery {
    /** Hover */
    hover?: 1 // was `h`
    /** Active */
    active?: 1 // was `a`
    /** Focus */
    focus?: 1 // was `focus`
}

export type MediaFeatureComparison = '=' | '>' | '>=' | '<' | '<='

/**
 * Attribute Query
 */

const AttrSelectorOperatorObj = {
    equal: '=',
    includes: '~=',
    'dash-match': '|=',
    prefix: '^=',
    suffix: '$=',
    substring: '*=',
} as const

type AttrSelectorOperators = typeof AttrSelectorOperatorObj
// type AttrSelectorOperatorType = keyof AttrSelectorOperators

export const AttrSelectorOperators = AttrSelectorOperatorObj

// TODO: This is confusing since lightningcss defines a `AttrSelectorOperator`
// as well, which is a union of the label names for these symbols.
// Changing to `AttrSelectorOperationComparator` in the meantime.
// export type AttrSelectorOperationComparator = ValueOf<typeof AttrSelectorOperatorObj>

type AttributeQueryType =
    | 'attr' // Attribute
    | 'dataSet' // Data-Attribute

interface AttrQueryOperation extends AttrOperation {
    // operator: AttrSelectorOperator // same as AttrOperation['operator']
    comparator: ValueOf<AttrSelectorOperators, keyof AttrSelectorOperators>
    // value: AttrOperation['value']
}

export interface AttributeQuery extends Partial<AttrQueryOperation> {
    type: AttributeQueryType
    value: string
    operation?: AttrQueryOperation
    flags?: 'i' | 'specificity'
}

// | [AttributeQueryType, string] // Exists
// | [AttributeQueryType, string, '!'] // Falsy
// | [AttributeQueryType, string, AttrSelectorOperationComparator, string] // Use operator
// | [AttributeQueryType, string, AttrSelectorOperationComparator, string, 'i' | 'specificity'] // Case sensitivity

// export const AttrSelectorOperatorMap = new Map<AttrSelectorOperator, AttrSelectorOperationComparator>(
//     getEntries(AttrSelectorOperatorObj),
// )

/**
 * Conditionals
 */
export interface ConditionalQueries {
    /** MediaQuery */
    mediaQueries?: MediaCondition[] // was `mq`

    /** PseudoClassesQuery */
    pseudoClassesQuery?: PseudoClassesQuery // was `pq`

    /** Container Query */
    containerQueries?: ContainerQuery[] // was `cq`

    /** Attribute Conditions */
    attrQueries?: AttributeQuery[] // was `aq`
}

// export type MediaCondition =
//     // Boolean
//     | ['!!', MediaFeatureNameFor_MediaFeatureId]
//     // Not
//     | ['!', MediaCondition]
//     // And
//     | ['&', MediaCondition[]]
//     // Or
//     | ['|', MediaCondition[]]
//     // Comparison
//     | [
//           MediaFeatureComparison,
//           MediaFeatureNameFor_MediaFeatureId | MediaFeatureNameFor_MediaFeatureId,
//           StyleDescriptor,
//       ]
//     // [Start, End]
//     | [
//           '[]',
//           MediaFeatureNameFor_MediaFeatureId,
//           StyleDescriptor, // Start
//           MediaFeatureComparison, // Start comparison
//           StyleDescriptor, // End
//           MediaFeatureComparison, // End comparison
//       ]
