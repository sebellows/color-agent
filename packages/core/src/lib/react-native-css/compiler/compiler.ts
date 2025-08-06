import { debug } from 'debug'
import {
    transform,
    type ContainerRule,
    type MediaQuery as CSSMediaQuery,
    type CustomAtRules,
    type MediaRule,
    type Rule,
    type TokenOrValue,
    type Visitor,
} from 'lightningcss'

import { maybeMutateReactNativeOptions, parsePropAtRule } from './atRules'
import { parseContainerCondition } from './container-query'
import { parseDeclaration } from './declarations'
import { extractKeyFrames } from './keyframes'
import { parseMediaQuery } from './media-query'
import { getSelectors, normalizeTokenSelector } from './selectors'
import { StyleSheetBuilder } from './stylesheet'
import type { CompilerOptions, ContainerQuery, ReactNativeCssStyleSheet } from './types'

const defaultLogger = debug('react-native-css:compiler')

const initialCustomAtRules: CustomAtRules = {
    'react-native': {
        body: 'declaration-list',
    },
}

/**
 * Converts a CSS file to a collection of style declarations that can be used with the StyleSheet API
 *
 * @param code - The CSS file contents
 * @param options - Compiler options
 * @returns A `ReactNativeCssStyleSheet` that can be passed to `StyleSheet.register` or used with a
 *      custom runtime
 */
export function compile(
    code: Uint8Array<ArrayBufferLike> | string,
    options: CompilerOptions = {},
): ReactNativeCssStyleSheet {
    const { logger = defaultLogger } = options
    const features = Object.assign({}, options.features)

    if (options.selectorPrefix) {
        options.selectorPrefix = normalizeTokenSelector(options.selectorPrefix, '.')
    }

    logger(`Features ${JSON.stringify(features)}`)

    if (process.env.NODE_ENV !== 'production' && defaultLogger.enabled) {
        defaultLogger(code.toString())
    }

    const builder = new StyleSheetBuilder(options)

    logger(`Start lightningcss`)

    const customAtRules = initialCustomAtRules

    /**
     * Custom transforms are implemented by passing a `visitor` object. A visitor includes
     * one or more functions which are called for specific value types such as `Rule`, `Property`,
     * or `Length`.
     *
     * See docs for more about the visitor API: https://lightningcss.dev/transforms.html#visitors
     */
    const visitor: Visitor<typeof customAtRules> = {
        /**
         * The `Rule` callback returns either `ReturnedRule`, `ReturnedRule[]`, or `void`.
         * `ReturnedRule` is of type `Rule` which has two generics that are assigned:
         *
         * 1. The first generic can be either a `Declaration` or a `ReturnedDeclaration`, containing
         *    two properties:
         *       - `property`,the property name, and
         *       - `raw`, the raw string value for the declaration.
         * 2. The second generic is the type `ReturnedMediaQuery`, which can be either:
         *       - A `MediaQuery` object, or
         *       - An object with a `raw` property, which is the raw string value for the media query
         */
        Rule(rule) {
            maybeMutateReactNativeOptions(rule, builder)
        },
        /**
         * The `StyleSheetExit` callback is called when the CSS AST has been fully traversed.
         * It returns a StyleSheet object that contains all the rules extracted from the CSS AST.
         */
        StyleSheetExit(styleSheet) {
            logger(`Found ${styleSheet.rules.length} rules to process`)

            for (const rule of styleSheet.rules) {
                // Extract the style declarations and animations from the current rule
                extractRule(rule, builder)
                // We have processed this rule, so now delete it from the AST
            }

            logger(`Exiting lightningcss`)
        },
    }

    if (options.stripUnusedVariables) {
        const onVarUsage = (token: TokenOrValue) => {
            if (token.type === 'function') {
                token.value.arguments.forEach(token => onVarUsage(token))
            } else if (token.type === 'var') {
                builder.varUsage.add(token.value.name.ident)
                if (token.value.fallback) {
                    const fallbackValues = token.value.fallback
                    fallbackValues.forEach(varObj => onVarUsage(varObj))
                }
            }
        }

        visitor.Declaration = decl => {
            if (decl.property === 'unparsed' || decl.property === 'custom') {
                decl.value.value.forEach(token => onVarUsage(token))
            }
            return decl
        }
    }

    /**
     * Lightning CSS' `transform` function compiles a CSS stylesheet from a Node Buffer. The
     * lightningcss library traverses the CSS AST and extracts style declarations and animations.
     */
    transform({
        filename: 'style.css', // This is ignored, but required
        code: typeof code === 'string' ? new TextEncoder().encode(code) : code,

        // Custom transforms are implemented by passing a `visitor` object. A visitor includes
        // one or more functions which are called for specific value types such as `Rule`, `Property`,
        // or `Length`.
        visitor,
    })

    return builder.getNativeStyleSheet()
}

/**
 * Extracts style declarations and animations from a given CSS rule, based on its type.
 */
function extractRule(rule: Rule, builder: StyleSheetBuilder) {
    // Check the rule's type to determine which extraction function to call
    switch (rule.type) {
        case 'keyframes': {
            // If the rule is a keyframe animation, extract it with the `extractKeyFrames` function
            extractKeyFrames(rule.value, builder)
            break
        }
        case 'container': {
            // If the rule is a container, extract it with the `extractedContainer` function
            extractContainer(rule.value, builder)
            break
        }
        case 'media': {
            // If the rule is a media query, extract it with the `extractMedia` function
            extractMedia(rule.value, builder)
            break
        }
        case 'style': {
            // If the rule is a style declaration, extract it with the `getExtractedStyle`
            // function and store it in the `declarations` map
            builder = builder.fork('style')

            const declarationBlock = rule.value.declarations
            const mapping = parsePropAtRule(rule.value.rules)
            const selectors = getSelectors(rule.value.selectors, false, builder.getOptions())

            if (declarationBlock) {
                const { declarations = [], importantDeclarations = [] } = declarationBlock

                if (declarations.length) {
                    builder.newRule(mapping)
                    for (const declaration of declarations) {
                        parseDeclaration(declaration, builder)
                    }
                    builder.applyRuleToSelectors(selectors)
                }

                if (importantDeclarations.length) {
                    builder.newRule(mapping, { important: true })
                    for (const declaration of importantDeclarations) {
                        parseDeclaration(declaration, builder)
                    }
                    builder.applyRuleToSelectors(selectors)
                }
            }
            break
        }
        case 'layer-block':
            for (const layerRule of rule.value.rules) {
                extractRule(layerRule, builder)
            }
            break
        // case 'custom':
        // case 'font-face':
        // case 'font-palette-values':
        // case 'font-feature-values':
        // case 'namespace':
        // case 'layer-statement':
        // case 'property':
        // case 'view-transition':
        // case 'ignored':
        // case 'unknown':
        // case 'import':
        // case 'page':
        // case 'supports':
        // case 'counter-style':
        // case 'moz-document':
        // case 'nesting':
        // case 'nested-declarations':
        // case 'viewport':
        // case 'custom-media':
        // case 'scope':
        // case 'starting-style':
        default:
            break
    }
}

/**
 * This function takes in a MediaRule object, an CompilerCollection object and a
 * `CssToReactNativeRuntimeOptions` object, and returns an array of MediaQuery objects
 * representing styles extracted from screen media queries.
 *
 * @param mediaRule - The MediaRule object containing the media query and its rules.
 * @param collection - The CompilerCollection object to use when extracting styles.
 * @param parseOptions - The CssToReactNativeRuntimeOptions object to use when parsing styles.
 *
 * @returns undefined if no screen media queries are found in the mediaRule, else it returns
 * the extracted styles.
 */
function extractMedia(mediaRule: MediaRule, builder: StyleSheetBuilder) {
    builder = builder.fork('media')

    // Initialize an empty array to store screen media queries
    const media: CSSMediaQuery[] = []

    // Iterate over all media queries in the mediaRule
    for (const mediaQuery of mediaRule.query.mediaQueries) {
        if (
            // If this is only a media query
            (mediaQuery.mediaType === 'print' && mediaQuery.qualifier !== 'not') ||
            // If this is a @media not print {}
            // We can only do this if there are no conditions, as @media not print and (min-width: 100px) could be valid
            (mediaQuery.mediaType !== 'print' &&
                mediaQuery.qualifier === 'not' &&
                mediaQuery.condition === null)
        ) {
            continue
        }

        media.push(mediaQuery)
    }

    if (media.length === 0) {
        return
    }

    for (const m of media) {
        parseMediaQuery(m, builder)
    }

    // Iterate over all rules in the mediaRule and extract their styles using the updated CompilerCollection
    for (const rule of mediaRule.rules) {
        extractRule(rule, builder)
    }
}

/**
 * @param containerRule - The ContainerRule object containing the container query and its rules.
 * @param collection - The CompilerCollection object to use when extracting styles.
 * @param parseOptions - The CssToReactNativeRuntimeOptions object to use when parsing styles.
 */
function extractContainer(containerRule: ContainerRule, builder: StyleSheetBuilder) {
    builder = builder.fork('container')

    // Iterate over all rules inside the containerRule and extract their styles using the
    // updated CompilerCollection
    for (const rule of containerRule.rules) {
        const query: ContainerQuery = {
            name: containerRule?.name,
            mediaCondition: parseContainerCondition(containerRule.condition, builder),
        }

        builder.addContainerQuery(query)

        extractRule(rule, builder)
    }
}
