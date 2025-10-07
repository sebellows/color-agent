import { Animated } from 'react-native'

import { isNull, isString } from 'es-toolkit'
import { isNumber } from 'es-toolkit/compat'
import z from 'zod/v4'

const alignItemsProps = ['center', 'start', 'end', 'stretch', 'baseline'] as const
export const AlignItemsSchema = z.enum(alignItemsProps).transform(value => {
    switch (value) {
        case 'start':
        case 'end':
            return `flex-${value}`
        case 'baseline':
        case 'center':
        case 'stretch':
            return value
        default:
            value satisfies never
    }
})

const justifyContentProps = ['center', 'start', 'end', 'between', 'around', 'evenly'] as const
export const JustifyContentSchema = z.enum(justifyContentProps).transform(value => {
    switch (value) {
        case 'around':
        case 'between':
        case 'evenly':
            return `space-${value}`
        case 'start':
        case 'end':
            return `flex-${value}`
        case 'center':
            return value
        default:
            value satisfies never
    }
})

const alignContentOptions = [
    'center',
    'start',
    'end',
    'between',
    'around',
    'evenly',
    'stretch',
] as const
export const AlignContentSchema = z.enum(alignContentOptions).transform(value => {
    switch (value) {
        case 'around':
        case 'between':
        case 'evenly':
            return `space-${value}`
        case 'start':
        case 'end':
            return `flex-${value}`
        case 'center':
        case 'stretch':
            return value
        default:
            value satisfies never
    }
})

const flexWrapOptions = ['wrap', 'nowrap', 'wrap-reverse'] as const
export const FlexWrapSchema = z.enum(flexWrapOptions).transform(value => {
    switch (value) {
        case 'nowrap':
        case 'wrap':
        case 'wrap-reverse':
            return value
        default:
            value satisfies never
    }
})

const layoutAxisOptions = ['x', 'y'] as const
export const LayoutAxisSchema = z.enum(layoutAxisOptions).transform(value => {
    switch (value) {
        case 'x':
        case 'y':
            return value
        default:
            value satisfies never
    }
})

const boxSizingOptions = ['border-box', 'content-box'] as const
export const BoxSizingSchema = z.enum(boxSizingOptions).transform(value => {
    switch (value) {
        case 'border-box':
        case 'content-box':
            return value
        default:
            value satisfies never
    }
})

const displayOptions = ['none', 'flex', 'contents'] as const
export const DisplaySchema = z.enum(displayOptions).transform(value => {
    switch (value) {
        case 'none':
        case 'flex':
        case 'contents':
            return value
        default:
            value satisfies never
    }
})

export const DimensionSchema = z
    .union([z.number(), z.string(), z.object(), z.null()])
    .transform(value => {
        if (isNumber(value) || isNull(value)) {
            return value
        }
        if (isString(value)) {
            if (value === 'auto') {
                return value
            }
            if (value.endsWith('%') && isNumber(parseFloat(value))) {
                return value
            }
        }
        if (value instanceof Animated.AnimatedNode) {
            return value
        }

        console.warn(`Invalid value of "${value}" passed for dimenions`)
        return undefined
    })

const positionOptions = ['absolute', 'relative', 'static'] as const
export const PositionSchema = z.enum(positionOptions).transform(value => {
    switch (value) {
        case 'absolute':
        case 'relative':
        case 'static':
            return value
        default:
            value satisfies never
    }
})

const overflowOptions = ['visible', 'hidden', 'scroll'] as const
export const OverflowSchema = z.enum(overflowOptions).transform(value => {
    switch (value) {
        case 'hidden':
        case 'scroll':
        case 'visible':
            return value
        default:
            value satisfies never
    }
})

const directionOptions = ['inherit', 'ltr', 'rtl'] as const
export const DirectionSchema = z.enum(directionOptions).transform(value => {
    switch (value) {
        case 'inherit':
        case 'ltr':
        case 'rtl':
            return value
        default:
            value satisfies never
    }
})
