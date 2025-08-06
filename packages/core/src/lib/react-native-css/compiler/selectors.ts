import { camelCase } from '@coloragent/utils'
import type { MediaCondition, Selector, SelectorList } from 'lightningcss'
import { CamelCase } from 'type-fest'

import { RNStyleProperty } from '../../restyle/restyle.types'
import { Specificity } from '../runtime/utils/specificity'
import type {
    AttributeQuery,
    CompilerOptions,
    ContainerQuery,
    // MediaCondition,
    PseudoClassesQuery,
    SpecificityArray,
} from './types'
import { AttrSelectorOperatorMap } from './types'

export type NormalizeSelector =
    | ClassNameSelector
    | {
          type: 'rootVariables' | 'universalVariables'
          variant: 'light' | 'dark'
      }

type ClassNameSelector = {
    type: 'className'
    specificity: SpecificityArray
    className: string
    mediaQuery?: MediaCondition[]
    containerQuery?: ContainerQuery[]
    pseudoClassesQuery?: PseudoClassesQuery
    attributeQuery?: AttributeQuery[]
}

/**
 * Turns a CSS selector into a `react-native-css` selector.
 */
export function getSelectors(
    selectorList: SelectorList,
    isDarkMode: boolean,
    options: CompilerOptions,
    selectors: NormalizeSelector[] = [],
) {
    for (let cssSelector of selectorList) {
        // Ignore `:is()`, and just process its selectors
        if (isPseudoClass(cssSelector)) {
            getSelectors(cssSelector[0].selectors, isDarkMode, options, selectors)
        } else if (isRootVariableSelector(cssSelector)) {
            selectors.push({
                type: 'rootVariables',
                variant: isDarkMode ? 'dark' : 'light',
            })
        } else if (
            // Matches: `.dark:root {} || :root[class~="dark"]`
            isRootDarkVariableSelector(cssSelector)
        ) {
            selectors.push({
                type: 'rootVariables',
                variant: 'dark',
            })
        } else if (isGlobalVariableSelector(cssSelector)) {
            selectors.push({
                type: 'universalVariables',
                variant: isDarkMode ? 'dark' : 'light',
            })
        } else {
            const selector = classNameSelector(cssSelector, options)

            if (selector == null) continue

            selectors.push(selector)
        }
    }

    return selectors
}

export function normalizeTokenSelector(selector: string, prefix: string) {
    if (selector && selector.startsWith(prefix)) {
        selector = selector.slice(prefix.length)
    }

    return selector
}

function classNameSelector(selector: Selector, options: CompilerOptions): ClassNameSelector | null {
    let primaryClassName: string | undefined
    const specificity: SpecificityArray = []
    let mediaQuery: MediaCondition[] | undefined
    let containerQuery: ContainerQuery[] | undefined
    let attributeQuery: AttributeQuery[] | undefined
    let pseudoClassesQuery: PseudoClassesQuery | undefined

    let currentContainerQuery: ContainerQuery | undefined

    let isInClassBlock = false
    let newBlock = false

    function getAttributeQuery(): AttributeQuery[] {
        if (newBlock) {
            currentContainerQuery ??= {}
        }

        if (currentContainerQuery) {
            currentContainerQuery.attrQuery ??= []
            return currentContainerQuery.attrQuery
        }

        attributeQuery ??= []
        return attributeQuery
    }

    function getPseudoClassesQuery() {
        if (newBlock) {
            currentContainerQuery ??= {}
        }

        if (currentContainerQuery) {
            currentContainerQuery.pseudoClassesQuery ??= {}
            return currentContainerQuery.pseudoClassesQuery
        }

        pseudoClassesQuery ??= {}
        return pseudoClassesQuery
    }

    /** Loop over each token in reverse order. */
    for (const component of selector.reverse()) {
        switch (component.type) {
            case 'universal':
            case 'namespace':
            case 'nesting':
            case 'id':
            case 'pseudo-element':
                // We don't support these selectors at all
                return null
            case 'class': {
                if (!primaryClassName) {
                    primaryClassName = component.name
                } else if (isInClassBlock) {
                    getAttributeQuery().unshift(['attr', 'className', '*=', component.name])
                } else if (component.name !== options.selectorPrefix) {
                    if (currentContainerQuery?.name) {
                        getAttributeQuery().unshift(['attr', 'className', '*=', component.name])
                    } else {
                        currentContainerQuery ??= {}
                        currentContainerQuery.name = component.name

                        containerQuery ??= []
                        containerQuery.unshift(currentContainerQuery)
                    }
                }

                isInClassBlock = true
                newBlock = false

                specificity[Specificity.ClassName] = (specificity[Specificity.ClassName] ?? 0) + 1

                break
            }
            case 'pseudo-class': {
                specificity[Specificity.ClassName] = (specificity[Specificity.ClassName] ?? 0) + 1

                switch (component.kind) {
                    case 'hover': {
                        getPseudoClassesQuery().hover = 1
                        break
                    }
                    case 'active': {
                        getPseudoClassesQuery().active = 1
                        break
                    }
                    case 'focus': {
                        getPseudoClassesQuery().focus = 1
                        break
                    }
                    case 'disabled': {
                        getAttributeQuery().push({ type: 'attr', value: 'disabled' })
                        break
                    }
                    case 'empty': {
                        getAttributeQuery().push(['attr', 'children', '!'])
                        break
                    }
                    default: {
                        // We don't support other pseudo-classes
                        return null
                    }
                }
                break
            }
            case 'attribute': {
                // We don't support attribute selectors as standalone selectors
                // Except for a top level [dir] selector
                // Turn attribute selectors into AttributeConditions
                specificity[Specificity.ClassName] = (specificity[Specificity.ClassName] ?? 0) + 1

                // [data-*] are turned into `dataSet` queries
                // Everything else is turned into `attribute` queries
                // let attr: AttributeQuery['type'] | undefined
                const isDataSet = component.name.startsWith('data-')
                const prop = isDataSet ? component.name.replace('data-', '') : component.name
                const attributeQuery: AttributeQuery = {
                    type: component.name.startsWith('data-') ? 'dataSet' : 'attr',
                    property: toRNProperty(prop),
                }
                // component.name.startsWith('data-') ?
                //     ['dataSet', toRNProperty(component.name.replace('data-', ''))]
                // :   ['attr', toRNProperty(component.name)]

                if (component.operation) {
                    const operator = AttrSelectorOperatorMap.get(component.operation.operator)

                    if (operator) {
                        attributeQuery.push(operator, component.operation.value)
                    }
                }

                getAttributeQuery().push(attributeQuery)
                break
            }
            case 'type': {
                /**
                 * We only support type selectors as part of the selector prefix
                 * For example: `html .my-class`
                 *
                 * NOTE: We ignore specificity for this
                 */
                if (component.name === options.selectorPrefix) {
                    break
                }
                return null
            }
            case 'combinator': {
                // We only support the descendant combinator
                if (component.value === 'descendant') {
                    isInClassBlock = false
                    newBlock = true
                    currentContainerQuery = undefined
                    break
                }

                return null
            }
        }
    }

    if (!primaryClassName) {
        // No class name found, return null
        return null
    }

    return {
        type: 'className',
        specificity: specificity,
        className: primaryClassName,
        mediaQuery,
        containerQuery,
        pseudoClassesQuery,
        attributeQuery,
    }
}

function isPseudoClass(
    selector: Selector,
): selector is [{ type: 'pseudo-class'; kind: 'is'; selectors: Selector[] }] {
    return (
        selector.length === 1 && selector[0]?.type === 'pseudo-class' && selector[0].kind === 'is'
    )
}

// Matches: `:root {}`
function isRootVariableSelector([first, second]: Selector) {
    return first && !second && first.type === 'pseudo-class' && first.kind === 'root'
}

// Matches: `* {}`
function isGlobalVariableSelector([first, second]: Selector) {
    return first && !second && first.type === 'universal'
}

// Matches: `.dark:root  {}`
function isRootDarkVariableSelector([first, second]: Selector) {
    return (
        first &&
        second &&
        // .dark:root {}
        ((first.type === 'class' && second.type === 'pseudo-class' && second.kind === 'root') ||
            // :root[class~=dark] {}
            (first.type === 'pseudo-class' &&
                first.kind === 'root' &&
                second.type === 'attribute' &&
                second.name === 'class' &&
                second.operation &&
                ['includes', 'equal'].includes(second.operation.operator)))
    )
}

export function toRNProperty<T extends string>(prop: T): RNStyleProperty {
    // TODO: ixnay on the explicit coersion
    return camelCase(prop) as RNStyleProperty
    // return prop.replace(/^-rn-/, '').replace(/-./g, x => x[1]!.toUpperCase()) as CamelCase<T>
}
