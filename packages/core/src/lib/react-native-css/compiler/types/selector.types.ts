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
