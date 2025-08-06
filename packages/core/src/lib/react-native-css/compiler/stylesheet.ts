import { getEntries, isEmpty, isObject } from '@coloragent/utils'
import { MediaCondition } from 'lightningcss'

import { RN_CSS_EM_PREFIX, ROOT_FONT_SIZE } from '../runtime/constants'
import {
    isStyleDescriptorArray,
    isStyleFunctionDescriptor,
    Specificity,
    specificityCompareFn,
} from '../runtime/utils'
import { toRNProperty, type NormalizeSelector } from './selectors'
import type {
    AnimationKeyframesRecord_V2,
    AnimationRecord_V2,
    CompilerOptions,
    ContainerQuery,
    ReactNativeCssStyleSheet,
    StyleDeclaration,
    StyleDescriptor,
    StyleRule,
    StyleRuleMapping,
    StyleRuleSet,
    VariableRecord,
} from './types'

type BuilderMode = 'style' | 'media' | 'container' | 'keyframes'

interface StyleSheetConfig {
    ruleSets: Record<string, StyleRuleSet>
    rootVariables: VariableRecord
    universalVariables: VariableRecord
    animations: AnimationRecord_V2
    rem: number
    ruleOrder: number
}

type SetStateInternal<T> = {
    _(partial: T | Partial<T> | { _(state: T): T | Partial<T> }['_'], replace?: false): void
    _(state: T | { _(state: T): T }['_'], replace: true): void
}['_']

export interface StoreApi<T> {
    set: SetStateInternal<T>
    get: () => T
    getInitialState: () => T
    subscribe: (listener: (state: T, prevState: T) => void) => () => void
}

const store = (() => {
    type State = StyleSheetConfig
    type Listener = (state: State, prevState: State) => void
    let state: State
    const listeners: Set<Listener> = new Set()

    const initialState: State = {
        ruleSets: {},
        rootVariables: {},
        universalVariables: {},
        animations: {},
        rem: ROOT_FONT_SIZE,
        ruleOrder: 0,
    }

    const set: StoreApi<State>['set'] = (partial, replace) => {
        const nextState =
            typeof partial === 'function' ? (partial as (state: State) => State)(state) : partial
        if (!Object.is(nextState, state)) {
            const previousState = state
            state =
                replace ?? (typeof nextState !== 'object' || nextState === null) ?
                    (nextState as State)
                :   Object.assign({}, state, nextState)
            listeners.forEach(listener => listener(state, previousState))
        }
    }

    const get: StoreApi<State>['get'] = () => state

    const getInitialState: StoreApi<State>['getInitialState'] = () => initialState

    const subscribe: StoreApi<State>['subscribe'] = listener => {
        listeners.add(listener)
        // Unsubscribe
        return () => listeners.delete(listener)
    }

    const updateOrder = () =>
        set(({ ruleOrder, ...rest }) => ({ ...rest, ruleOrder: (ruleOrder += 1) }))

    const addAnimation = (name: string, animationFrames: AnimationKeyframesRecord_V2) =>
        set(({ animations }) => {
            if (!(name in animations)) {
                animations[name] = animationFrames
            }
            return animations
        })

    return { set, get, getInitialState, subscribe, addAnimation, updateOrder }
})()

const extraRules = new WeakMap<StyleRule, Partial<StyleRule>[]>()

const staticDeclarations = new WeakMap<WeakKey, Record<string, StyleDescriptor>>()

export class StyleSheetBuilder {
    animationFrames?: AnimationKeyframesRecord_V2 // AnimationKeyframes_V2[]
    animationDeclarations: StyleDeclaration[] = []

    stylesheet: ReactNativeCssStyleSheet = {}

    varUsage = new Set<string>()

    readonly shared = store

    private _rule: StyleRule = {
        specificity: [],
    }
    get rule(): StyleRule {
        return this._rule
    }
    private setRule(rule: StyleRule): void {
        this._rule = rule
    }

    private _mapping: StyleRuleMapping = {}
    get mapping(): StyleRuleMapping {
        return this._mapping
    }
    private setMapping(mapping: StyleRuleMapping) {
        this._mapping = mapping
    }

    private _descriptorProperty: string | undefined
    get descriptorProperty(): string | undefined {
        return this._descriptorProperty
    }
    private setDescriptorProperty(property: string) {
        this._descriptorProperty = property
    }

    constructor(
        private options: CompilerOptions,
        private mode: BuilderMode = 'style',
    ) {}

    private createRuleFromPartial(rule: StyleRule, partial: Partial<StyleRule>) {
        rule = this.cloneRule(rule)

        if (partial.mediaQueries) {
            rule.mediaQueries ??= []
            rule.mediaQueries.push(...(partial.mediaQueries ?? []))
        }

        if (partial.declarations) {
            rule.declarations = partial.declarations
        }

        return rule
    }

    private addRuleToRuleSet(name: string, rule = this.rule) {
        const ruleSets = this.shared.get().ruleSets
        ruleSets[name] ??= []
        ruleSets[name].push(rule)
        this.shared.set({ ruleSets })
    }

    fork(mode: BuilderMode) {
        this.shared.updateOrder()
        const builder = new StyleSheetBuilder(this.options, mode)
        builder.setRule(this.cloneRule())
        builder.setMapping(structuredClone(this.mapping))
    }

    cloneRule({ ...rule } = this.rule): StyleRule {
        return structuredClone(rule)
    }

    extendRule(rule: Partial<StyleRule>) {
        return this.cloneRule({ ...this.rule, ...rule })
    }

    getOptions(): CompilerOptions {
        return this.options
    }

    setOption<T extends keyof CompilerOptions>(key: T, value: CompilerOptions[T]) {
        this.options[key] = value
    }

    getNativeStyleSheet(): ReactNativeCssStyleSheet {
        const stylesheetOptions: ReactNativeCssStyleSheet = {}

        const ruleSets = this.getRuleSets()
        if (ruleSets) {
            stylesheetOptions.ruleSets = ruleSets
        }

        const rootVariables = this.shared.get().rootVariables
        const universalVariables = this.shared.get().universalVariables
        const animations = this.shared.get().animations

        if (rootVariables) {
            stylesheetOptions.rootVars = rootVariables // Object.entries(this.shared.rootVariables)
        }

        if (universalVariables) {
            stylesheetOptions.universalVars = universalVariables // Object.entries(this.shared.universalVariables)
        }

        if (animations) {
            stylesheetOptions.keyframes = animations // Object.entries(this.shared.animations)
        }

        return stylesheetOptions
    }

    getRuleSets() {
        const ruleSets = this.shared.get().ruleSets
        if (isEmpty(ruleSets)) return

        const entries = getEntries(ruleSets)

        return getEntries(ruleSets).reduce(
            (acc, [name, rules]) => {
                acc[name] = rules.sort(specificityCompareFn)
                return acc
            },
            {} as Record<string, StyleRuleSet>,
        )

        // return Object.entries(this.shared.ruleSets).map(
        //     ([key, value]) => [key, value.sort((a, b) => specificityCompareFn(a, b))] as const,
        // )
    }

    addWarning(_type: 'property' | 'value' | 'function', _property: string | number): void {
        // TODO
    }

    newRule(mapping: StyleRuleMapping, { important = false } = {}) {
        this.setMapping(mapping)
        this.setRule(this.cloneRule(this.rule))
        this.rule.specificity[Specificity.Order] = this.shared.get().ruleOrder
        if (important) {
            this.rule.specificity[Specificity.Important] = 1
        }
    }

    addExtraRule(rule: Partial<StyleRule>) {
        let extraRuleArray = extraRules.get(this.rule)
        if (!extraRuleArray) {
            extraRuleArray = []
            extraRules.set(this.rule, extraRuleArray)
        }
        extraRuleArray.push(rule)
    }

    addMediaQuery(condition: MediaCondition) {
        this.rule.mediaQueries ??= []
        this.rule.mediaQueries.push(condition)
    }

    addContainer(value: string[] | false) {
        if (value === false) {
            this.rule.containers = []
        } else {
            this.rule.containers ??= []
            this.rule.containers.push(...value.map(name => `container:${name}`))
        }
    }

    addUnnamedDescriptor(value: StyleDescriptor, forceTuple?: boolean, rule?: StyleRule) {
        if (this.descriptorProperty === undefined) return

        this.addDescriptor(this.descriptorProperty, value, forceTuple, rule)
    }

    addDescriptor(
        property: string,
        value: StyleDescriptor,
        forceTuple?: boolean,
        rule: StyleRule = this.rule,
    ) {
        if (value === undefined) return

        if (this.mode === 'keyframes') {
            property = toRNProperty(property)
            this.pushDescriptor(property, value, this.animationDeclarations, forceTuple)
            return
        }

        // If property is a CSS Custom Property
        if (property.startsWith('--')) {
            // If we have enabled variable usage tracking, skip unused variables
            if (
                this.options.stripUnusedVariables &&
                !property.startsWith(`--${RN_CSS_EM_PREFIX}`) &&
                !this.varUsage.has(property)
            ) {
                return
            }

            rule.vars ??= {}
            rule.vars[property.slice(2)] = value
            // this.rule.vars ??= []
            // this.rule.vars.push([property.slice(2), value])
            return
        }

        // If the value is already a StyleFunctionDescriptor object, then it
        // has a value that needs to be computed at runtime or after other
        // styles have been calculated
        if (isStyleFunctionDescriptor(value)) {
            const { delay, usesVariables } = postProcessStyleFunction(value)

            rule.declarations ??= []

            if (value.func === '@animation') {
                rule.animations ??= true
            }

            if (usesVariables) {
                rule.declarationsWithVars = 1
            }

            this.pushDescriptor(
                property,
                value,
                rule.declarations,
                forceTuple,
                delay || usesVariables,
            )
            return
        }

        if (
            property.startsWith('animation-') ||
            property.startsWith('transition-') ||
            property === 'transition'
        ) {
            rule.animations ??= true
        }

        rule.declarations ??= []
        this.pushDescriptor(property, value, rule.declarations)
    }

    addShorthand(property: string, options: Record<string, StyleDescriptor>) {
        if (allEqual(...Object.values(options))) {
            this.addDescriptor(property, Object.values(options)[0])
        } else {
            for (const [name, value] of Object.entries(options)) {
                this.addDescriptor(name, value)
            }
        }
    }

    private pushDescriptor(
        property: string,
        value: StyleDescriptor,
        declarations: StyleDeclaration[],
        forceTuple = false,
        delayed = false,
    ) {
        property = toRNProperty(property)

        let propPath = this.mapping[property] ?? this.mapping['*'] ?? property // : string | string[]

        if (Array.isArray(propPath)) {
            if (!propPath.length) return

            const [first, ...rest] = propPath

            if (!rest.length) {
                propPath = first
            } else {
                forceTuple = true
            }
        }

        if (isStyleFunctionDescriptor(value)) {
            const declaration: StyleDeclaration = {
                type: 'descriptor',
                descriptor: value,
                propertyPath: propPath,
            }
            if (delayed) {
                declaration.delay = true
            }

            declarations.push(declaration)

            return
        }
        if (forceTuple || Array.isArray(propPath)) {
            const declaration: StyleDeclaration = {
                type: 'value',
                descriptor: value,
                propertyPath: propPath,
            }
            declarations.push(declaration)
            return
        }

        let staticDeclarationRecord = staticDeclarations.get(declarations)
        if (!staticDeclarationRecord) {
            staticDeclarationRecord = {}
            staticDeclarations.set(declarations, staticDeclarationRecord)
            declarations.push({
                type: 'static-object',
                descriptor: staticDeclarationRecord,
            })
        }
        staticDeclarationRecord[propPath] = value
    }

    applyRuleToSelectors(selectorList: NormalizeSelector[]): void {
        if (!this.rule.declarations && !this.rule.vars) return

        for (const selector of selectorList) {
            const rule = this.cloneRule()

            if (selector.type === 'className') {
                const {
                    specificity,
                    className,
                    mediaQuery,
                    containerQuery,
                    pseudoClassesQuery,
                    attributeQuery,
                } = selector

                // Combine the specificity of the selector with the rule's specificity
                for (let i = 0; i < specificity.length; i++) {
                    const spec = specificity[i]
                    if (!spec) continue
                    rule.specificity[i] = spec + (rule.specificity[i] ?? 0)
                }

                if (mediaQuery) {
                    rule.mediaQueries ??= []
                    rule.mediaQueries.push(...mediaQuery)
                }

                if (containerQuery) {
                    rule.containerQueries ??= []
                    rule.containerQueries.push(...containerQuery)

                    for (const query of containerQuery) {
                        const name = query.name

                        if (typeof name !== 'string') {
                            continue
                        }

                        const containerRule: StyleRule = {
                            // These are not "real" rules, so they use the lowest specificity
                            specificity: [0],
                            containers: [name],
                        }

                        // Create rules for the parent classes
                        this.addRuleToRuleSet(name, containerRule)
                    }
                }

                if (pseudoClassesQuery) {
                    rule.pseudoClassesQuery = { ...rule.pseudoClassesQuery, ...pseudoClassesQuery }
                }

                if (attributeQuery) {
                    rule.attrQueries ??= []
                    rule.attrQueries.push(...attributeQuery)
                }

                this.addRuleToRuleSet(className, rule)

                const extraRulesArray = extraRules.get(this.rule)
                if (extraRulesArray) {
                    for (const extraRule of extraRulesArray) {
                        this.addRuleToRuleSet(
                            className,
                            this.createRuleFromPartial(rule, extraRule),
                        )
                    }
                }
            } else {
                // These can only have variable declarations
                if (!this.rule.vars) continue

                const { type, variant } = selector

                const varsType = this.shared.get()[type]

                for (const [name, value] of Object.entries(this.rule.vars)) {
                    varsType[name] ??= [undefined]
                    varsType[name][variant === 'light' ? 0 : 1] = value
                }

                this.shared.set({ [type]: varsType })
            }
        }
    }

    addContainerQuery(query: ContainerQuery) {
        this.rule.containerQueries ??= []
        this.rule.containerQueries.push(query)
    }

    newAnimationFrames(name: string) {
        const animations = this.shared.get().animations
        this.animationFrames = animations[name]
        if (!this.animationFrames) {
            this.animationFrames ??= {}
            this.shared.set({ animations: { ...animations, [name]: this.animationFrames } })
        }
    }

    newAnimationFrame(progress: string) {
        if (!this.animationFrames) {
            throw new Error('No animation frames defined. Call newAnimationFrames first.')
        }

        this.animationDeclarations = []
        this.animationFrames[progress] = this.animationDeclarations
        // this.animationFrames.push([progress, this.animationDeclarations])
    }
}

function postProcessStyleFunction(value: StyleDescriptor): {
    delay: boolean
    usesVariables: boolean
} {
    const results = { delay: false, usesVariables: false }

    if (!isObject(value)) {
        return results
    }

    if (isStyleDescriptorArray(value)) {
        for (const v of value) {
            const { delay, usesVariables } = postProcessStyleFunction(v)
            results.delay = delay
            results.usesVariables = usesVariables
        }

        return results
    }

    if (isStyleFunctionDescriptor(value)) {
        let { delay, usesVariables } = postProcessStyleFunction(value.value)

        usesVariables ||= value.func == 'var'
        delay ||= value.processLast === true

        if (delay) {
            return { delay, usesVariables }
        }
    }

    return results
}

function allEqual(...params: unknown[]) {
    return params.every((param, index, array) => {
        return index === 0 ? true : equal(array[0], param)
    })
}

function equal(a: unknown, b: unknown) {
    if (a === b) return true
    if (typeof a !== typeof b) return false
    if (a === null || b === null) return false
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (!equal(a[i], b[i])) return false
        }
        return true
    }
    if (typeof a === 'object' && typeof b === 'object') {
        if (Object.keys(a).length !== Object.keys(b).length) return false
        for (const key in a) {
            if (!equal((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
                return false
        }
        return true
    }

    return false
}
