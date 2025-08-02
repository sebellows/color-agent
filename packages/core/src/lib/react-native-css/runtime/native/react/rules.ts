import { get, isObject } from '@coloragent/utils'

import { isInlineVariable, type InlineVariable, type StyleRule } from '../../../compiler'
import { DEFAULT_CONTAINER_NAME, INLINE_RULE_SYMBOL, VAR_SYMBOL } from '../../constants'
import { testRule } from '../conditions'
import type { RenderGuard } from '../conditions/guards'
import { StyleCollection } from '../injection'
import {
    activeFamily,
    containerLayoutFamily,
    focusFamily,
    hoverFamily,
    weakFamily,
    type VariableContextValue,
} from '../reactivity'
import { stylesFamily } from '../styles'
import type { ComponentState, Config } from './use-native-css'

export function updateRules(
    state: ComponentState,
    // Either update the state with new props or use the current props
    currentProps = state.currentProps ?? {},
    inheritedVariables = state.inheritedVariables,
    inheritedContainers = state.inheritedContainers,
    forceUpdate = false,
    isRerender = true,
): ComponentState {
    const guards: RenderGuard[] = []
    const rules = new Set<StyleRule | InlineVariable | VariableContextValue>()
    if (forceUpdate) {
        state = { ...state, guards, currentProps }
    }

    let usesVariables = false

    let variables = state.variables ? inheritedVariables : undefined
    let containers = state.containers ? inheritedContainers : undefined
    const inlineVariables = new Set<InlineVariable>()

    let animated = false

    for (const config of state.configs) {
        const source = currentProps?.[config.source]
        const shallowTarget = Array.isArray(config.target) ? config.target[0] : config.target

        guards.push(['attr', config.source, source])
        if (shallowTarget) {
            guards.push(['attr', shallowTarget, currentProps?.[shallowTarget]])
        }

        const styleRuleSet = []

        if (typeof source === 'string') {
            const classNames = source.split(/\s+/)
            for (const className of classNames) {
                styleRuleSet.push(...StyleCollection.styles(className).get(state.ruleEffect))
            }
        }

        const target = !config.target ? '' : get(currentProps, config.target)
        if (target) {
            if (Array.isArray(target)) {
                for (const item of target) {
                    if (VAR_SYMBOL in item) {
                        inlineVariables.add(item)
                    } else if (
                        INLINE_RULE_SYMBOL in item &&
                        typeof item[INLINE_RULE_SYMBOL] === 'string'
                    ) {
                        pushInlineRule(state, item, styleRuleSet)
                    }
                }
            } else if (isInlineVariable(target)) {
                inlineVariables.add(target)
            } else if (
                isObject(target) &&
                INLINE_RULE_SYMBOL in target &&
                typeof target[INLINE_RULE_SYMBOL] === 'string'
            ) {
                pushInlineRule(state, target, styleRuleSet)
            }
        }

        for (let rule of styleRuleSet) {
            // Even if a rule does not match, make sure we register that it could set
            // a variable or container or be animated.
            if (rule.vars) usesVariables = true
            if (rule.containers) containers ??= inheritedContainers
            if (rule.animations) animated = true

            usesVariables ||= Boolean(rule.declarationsWithVars)

            if (!testRule(rule, state.ruleEffect, currentProps, guards, inheritedContainers)) {
                continue
            }

            if (rule.vars) {
                // We're going to set a value, so we need to create a new object
                if (variables === inheritedVariables) {
                    variables = { ...inheritedVariables }
                } else {
                    variables ??= { ...inheritedVariables }
                }

                for (const v of rule.vars) {
                    variables![v[0]] = v[1]
                }
            }

            if (rule.containers) {
                // We're going to set a value, so we need to create a new object
                if (containers === inheritedContainers) {
                    containers = {
                        ...inheritedContainers,
                        // This container becomes the default container
                        [DEFAULT_CONTAINER_NAME]: state.ruleEffect,
                    }
                }

                // This this component as the named container
                for (const name of rule.containers) {
                    containers![name] = state.ruleEffect
                }

                // Enable hover/active/focus/layout handlers
                hoverFamily(state.ruleEffect)
                activeFamily(state.ruleEffect)
                focusFamily(state.ruleEffect)
                containerLayoutFamily(state.ruleEffect)
            }

            if (rule.animations) {
                animated = true
            }

            // Rules normally target style. If the target is not style, we need to create a new rule.
            if (config.target !== 'style') {
                rule = getRuleVariation(rule)(config)
            }

            // Add the rule to the set and update the hash
            rules.add(rule)
        }

        if (process.env.NODE_ENV !== 'production') {
            if (isRerender) {
                let pressable = activeFamily.has(state.ruleEffect)

                if (Boolean(variables) !== Boolean(state.variables)) {
                    throw new Error(
                        `ReactNativeCss: Cannot dynamically add a variable context. '${source}' was added after the initial render.
Use modifier ('hover:my-var', 'active:my-var', etc) to ensure it present in the initial render`,
                    )
                }

                if (Boolean(containers) !== Boolean(state.containers)) {
                    throw new Error(
                        `ReactNativeCss: Cannot dynamically add a container context. '${source}' was added after the initial render.
Use modifier ('hover:container', 'active:container', etc) to ensure it present in the initial render`,
                    )
                }

                if (animated !== state.animated) {
                    throw new Error(
                        `ReactNativeCss: Cannot dynamically change to an animated component. '${source}' was added after the initial render.
Use 'animation-none' or a modifier ('hover:animation', 'active:animation', etc) to ensure it present in the initial render`,
                    )
                }

                if (pressable !== state.pressable) {
                    throw new Error(
                        `ReactNativeCss: Cannot dynamically change to a Pressable. '${source}' was added after the initial render.
The 'hover', 'active', and 'focus' modifiers on a View will convert it to a Pressable.
Use a modifier) to ensure it present in the initial render`,
                    )
                }
            }
        }
    }

    // We only track this in development
    let pressable =
        process.env.NODE_ENV === 'production' ? undefined : activeFamily.has(state.ruleEffect)

    if (!rules.size && !state.styles$ && !inlineVariables.size) {
        return {
            ...state,
            currentProps,
            guards,
            animated,
            pressable,
        }
    }

    if (usesVariables || variables) {
        rules.add(inheritedVariables)

        if (inlineVariables.size) {
            variables = Object.assign(
                {},
                variables,
                inheritedVariables,
                ...Array.from(inlineVariables),
                { [VAR_SYMBOL]: true },
            )
        }

        for (const variable of inlineVariables) {
            rules.add(variable)
        }
    }

    // Generate a StyleObservable for this unique set of rules / variables
    const styles$ = stylesFamily(generateHash(state, rules), rules)

    // Get the guards without subscribing to the observable
    // We will subscribe within the render using the StyleEffect
    guards.push(...styles$.get().guards)

    // If these are the same styles with no inline variables, we can skip the update
    if (state.styles$ === styles$ && !inlineVariables.size) {
        return state
    }

    // Remove this component from the old observer
    state.styles$?.cleanup(state.ruleEffect)

    return {
        ...state,
        currentProps,
        styles$,
        variables,
        containers,
        guards,
        animated,
        pressable,
    }
}

/**
 * Create variations of a style rule based on the config.
 * Cache for reference equality.
 */
const getRuleVariation = weakFamily((rule: StyleRule) => {
    return weakFamily((config: Config): StyleRule => {
        return { ...rule, target: config.target }
    })
})

function pushInlineRule(state: ComponentState, item: any, styleRuleSet: StyleRule[]) {
    for (const className of item[INLINE_RULE_SYMBOL].split(/\s+/)) {
        let inlineRuleSet = StyleCollection.styles(className).get(state.ruleEffect)

        for (let rule of inlineRuleSet) {
            styleRuleSet.push(rule)
        }
    }
}

/**
 * Get a unique number for a weak key.
 */
let hashKeyCount = 0
const hashKeyFamily = weakFamily(() => hashKeyCount++)

/**
 * Quickly generate a unique hash for a set of numbers.
 * This is not a cryptographic hash, but it is fast and has a low chance of collision.
 */
const MOD = 9007199254740871 // Largest prime within safe integer range 2^53
const PRIME = 31 // A smaller prime for mixing
export function generateHash(
    state: ComponentState,
    iterableKeys?: Iterable<WeakKey>,
    variables?: WeakKey,
    inlineVars?: Set<WeakKey>,
): string {
    let hash = 0
    let product = 1 // Used for mixing to enhance uniqueness

    if (!iterableKeys) {
        return ''
    }

    const keys = [state.configs, ...iterableKeys]

    if (variables) {
        keys.push(variables)
    }

    if (inlineVars) {
        keys.push(...inlineVars)
    }

    for (const key of keys) {
        if (!key) continue // Skip if key is undefined

        const num = hashKeyFamily(key)
        hash = (hash ^ num) % MOD // XOR and modular arithmetic
        product = (product * (num + PRIME)) % MOD // Mix with multiplication
    }

    // Combine hash and product to form the final hash
    hash = (hash + product) % MOD

    // Return the hash as a string
    return hash.toString(36)
}
