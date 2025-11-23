import { StyleSheet } from 'react-native-unistyles'

import {
    getBorder,
    getBoxShadow,
    getColor,
    getPadding,
    getRingOffsetStyles,
    getSizeVariant,
    getZIndex,
    RingOffsetStyleProps,
} from '../../design-system/design-system.utils'
import { RadiiToken } from '../../design-system/design-tokens/radii'
import { ShadowToken } from '../../design-system/design-tokens/shadows'
import { UnistylesTheme } from '../../theme/theme.types'
import { ThemeStyleProps } from './util.types'

type _UnistylesValues = Parameters<(typeof StyleSheet)['create']>[0]
type UnistylesValues<U extends _UnistylesValues = _UnistylesValues> =
    U extends infer UFn extends (...args: any[]) => _UnistylesValues ? ReturnType<UFn>
    : _UnistylesValues extends { [styleName: string]: _UnistylesValues } ? _UnistylesValues
    : never

type RingOffsetProp = keyof RingOffsetStyleProps
const ringOffsetProps: RingOffsetProp[] = [
    'ringOffsetWidth',
    'ringOffsetColor',
    'ringOpacity',
] as const
// backgroundColor?: Color
// border?: boolean | number
// borderColor?: Color
// borderRadius?: Radii
// boxShadow?: ShadowToken
// color?: Color
// height?: SizeToken
// justifyContent?: ViewStyle['justifyContent']
// padding?: Space
// size?: SizeToken
// width?: SizeToken
// zIndex?: ZIndicesToken

const themeStyleProps: (keyof ThemeStyleProps)[] = [
    'backgroundColor',
    'border',
    'borderRadius',
    'boxShadow',
    'color',
    'height',
    'justifyContent',
    'padding',
    'ringOffsetWidth',
    'ringOffsetColor',
    'ringOpacity',
    'size',
    'width',
    'zIndex',
] as const

function isRingOffsetProp(prop: unknown): prop is RingOffsetProp {
    return ringOffsetProps.includes(prop as RingOffsetProp)
}

export function resolveThemeProps<Theme extends UnistylesTheme, Props extends ThemeStyleProps>(
    theme: Theme,
    props: Props,
) {
    let hasRingOffset = false
    const init: UnistylesValues = {}

    return themeStyleProps.reduce((acc, prop) => {
        if (isRingOffsetProp(prop) && !hasRingOffset) {
            const { ringOffsetWidth, ringOffsetColor, ringOpacity } = props
            return Object.assign(
                acc,
                getRingOffsetStyles(theme, { ringOffsetWidth, ringOffsetColor, ringOpacity }),
            )
        }
        if (prop in props && props[prop]) {
            const value = props[prop]

            switch (prop) {
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
                case 'height':
                    return Object.assign(acc, getSizeVariant(props.height).height)
                case 'width':
                    return Object.assign(acc, getSizeVariant(props.width).width)
                case 'size':
                    return Object.assign(acc, getSizeVariant(props.size))
                case 'zIndex':
                    return Object.assign(acc, getZIndex(theme, props.zIndex))
                default:
            }
        }
        return acc
    }, init)
}
