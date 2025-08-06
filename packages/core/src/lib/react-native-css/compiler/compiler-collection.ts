import debug from 'debug'
import { StyleRule } from 'lightningcss'

import { DEFAULT_LOGGER_NAME } from '../runtime/constants'
import {
    AnimationKeyframes_V1,
    AnimationKeyframes_V2,
    CompilerOptions,
    FeatureFlagRecord,
    VariableRecord,
} from './types'

/**
 * @internal
 */
export class CompilerCollection implements CompilerOptions {
    features: FeatureFlagRecord = {}

    rules = new Map<string, StyleRule[]>()

    keyframes = new Map<string, AnimationKeyframes_V1 | AnimationKeyframes_V2[]>()

    darkMode: string | null = null

    rootVariables: VariableRecord = {}

    universalVariables: VariableRecord = {}

    selectorPrefix?: string

    appearanceOrder: number = 0

    varUsageCount = new Map<string, number>()

    /**
     * The root font size. Used for calculating REM and EM units.
     * @see CompilerOptions
     */
    baseFontSize = 16

    /** @see CompilerOptions */
    grouping: (string | RegExp)[] = []

    /** @see CompilerOptions */
    stylesheetOrder = 0

    /** @see CompilerOptions */
    logger?: (message: string) => void

    /**
     * Strip unused variables declarations.
     * @see CompilerOptions
     */
    stripUnusedVariables?: boolean

    /**
     * @internal
     * @see CompilerOptions
     */
    ignorePropertyWarningRegex: (string | RegExp)[] = []

    /**
     * @internal
     * @see CompilerOptions
     */
    preserveVariables?: boolean

    /**
     * @internal
     * Sets the color precision in Color instances from color.io
     * @see CompilerOptions
     */
    colorPrecision = 3

    constructor(options: CompilerOptions) {
        this.baseFontSize ??= options.baseFontSize as number
    }
}
