import type { SpecificityArray, StyleRule } from '../../compiler'
import type { InlineStyleRecord } from '../runtime.types'

export const Specificity = {
    Order: 0,
    ClassName: 1,
    Important: 2,
    Inline: 3,
    PseudoElements: 4,
    // Id: 0, - We don't support ID yet
    // StyleSheet: 0, - We don't support multiple stylesheets
}

const Important = Specificity.Important
const Inline = Specificity.Inline
const PseudoElements = Specificity.PseudoElements
const ClassName = Specificity.ClassName
const Order = Specificity.Order

export const inlineSpecificity: SpecificityArray = []
inlineSpecificity[Specificity.Inline] = 1

export const specificityCompareFn = (
    a: StyleRule | InlineStyleRecord,
    b: StyleRule | InlineStyleRecord,
) => {
    const aSpec = a.specificity ? a.specificity : inlineSpecificity
    const bSpec = b.specificity ? b.specificity : inlineSpecificity

    if (aSpec[Important] !== bSpec[Important]) {
        return (aSpec[Important] || 0) - (bSpec[Important] || 0)
    } else if (aSpec[Inline] !== bSpec[Inline]) {
        return (aSpec[Inline] || 0) - (bSpec[Inline] || 0)
    } else if (aSpec[PseudoElements] !== bSpec[PseudoElements]) {
        return (aSpec[PseudoElements] || 0) - (bSpec[PseudoElements] || 0)
    } else if (aSpec[ClassName] !== bSpec[ClassName]) {
        return (aSpec[ClassName] || 0) - (bSpec[ClassName] || 0)
    } else if (aSpec[Order] !== bSpec[Order]) {
        return (aSpec[Order] || 0) - (bSpec[Order] || 0)
    } else {
        return 0
    }
}
