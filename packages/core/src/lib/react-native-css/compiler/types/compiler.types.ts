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

export interface CompilerOptions {
    baseFontSize?: number
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
    colorPrecision?: number
}
