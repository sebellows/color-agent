import { RN_CSS_EM_PREFIX, ROOT_FONT_SIZE } from '../runtime/constants'
import { isStyleDescriptorArray, Specificity, specificityCompareFn } from '../runtime/utils'
import type {
    // AnimationKeyframes_V2,
    AnimationKeyframesRecord_V2,
    AnimationRecord_V2,
    CompilerOptions,
    ContainerQuery,
    MediaCondition,
    ReactNativeCssStyleSheet,
    StyleDeclaration,
    StyleDescriptor,
    StyleFunction,
    StyleRule,
    StyleRuleMapping,
    StyleRuleSet,
    VariableRecord,
} from './compiler.types'
import { toRNProperty, type NormalizeSelector } from './selectors'

type BuilderMode = 'style' | 'media' | 'container' | 'keyframes'

type StyleRuleSetRecord = Record<string, StyleRuleSet>

type SharedStyleSheetConfig = {
    ruleSets: StyleRuleSetRecord
    rootVariables?: VariableRecord
    universalVariables?: VariableRecord
    animations?: AnimationRecord_V2
    rem: number
    ruleOrder: number
}

const defaultSharedConfig: SharedStyleSheetConfig = {
    ruleSets: {},
    rem: ROOT_FONT_SIZE,
    ruleOrder: 0,
}

export class StyleSheetBuilder {
    animationFrames?: AnimationKeyframesRecord_V2 // AnimationKeyframes_V2[]
    animationDeclarations: StyleDeclaration[] = []
    staticDeclarations: Record<string, StyleDescriptor> | undefined

    stylesheet: ReactNativeCssStyleSheet = {}

    varUsage = new Set<string>()

    private rule: StyleRule = {
        specificity: [],
    }

    constructor(
        private options: CompilerOptions,
        private mode: BuilderMode = 'style',
        private ruleTemplate: StyleRule = {
            specificity: [],
        },
        private mapping: StyleRuleMapping = {},
        private shared: SharedStyleSheetConfig = defaultSharedConfig,
    ) {}

    fork(mode: BuilderMode) {
        this.shared.ruleOrder++
        return new StyleSheetBuilder(
            this.options,
            mode,
            this.cloneRule(),
            { ...this.mapping },
            this.shared,
        )
    }

    cloneRule({ ...rule } = this.rule): StyleRule {
        return structuredClone(rule)
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

        if (this.shared.rootVariables) {
            stylesheetOptions.rootVars = this.shared.rootVariables // Object.entries(this.shared.rootVariables)
        }

        if (this.shared.universalVariables) {
            stylesheetOptions.universalVars = this.shared.universalVariables // Object.entries(this.shared.universalVariables)
        }

        if (this.shared.animations) {
            stylesheetOptions.keyframes = this.shared.animations // Object.entries(this.shared.animations)
        }

        return stylesheetOptions
    }

    getRuleSets() {
        const entries = Object.entries(this.shared.ruleSets)

        if (!entries.length) {
            return
        }

        return Object.entries(this.shared.ruleSets).reduce(
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
        this.mapping = mapping
        this.staticDeclarations = undefined
        this.rule = this.cloneRule(this.ruleTemplate)
        this.rule.specificity[Specificity.Order] = this.shared.ruleOrder
        if (important) {
            this.rule.specificity[Specificity.Important] = 1
        }
    }

    addRuleToRuleSet(name: string, rule = this.rule) {
        if (this.shared.ruleSets[name]) {
            this.shared.ruleSets[name].push(rule)
        } else {
            this.shared.ruleSets[name] = [rule]
        }
    }

    addMediaQuery(condition: MediaCondition) {
        this.rule.mediaQueries ??= []
        this.rule.mediaQueries.push(condition)
    }

    addContainer(value: string[] | false) {
        this.rule.containers ??= []

        if (value === false) {
            this.rule.containers = []
        } else {
            this.rule.containers.push(...value.map(name => `container:${name}`))
        }
    }

    addDescriptor(property: string, value: StyleDescriptor, forceTuple?: boolean) {
        if (value === undefined) return

        if (this.mode === 'keyframes') {
            property = toRNProperty(property)
            this.pushDescriptor(property, value, this.animationDeclarations, forceTuple)
        } else if (property.startsWith('--')) {
            // If we have enabled variable usage tracking, skip unused variables
            if (
                this.options.stripUnusedVariables &&
                !property.startsWith(`--${RN_CSS_EM_PREFIX}`) &&
                !this.varUsage.has(property)
            ) {
                return
            }

            this.rule.vars ??= {}
            this.rule.vars[property.slice(2)] = value
            // this.rule.vars ??= []
            // this.rule.vars.push([property.slice(2), value])
        } else if (isStyleFunction(value)) {
            const [delayed, usesVariables] = postProcessStyleFunction(value)

            this.rule.declarations ??= []

            if (usesVariables) {
                this.rule.declarationsWithVars = 1
            }

            this.pushDescriptor(
                property,
                value,
                this.rule.declarations,
                forceTuple,
                delayed || usesVariables,
            )
        } else {
            this.rule.declarations ??= []
            this.pushDescriptor(property, value, this.rule.declarations)
        }
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
            const [first, ...rest] = propPath

            if (!first) {
                // This should not happen, but if it does, we skip the property
                return
            }

            if (!rest.length) {
                propPath = first
            } else {
                forceTuple = true
            }
        }

        if (isStyleFunction(value)) {
            if (delayed) {
                declarations.push([value, propPath, 1])
            } else {
                declarations.push([value, propPath])
            }
        } else if (forceTuple || Array.isArray(propPath)) {
            declarations.push([value, propPath])
        } else {
            if (!this.staticDeclarations) {
                this.staticDeclarations = {}
                declarations.push(this.staticDeclarations)
            }
            this.staticDeclarations[propPath] = value
        }
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
            } else {
                // These can only have variable declarations
                if (!this.rule.vars) {
                    continue
                }

                const { type, variant } = selector

                for (const [name, value] of Object.entries(this.rule.vars)) {
                    this.shared[type] ??= {}
                    this.shared[type][name] ??= [undefined]
                    this.shared[type][name][variant === 'light' ? 0 : 1] = value
                }
            }
        }
    }

    addContainerQuery(query: ContainerQuery) {
        this.rule.containerQueries ??= []
        this.rule.containerQueries.push(query)
    }

    newAnimationFrames(name: string) {
        this.shared.animations ??= {}

        this.animationFrames = this.shared.animations[name]
        if (!this.animationFrames) {
            this.animationFrames = {}
            this.shared.animations[name] = this.animationFrames
        }
    }

    newAnimationFrame(progress: string) {
        if (!this.animationFrames) {
            throw new Error('No animation frames defined. Call newAnimationFrames first.')
        }

        this.animationDeclarations = []
        this.staticDeclarations = {}
        this.animationFrames[progress] = this.animationDeclarations
        // this.animationFrames.push([progress, this.animationDeclarations])
    }
}

function isStyleFunction(value: StyleDescriptor | StyleDescriptor[]): value is StyleFunction {
    return Boolean(
        Array.isArray(value) &&
            value.length > 0 &&
            value[0] &&
            typeof value[0] === 'object' &&
            Object.keys(value[0]).length === 0,
    )
}

function postProcessStyleFunction(value: StyleDescriptor): [
    // Should it be delayed
    boolean,
    // Does it use variables
    boolean,
] {
    if (!Array.isArray(value)) {
        return [false, false]
    }

    if (isStyleDescriptorArray(value)) {
        let shouldDelay = false
        let usesVariables = false
        for (const v of value) {
            const [delayed, variables] = postProcessStyleFunction(v)
            shouldDelay ||= delayed
            usesVariables ||= variables
        }

        return [shouldDelay, usesVariables]
    }

    let [shouldDelay, usesVariables] = postProcessStyleFunction(value[2])

    usesVariables ||= value[1] === 'var'
    shouldDelay ||= value[3] === 1

    if (shouldDelay) {
        return [true, usesVariables]
    }

    return [false, false]
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
