import { isUndefined } from 'es-toolkit'
import { StyleSheet } from 'react-native-unistyles'

import {
    getBorder,
    getBoxShadow,
    getColor,
    getPadding,
    getPaddingBottom,
    getPaddingLeft,
    getPaddingRight,
    getPaddingTop,
    getPaddingX,
    getPaddingY,
    getRingOffsetStyles,
    getSizeVariant,
    getZIndex,
} from '../../design-system/design-system.utils'
import { RadiiToken } from '../../design-system/design-tokens/radii'
import { ShadowToken } from '../../design-system/design-tokens/shadows'
import { $Unistyle } from '../../lib/unistyles/stylesheet'
import { UnistylesTheme } from '../../theme/theme.types'
import { RingOffsetStyleProps, ThemeStyleProps, themeStyleProps } from './style.types'

// type _UnistylesValues = Parameters<(typeof StyleSheet)['create']>[0]
// type UnistylesValues<U extends _UnistylesValues = _UnistylesValues> =
//     U extends infer UFn extends (...args: any[]) => _UnistylesValues ? ReturnType<UFn>
//     : _UnistylesValues extends { [styleName: string]: _UnistylesValues } ? _UnistylesValues
//     : never

type RingOffsetProp = keyof RingOffsetStyleProps
const ringOffsetProps: RingOffsetProp[] = [
    'ringOffsetWidth',
    'ringOffsetColor',
    'ringOpacity',
] as const

function isRingOffsetProp(prop: unknown): prop is RingOffsetProp {
    return ringOffsetProps.includes(prop as RingOffsetProp)
}

export function resolveThemeProps<Theme extends UnistylesTheme, Props extends ThemeStyleProps>(
    theme: Theme,
    props: Props,
): $Unistyle.Values {
    let hasRingOffset = false
    const init: $Unistyle.Values = {}

    // function assignProp(obj: $Unistyle.Values) {
    //     return (entry: $Unistyle.Styles) => Object.assign(obj, entry)
    // }

    // let assign: ReturnType<typeof assignProp>

    const filteredProps = themeStyleProps.filter(prop => !isUndefined(props[prop]))

    return filteredProps.reduce((acc, prop) => {
        if (isRingOffsetProp(prop) && !hasRingOffset) {
            const { ringOffsetWidth, ringOffsetColor, ringOpacity } = props
            return Object.assign(
                acc,
                getRingOffsetStyles(theme, { ringOffsetWidth, ringOffsetColor, ringOpacity }),
            )
        }
        if (typeof props[prop] !== 'undefined') {
            const value = props[prop]

            switch (prop) {
                case 'absoluteFill':
                    return Object.assign(acc, theme.utils.absoluteFill)
                case 'alignItems':
                    return Object.assign(acc, { alignItems: value })
                case 'display':
                    return Object.assign(acc, { display: value })
                case 'justifyContent':
                    return Object.assign(acc, { justifyContent: value })
                case 'backgroundColor':
                    return Object.assign(acc, {
                        backgroundColor: getColor(theme, props.color ?? 'bg'),
                    })
                case 'border':
                    return Object.assign(
                        acc,
                        getBorder(theme, props.border, { borderColor: props?.borderColor }),
                    )
                case 'borderRadius':
                    return Object.assign(acc, theme.radii[value as RadiiToken])
                case 'boxShadow':
                    return Object.assign(acc, getBoxShadow(theme, value as ShadowToken))
                case 'color':
                    return Object.assign(acc, { color: getColor(theme, props.color ?? 'fg') })
                case 'padding':
                    return Object.assign(acc, getPadding(theme, props.padding ?? 'none'))
                case 'paddingTop':
                    return Object.assign(acc, getPaddingTop(theme, props.paddingTop ?? 'none'))
                case 'paddingRight':
                    return Object.assign(acc, getPaddingRight(theme, props.paddingRight ?? 'none'))
                case 'paddingBottom':
                    return Object.assign(
                        acc,
                        getPaddingBottom(theme, props.paddingBottom ?? 'none'),
                    )
                case 'paddingLeft':
                    return Object.assign(acc, getPaddingLeft(theme, props.paddingLeft ?? 'none'))
                case 'paddingX':
                    return Object.assign(acc, getPaddingX(theme, props.paddingX ?? 'none'))
                case 'paddingY':
                    return Object.assign(acc, getPaddingY(theme, props.paddingY ?? 'none'))
                case 'height':
                    return Object.assign(acc, getSizeVariant(props.height!, theme).height)
                case 'width':
                    return Object.assign(acc, getSizeVariant(props.width!, theme).width)
                case 'size':
                    return Object.assign(acc, getSizeVariant(props.size!, theme))
                case 'zIndex':
                    return Object.assign(acc, getZIndex(theme, props.zIndex!))
                default:
                    return acc
            }
        }
        return acc
    }, init)
}
