import { TokenOrValue, UnresolvedColor } from "lightningcss"
import { StyleSheetBuilder } from "../stylesheet"
import { StyleDescriptor, StyleFunction, StyleFunctionDescriptor } from "../compiler.types"
import { getType, isNil, isPlainObject, variadic } from "@coloragent/utils"
import { isBooleanish, round } from "../../../../utils"
import { COMMA_SEPARATOR } from "../../runtime/constants"
import { toStyleFunctionDescriptor } from "../../runtime/utils"

class Unknown {}

function isUnknown(value: unknown): value is Unknown {
    return value instanceof Unknown
}

const UNKNOWN = Object.freeze(new Unknown())

function isTokenOrValue(
    tokenOrValue: TokenOrValue | TokenOrValue[] | string | number | undefined
): tokenOrValue is TokenOrValue {
    return isPlainObject(tokenOrValue) && 'type' in tokenOrValue
}

// function isStyleDescriptorToken(
//     tokenOrValue: unknown
// ): tokenOrValue is StyleDescriptorToken {
//     return isPlainObject(tokenOrValue) && '$type' in tokenOrValue && '$value' in tokenOrValue
// }

// function isStyleDescriptorGroup(
//     tokenOrValue: unknown
// ): tokenOrValue is StyleDescriptorGroup {
//     return isPlainObject(tokenOrValue) && !Object.keys(tokenOrValue).some(key => key === '$value') && Object.values(tokenOrValue).some(isStyleDescriptorToken)
// }

// function toTokenFormat(
//     tokenOrValue: TokenOrValue | TokenOrValue[] | string | number | undefined,
//     $type?: string,
// ): StyleDescriptor | undefined {
//     if (isNil(tokenOrValue)) return
//     let t = getType(tokenOrValue)
//     if (isStyleDescriptorToken(tokenOrValue)) {
//         return tokenOrValue as StyleDescriptorToken
//     }
//     if (isTokenOrValue(tokenOrValue)) {
//         return {
//             $type: (tokenOrValue as TokenOrValue).type,
//             $value: 'value' in tokenOrValue ? (tokenOrValue as TokenOrValue).value : UNKNOWN,
//         }
//     }
//     if (Array.isArray(tokenOrValue)) {
//         return tokenOrValue.map(item => toTokenFormat(item, $type)).filter(v => v !== undefined) as StyleDescriptorToken[]
//     }
//     switch (t) {
//         case 'string':
//             if (isBooleanish(tokenOrValue)) {
//                 return {
//                     $type: 'boolean',
//                     $value: tokenOrValue === 'true',
//                 }
//             } else {
//                 return {
//                     $type: 'string',
//                     $value: tokenOrValue,
//                 }
//             }
//         case 'number':
//             return {
//                 $type: 'number',
//                 $value: round(tokenOrValue as number),
//             }
//         case 'array':
//             const args = reduceParseUnparsed(tokenOrValue as TokenOrValue[], builder)
//             if (!args) return
//             return variadic(args)
//         case 'object':
//             const token = tokenOrValue as TokenOrValue
//             switch (token.type) {
//                 case 'unresolved-color':
//     }
// }

export function reduceParseUnparsed(
    tokenOrValues: TokenOrValue[],
    builder: StyleSheetBuilder,
): StyleDescriptor[] | undefined {
    const result = tokenOrValues
        .map(tokenOrValue => parseUnparsed(tokenOrValue, builder))
        .filter(v => v !== undefined)

    if (result.length === 0) return

    let currentGroup: StyleDescriptor[] = []
    const groups: StyleDescriptor[][] = [currentGroup]

    for (const value of result) {
        if ((value as unknown) === COMMA_SEPARATOR) {
            currentGroup = []
            groups.push(currentGroup)
        } else {
            currentGroup.push(value)
        }
    }

    return variadic(groups)
}

export function unparsedFunction(
    token: Extract<TokenOrValue, { type: 'function' }>,
    builder: StyleSheetBuilder,
): StyleFunctionDescriptor {
    const args = reduceParseUnparsed(token.value.arguments, builder)
    return toStyleFunctionDescriptor({ type: 'function', func: token.value.name, value: args })
}

/**
 * Per lightningcss, an UnresolvedColor is "A color value with an unresolved
 * alpha value (e.g. a variable)."
 */
export function parseUnresolvedColor(
    color: UnresolvedColor,
    builder: StyleSheetBuilder,
): StyleDescriptorToken | undefined {
    if (!color || !color?.type) return

    switch (color.type) {
        case 'rgb':
            return {
                $type: 'color',
                $value: {
                    colorSpace: 'rgb',
                    components: [
                        round(color.r * 255),
                        round(color.g * 255),
                        round(color.b * 255),
                    ],
                    alpha: parseUnparsed(color.alpha, builder),
                }
            }
            // return [
            //     {},
            //     'rgba',
            //     [
            //         round(color.r * 255),
            //         round(color.g * 255),
            //         round(color.b * 255),
            //         parseUnparsed(color.alpha, builder),
            //     ],
            // ]
        case 'hsl':
            return {
                $type: 'color',
                $value: {
                    colorSpace: 'hsl',
                    components: [
                        color.h, color.s, color.l
                    ],
                    alpha: parseUnparsed(color.alpha, builder),
                }
            }
            // return [
            //     {},
            //     color.type,
            //     [color.h, color.s, color.l, parseUnparsed(color.alpha, builder)],
            // ]
        case 'light-dark':
            return undefined
        default:
            return color satisfies never
    }
}

/**
 * When the CSS cannot be parsed (often due to a runtime condition like a CSS variable)
 * This export function best efforts parsing it into a export function that we can evaluate at runtime
 */
export function parseUnparsed(
    tokenOrValue: TokenOrValue | TokenOrValue[] | string | number | undefined | null,
    builder: StyleSheetBuilder,
    allowAuto = false,
): StyleDescriptor {
    if (isNil(tokenOrValue)) return

    const t = getType(tokenOrValue)

    switch (t) {
        case 'string':
            if (isBooleanish(tokenOrValue)) {
                // return tokenOrValue === 'true'
                return {
                    $type: 'boolean',
                    $value: tokenOrValue === 'true',
                }
            } else {
                return {
                    $type: 'string',
                    $value: tokenOrValue,
                }
                // return tokenOrValue as string
            }
        case 'number':
            return {
                $type: 'number',
                $value: round(tokenOrValue as number),
            }
            // return round(tokenOrValue as number)
        case 'array':
            const args = reduceParseUnparsed(tokenOrValue as TokenOrValue[], builder)
            if (!args) return
            return variadic(args)
        case 'object':
            const token = tokenOrValue as TokenOrValue

            switch (token.type) {
                case 'unresolved-color': {
                    return parseUnresolvedColor(token.value, builder)
                }
                case 'var': {
                    const args: StyleDescriptor[] = [token.value.name.ident.slice(2)]
                    const fallback = parseUnparsed(token.value.fallback, builder)
                    if (fallback !== undefined) {
                        args.push(fallback)
                    }

                    return [{}, 'var', args, 1]
                }
                case 'function': {
                    switch (token.value.name) {
                        case 'translate':
                        case 'rotate':
                        case 'rotateX':
                        case 'rotateY':
                        case 'skewX':
                        case 'skewY':
                        case 'scale':
                        case 'scaleX':
                        case 'scaleY':
                        case 'translateX':
                        case 'translateY':
                            token.value.name = `@${token.value.name}`
                            return unparsedFunction(token, builder)
                        case 'platformColor':
                        case 'pixelSizeForLayoutSize':
                        case 'roundToNearestPixel':
                        case 'pixelScale':
                        case 'fontScale':
                        case 'shadow':
                        case 'rgb':
                        case 'rgba':
                        case 'hsl':
                        case 'hsla':
                        case 'linear-gradient':
                        case 'radial-gradient':
                            return unparsedFunction(token, builder)
                        case 'hairlineWidth':
                            return [{}, token.value.name, []]
                        case 'calc':
                        case 'max':
                        case 'min':
                        case 'clamp':
                            return parseCalcFn(
                                token.value.name,
                                token.value.arguments,
                                builder,
                            )
                        default: {
                            builder.addWarning('function', token.value.name)
                            return
                        }
                    }
                }
                case 'length':
                    return parseLength(token.value, builder)
                case 'angle':
                    return parseAngle(token.value, builder)
                case 'token':
                    switch (token.value.type) {
                        case 'string':
                        case 'number':
                        case 'ident': {
                            const value = token.value.value
                            if (typeof value === 'string') {
                                if (!allowAuto && value === 'auto') {
                                    builder.addWarning('value', value)
                                    return
                                }

                                if (value === 'inherit') {
                                    builder.addWarning('value', value)
                                    return
                                }

                                return isBooleanish(value) ? value === 'true' : value
                            } else {
                                return value
                            }
                        }
                        case 'function':
                            builder.addWarning('value', token.value.value)
                            return
                        case 'percentage':
                            return `${round(token.value.value * 100)}%`
                        case 'dimension':
                            return parseDimension(token.value, builder)
                        case 'comma':
                            return CommaSeparator as unknown as StyleDescriptor
                        case 'at-keyword':
                        case 'hash':
                        case 'id-hash':
                        case 'unquoted-url':
                        case 'delim':
                        case 'white-space':
                        case 'comment':
                        case 'colon':
                        case 'semicolon':
                        case 'include-match':
                        case 'dash-match':
                        case 'prefix-match':
                        case 'suffix-match':
                        case 'substring-match':
                        case 'cdo':
                        case 'cdc':
                        case 'parenthesis-block':
                        case 'square-bracket-block':
                        case 'curly-bracket-block':
                        case 'bad-url':
                        case 'bad-string':
                        case 'close-parenthesis':
                        case 'close-square-bracket':
                        case 'close-curly-bracket':
                            return
                        default: {
                            token.value satisfies never
                            return
                        }
                    }
                case 'color':
                    return parseColor(token.value, builder)
                case 'env':
                    return parseEnv(token.value, builder)
                case 'time':
                    return parseTime(token.value)
                case 'url':
                case 'resolution':
                case 'dashed-ident':
                case 'animation-name':
                    return
                default: {
                    tokenOrValue satisfies never
                }
            }

    return
}
