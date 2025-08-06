import { cssColorNamesSet } from '@core/colors/css-color-names'
import { toStyleFunctionDescriptor } from '@core/react-native-css/runtime/utils'
import { round } from '@core/utils'
import Color from 'colorjs.io'
import {
    Angle,
    ColorOrAuto,
    CssColor,
    DimensionPercentageFor_LengthValue,
    Length,
    LengthValue,
    MaxSize,
    NumberOrPercentage,
    Size,
    Size2DFor_DimensionPercentageFor_LengthValue,
    Time,
    UnresolvedColor,
} from 'lightningcss'

import { parseUnparsed } from '../declarations'
import { StyleSheetBuilder } from '../stylesheet'
import { StyleDescriptor, StyleFunctionDescriptor } from '../types'

export function parseLength(
    length: number | Length | DimensionPercentageFor_LengthValue | NumberOrPercentage | LengthValue,
    builder: StyleSheetBuilder,
): StyleDescriptor {
    const { inlineRem = 14 } = builder.getOptions()

    if (typeof length === 'number') {
        return length
    }

    if ('unit' in length) {
        switch (length.unit) {
            case 'px':
                return length.value
            case 'rem':
                if (typeof inlineRem === 'number') {
                    return length.value * inlineRem
                } else {
                    return toStyleFunctionDescriptor({
                        type: 'length',
                        func: 'rem',
                        value: length.value,
                    }) //[{}, 'rem', [length.value]]
                }
            case 'vw':
            case 'vh':
            case 'em':
                return [{}, length.unit, [length.value], 1]
            case 'in':
            case 'cm':
            case 'mm':
            case 'q':
            case 'pt':
            case 'pc':
            case 'ex':
            case 'rex':
            case 'ch':
            case 'rch':
            case 'cap':
            case 'rcap':
            case 'ic':
            case 'ric':
            case 'lh':
            case 'rlh':
            case 'lvw':
            case 'svw':
            case 'dvw':
            case 'cqw':
            case 'lvh':
            case 'svh':
            case 'dvh':
            case 'cqh':
            case 'vi':
            case 'svi':
            case 'lvi':
            case 'dvi':
            case 'cqi':
            case 'vb':
            case 'svb':
            case 'lvb':
            case 'dvb':
            case 'cqb':
            case 'vmin':
            case 'svmin':
            case 'lvmin':
            case 'dvmin':
            case 'cqmin':
            case 'vmax':
            case 'svmax':
            case 'lvmax':
            case 'dvmax':
            case 'cqmax':
                builder.addWarning('value', `${length.value}${length.unit}`)
                return undefined
            default: {
                length.unit satisfies never
            }
        }
    } else {
        switch (length.type) {
            case 'calc': {
                // TODO: Add the calc polyfill
                return undefined
            }
            case 'number': {
                return round(length.value)
            }
            case 'percentage': {
                return `${round(length.value * 100)}%`
            }
            case 'dimension':
            case 'value': {
                return parseLength(length.value, builder)
            }
        }
    }

    return
}

export function parseAngle(angle: Angle | number, builder: StyleSheetBuilder) {
    if (typeof angle === 'number') {
        return `${angle}deg`
    }

    switch (angle.type) {
        case 'deg':
        case 'rad':
            return `${angle.value}${angle.type}`
        default:
            builder.addWarning('value', angle.value)
            return undefined
    }
}

export function parseSizeDeclaration(
    declaration: { value: Size | MaxSize },
    builder: StyleSheetBuilder,
) {
    return parseSize(declaration.value, builder)
}

export function parseSize(
    size: Size | MaxSize,
    builder: StyleSheetBuilder,
    options?: { allowAuto?: boolean },
): StyleDescriptor
export function parseSize(
    size: Size | MaxSize,
    builder: StyleSheetBuilder,
    property: string,
    options?: { allowAuto?: boolean },
): StyleDescriptor
export function parseSize(
    size: Size | MaxSize,
    builder: StyleSheetBuilder,
    options?: string | { allowAuto?: boolean },
    { allowAuto = false } = {},
) {
    allowAuto = (typeof options === 'object' ? options.allowAuto : allowAuto) ?? false

    switch (size.type) {
        case 'length-percentage':
            return parseLength(size.value, builder)
        case 'none':
            return size.type
        case 'auto':
            if (allowAuto) {
                return size.type
            } else {
                builder.addWarning('value', size.type)
                return undefined
            }
        case 'min-content':
        case 'max-content':
        case 'fit-content':
        case 'fit-content-function':
        case 'stretch':
        case 'contain':
            builder.addWarning('value', size.type)
            return undefined
        default: {
            size satisfies never
        }
    }

    return
}

export function parseTime(time: Time) {
    return time.type === 'milliseconds' ? time.value : time.value * 1000
}

export function parseSize2DDimensionPercentageDeclaration(
    declaration: { value: Size2DFor_DimensionPercentageFor_LengthValue },
    builder: StyleSheetBuilder,
) {
    return parseSize2DDimensionPercentage(declaration.value, builder)
}

export function parseSize2DDimensionPercentage(
    value: Size2DFor_DimensionPercentageFor_LengthValue,
    builder: StyleSheetBuilder,
) {
    return parseLength(value[0], builder)
}

export function parseUnresolvedColor(
    color: UnresolvedColor,
    builder: StyleSheetBuilder,
): StyleFunctionDescriptor<'unresolved-color'> | undefined {
    switch (color.type) {
        case 'rgb':
            return toStyleFunctionDescriptor({
                type: 'unresolved-color',
                valueType: 'rgb',
                value: [
                    round(color.r * 255),
                    round(color.g * 255),
                    round(color.b * 255),
                    parseUnparsed(color.alpha, builder),
                ],
                computed: true,
            })
        case 'hsl':
            return toStyleFunctionDescriptor({
                type: 'unresolved-color',
                valueType: color.type,
                value: [color.h, color.s, color.l, parseUnparsed(color.alpha, builder)],
                computed: true,
            })
        case 'light-dark':
            return undefined
        default:
            return color satisfies never
    }
}

export function parseColorOrAuto({ value }: { value: ColorOrAuto }, builder: StyleSheetBuilder) {
    if (value.type === 'auto') {
        builder.addWarning('value', `Invalid color value ${value.type}`)
        return undefined
    } else {
        return parseColor(value.value, builder)
    }
}

export function parseColorDeclaration(
    declaration: { value: CssColor },
    builder: StyleSheetBuilder,
) {
    return parseColor(declaration.value, builder)
}

export function parseColor(cssColor: CssColor, builder: StyleSheetBuilder) {
    if (typeof cssColor === 'string') {
        return cssColorNamesSet.has(cssColor) ? cssColor : undefined
    }

    let color: Color | undefined

    const { colorPrecision = 3 } = builder.getOptions()

    switch (cssColor.type) {
        case 'currentcolor':
            builder.addWarning('value', cssColor.type)
            return undefined
        case 'light-dark':
            // TODO: Handle light-dark colors
            return undefined
        case 'rgb': {
            color = new Color({
                space: 'sRGB',
                coords: [cssColor.r / 255, cssColor.g / 255, cssColor.b / 255],
                alpha: cssColor.alpha,
            })
            break
        }
        case 'hsl':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.h, cssColor.s, cssColor.l],
                alpha: cssColor.alpha,
            })
            break
        case 'oklch':
            color = new Color({
                space: cssColor.type,
                coords: [cssColor.l, cssColor.c, cssColor.h],
                alpha: cssColor.alpha,
            })
            break
        case 'hwb':
        case 'lab':
        case 'lch':
        case 'oklab':
        case 'srgb':
        case 'srgb-linear':
        case 'display-p3':
        case 'a98-rgb':
        case 'prophoto-rgb':
        case 'rec2020':
        case 'xyz-d50':
        case 'xyz-d65':
            // We are not bothering with these color spaces
            return undefined
        default: {
            return cssColor satisfies never
        }
    }

    return color.toString({ precision: colorPrecision })
}
