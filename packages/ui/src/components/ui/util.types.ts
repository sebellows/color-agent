import { ViewStyle } from 'react-native'

import { AnyRecord } from '@coloragent/utils'
import { Simplify } from 'type-fest'

import { RingOffsetStyleProps } from '../../design-system/design-system.utils'
import { ShadowToken } from '../../design-system/design-tokens/shadows'
import { SizeToken } from '../../design-system/design-tokens/sizes'
import { ZIndicesToken } from '../../design-system/design-tokens/z-indices'
import { Color, Radii, Space } from '../../theme/theme.types'
import { Direction } from '../../types/common'

export type WithInset<Props extends AnyRecord> = Simplify<Props & { inset?: boolean }>

export type WithPortalHost<Props extends AnyRecord> = Simplify<Props & { portalHost?: string }>

export type ThemeStyleProps = Simplify<
    {
        backgroundColor?: Color
        border?: boolean | number
        borderColor?: Color
        borderRadius?: Radii
        boxShadow?: ShadowToken
        color?: Color
        height?: SizeToken
        justifyContent?: ViewStyle['justifyContent']
        padding?: Space | Partial<Record<Direction, Space>>
        size?: SizeToken
        width?: SizeToken
        zIndex?: ZIndicesToken
    } & RingOffsetStyleProps
>

export type WithThemeStyleProps<Props extends AnyRecord> = ThemeStyleProps & Props
