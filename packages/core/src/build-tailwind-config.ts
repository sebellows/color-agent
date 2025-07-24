import fs from 'fs'
import { isFunction, isPlainObject, titleCase } from '@coloragent/utils'
import {
    MetadataExtension,
    ThemeTokens,
    TokenJSON,
    TokenMap,
    TokenGroup,
    TokenValue,
} from './types'
import { METADATA_EXTENSION, PARSED_TOKENS_FILE_PATH, TOKENS_OUTPUT_FILE_PATH } from './constants'
import { isTokenGroup, toTokenMap } from './token.utils'
import { cssHeaderWithImports, tailwindDirectiveStyles } from './css-templates'
import {
    borderStyleTransform,
    colorTransform,
    cubicBezierTransform,
    dimensionTransform,
    fontFamilyTransform,
    fontWeightTransform,
    ratioTransform,
    referenceToCustomProperty,
    shadowTransform,
    typographyTransform,
} from './transforms'

const assignToSelector = (currentGroup: TokenGroup, init: Record<string, any>) => {
    const { $extensions = {} } = currentGroup
    const metadata = ($extensions?.[METADATA_EXTENSION] ?? {}) as MetadataExtension
    const { customPropertyPrefix, parentSelector } = metadata

    if (!parentSelector) {
        console.warn(`No parent selector found for group: ${currentGroup.$type}`)
        return
    }

    if (!customPropertyPrefix) {
        console.warn(
            `No custom property prefix found for group: ${currentGroup.$type}`,
            `\nparentSelector: ${parentSelector}`,
        )
        return
    }

    for (const [key, value] of Object.entries(currentGroup)) {
        let propertyKey = customPropertyPrefix ? `${customPropertyPrefix}-${key}` : key
        if (key.startsWith('$') || typeof value != 'object') {
            continue
        }

        init[`--${[propertyKey]}`] = referenceToCustomProperty(value.$value)
    }
}

const flattenGroupUtility = (currentGroup: TokenGroup, init: Record<string, any>) => {
    const { $type, $extensions = {} } = currentGroup
    const metadata = ($extensions?.[METADATA_EXTENSION] ?? {}) as MetadataExtension
    const { customPropertyPrefix, directive, properties } = metadata

    if (!directive || !properties?.length) {
        console.warn(`No directive found for group: ${currentGroup.$type}`)
        return
    }

    if (!customPropertyPrefix) {
        console.warn(
            `No custom property prefix found for group: ${currentGroup.$type}`,
            `\ndirective: ${directive}`,
        )
        return
    }

    const utilKey = `@utility ${customPropertyPrefix}-*`
    let tokenObj = init[utilKey]
    if (!tokenObj) {
        tokenObj = init[utilKey] = {}
    }

    switch ($type) {
        case 'dimension':
            tokenObj[`${customPropertyPrefix}-size`] = properties.reduce(
                (acc, prop) => {
                    acc[prop] = `--value(--${customPropertyPrefix}-*)`
                    return acc
                },
                {} as Record<string, string>,
            )
            break
        default:
            console.warn(`Unknown token type: ${$type} for key: ${utilKey}`)
            break
    }
}

const TAB = '    '

function appendStylesToTemplate(
    obj: { [key: string]: [string, [string, string]][] },
    template: string,
    commentFormatter: (type: string) => string = type => `${TAB}/* ${titleCase(type)} */\n`,
): string {
    for (const atRule in obj) {
        template += `@${atRule} {\n`
        template += obj[atRule].reduce((acc, [$type, [property, value]], idx) => {
            if (isPlainObject(value)) {
                acc += `${TAB}${property} {\n`
                acc += Object.entries(value).reduce((innerAcc, [innerProperty, innerValue]) => {
                    innerAcc += `${TAB.repeat(2)}${innerProperty}: ${innerValue};\n`
                    return innerAcc
                }, '')
                acc += `${TAB}}\n`
            } else {
                if (idx === 0 && $type && isFunction(commentFormatter)) {
                    acc += commentFormatter($type)
                }
                acc += `${TAB}${property}: ${value};\n`
            }

            return acc
        }, '')
        template += `}\n`
    }
    return template
}

const customProperties: {
    theme: Record<string, Record<string, any>>
    directives: Record<string, Record<string, any>>
    [key: string]: Record<string, Record<string, any>>
} = {
    theme: {},
    directives: {},
}

const utils: {
    // theme: [string, [string, string]][]
    inline: [string, [string, string]][]
    [key: string]: [string, [string, string]][]
} = {
    // theme: [] as [string, [string, string]][],
    inline: [] as [string, [string, string]][],
    ...Object.keys(customProperties).reduce(
        (acc, key) => {
            Object.assign(acc, { [key]: [] as [string, [string, string]][] })
            return acc
        },
        {} as { [key: string]: [string, [string, [string, string]][]] },
    ),
}

function flattenGroup(currentGroup: TokenGroup, init: Record<string, any>, tokenMap: TokenMap) {
    const { $type, $extensions = {} } = currentGroup
    const metadata = $extensions?.[METADATA_EXTENSION] ?? {}
    const { customPropertyPrefix } = metadata

    for (const [key, value] of Object.entries(currentGroup)) {
        if (key.startsWith('$') || typeof value != 'object') {
            continue
        }

        let propertyKey = customPropertyPrefix ? `${customPropertyPrefix}-${key}` : key

        if ('$value' in value) {
            switch ($type) {
                case 'color':
                    init[`--${propertyKey}`] = colorTransform(
                        value.$value as TokenValue<'color'>,
                        tokenMap,
                    )
                    break
                case 'dimension':
                    init[`--${propertyKey}`] = dimensionTransform(
                        value.$value as TokenValue<'dimension'>,
                        tokenMap,
                    )
                    break
                case 'border':
                    init[`--${propertyKey}`] = borderStyleTransform(
                        value.$value as TokenValue<'border'>,
                        tokenMap,
                    )
                    break
                case 'fontFamily':
                    init[`--${propertyKey}`] = fontFamilyTransform(
                        value.$value as TokenValue<'fontFamily'>,
                        tokenMap,
                    )
                    break
                case 'fontWeight':
                    init[`--${propertyKey}`] = fontWeightTransform(
                        value.$value as TokenValue<'fontWeight'>,
                        tokenMap,
                    )
                    break
                case 'cubicBezier':
                    init[`--${propertyKey}`] = cubicBezierTransform(
                        value.$value as TokenValue<'cubicBezier'>,
                        tokenMap,
                    )
                    break
                case 'shadow':
                    init[`--${propertyKey}`] = shadowTransform(
                        value.$value as TokenValue<'shadow'>,
                        tokenMap,
                    )
                    break
                case 'typography':
                    const typographyProps = typographyTransform(
                        value.$value as TokenValue<'typography'>,
                        tokenMap,
                    )
                    init[`--${propertyKey}`] = typographyProps.fontSize
                    init[`--${propertyKey}--line-height`] = typographyProps.lineHeight
                    init[`--${propertyKey}--font-family`] = typographyProps.fontFamily
                    init[`--${propertyKey}--font-weight`] = typographyProps.fontWeight
                    init[`--${propertyKey}--letter-spacing`] = typographyProps.letterSpacing
                    break
                case 'ratio':
                    init[`--${propertyKey}`] = ratioTransform(
                        value.$value as TokenValue<'ratio'>,
                        tokenMap,
                    )
                    break
                default:
                    console.warn(`Unknown token type: ${$type} for key: ${key}`)
                    init[`--${propertyKey}`] = value.$value
                    break
            }
        } else {
            flattenGroup(value, init, tokenMap)
        }
    }
}

function resolveTokenGroup(themeTokens: ThemeTokens, tokenMap: TokenMap): void {
    for (const tokenGroup of Object.values(themeTokens)) {
        if (!isTokenGroup(tokenGroup)) {
            continue
        }

        const metadata = tokenGroup?.$extensions?.[METADATA_EXTENSION] ?? {}
        const parentSelector = metadata?.parentSelector

        let themeCustomProps = customProperties.theme

        const typeKey = tokenGroup.$type
        if (typeKey) {
            if (!customProperties.theme?.[typeKey]) {
                customProperties.theme[typeKey] = {}
            }
            themeCustomProps = customProperties.theme[typeKey]
        }

        if (!parentSelector) {
            flattenGroup(tokenGroup, themeCustomProps, tokenMap)
        } else {
            let selectorSpecific = customProperties?.[parentSelector]
            if (!customProperties?.[parentSelector]) {
                customProperties[parentSelector] = {}
                selectorSpecific = customProperties[parentSelector]
            }
            assignToSelector(tokenGroup, selectorSpecific)
        }

        const twDirective = metadata?.directive
        if (typeof twDirective == 'string' && twDirective !== 'theme') {
            flattenGroupUtility(tokenGroup, customProperties.directives)
        }
    }
}

function parseEntries(
    obj: Record<string, any>,
    directiveResolver: (val: string, entry: [string, string]) => void,
) {
    const entries = Object.entries(obj).map(([key, tokens]) => {
        return [key, Object.entries(tokens)] as [string, [string, string][]]
    })
    for (const [varName, varValues] of entries) {
        varValues.forEach(([vkey, vvalue]) => {
            directiveResolver(varName, [vkey, vvalue])
        })
    }
}

export function buildTailwindConfig() {
    const themeTokens: TokenJSON = JSON.parse(fs.readFileSync(PARSED_TOKENS_FILE_PATH, 'utf-8'))

    const tokenMap = toTokenMap(themeTokens)

    let outputContent = cssHeaderWithImports

    resolveTokenGroup(themeTokens.theme, tokenMap)

    for (const property in customProperties) {
        parseEntries(customProperties[property], (varName, [varKey, varValue]) => {
            if (property === 'theme') {
                if (varValue.startsWith('var(--')) {
                    utils.inline.push([varName, [varKey, varValue]])
                } else {
                    utils[property].push([varName, [varKey, varValue]])
                }
            } else {
                utils[property].push([varName, [varKey, varValue]])
            }
        })
    }

    appendStylesToTemplate(utils, outputContent)

    outputContent += tailwindDirectiveStyles

    fs.writeFileSync(TOKENS_OUTPUT_FILE_PATH, outputContent, 'utf-8')
}
