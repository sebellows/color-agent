import { StyleFunctionResolver, StyleFunctionsRegistry } from '../../../compiler'
import { animation } from './animation'
import { border } from './border'
import { boxShadow } from './box-shadow'
import { calc } from './calc'
import {
    fontScale,
    hairlineWidth,
    pixelRatio,
    pixelSizeForLayoutSize,
    platformColor,
    roundToNearestPixel,
} from './platform-functions'
import { textShadow } from './text-shadow'
import { transform } from './transform'
import { em, rem, vh, vw } from './units'

const shorthands: Record<`@${string}`, StyleFunctionResolver> = {
    '@textShadow': textShadow,
    '@transform': transform,
    '@boxShadow': boxShadow,
    '@border': border,
}

export const styleFunctions: StyleFunctionsRegistry = {
    calc,
    em,
    vw,
    vh,
    rem,
    platformColor,
    hairlineWidth,
    pixelRatio,
    fontScale,
    pixelSizeForLayoutSize,
    roundToNearestPixel,
    animationName: animation,
    ...shorthands,
}
