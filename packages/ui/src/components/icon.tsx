import { memo } from 'react'
import type { AccessibilityProps, ViewStyle } from 'react-native'

import FeatherIcon from '@expo/vector-icons/Feather'
import { useUnistyles } from 'react-native-unistyles'

import type { Color } from '../theme/theme.types'

export type IconName = keyof (typeof FeatherIcon)['glyphMap']

type Props = {
    name: IconName
    color?: Color
    size?: number
    style?: ViewStyle
}

export const Icon = memo(function Icon({
    name,
    color = 'fg',
    size = 24,
    style,
    ...props
}: Props & AccessibilityProps) {
    const { theme } = useUnistyles()
    const iconColor = theme.utils.getColor(color)
    return (
        <FeatherIcon
            {...props}
            name={name}
            width={size}
            height={size}
            color={iconColor}
            style={style}
        />
    )
})
