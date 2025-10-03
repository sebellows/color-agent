import { memo } from 'react'
import type { AccessibilityProps, ViewStyle } from 'react-native'

import icons from '@expo/vector-icons/Feather'
import { Color } from '@ui/theme'
import { SvgXml } from 'react-native-svg'
import { useUnistyles } from 'react-native-unistyles'

export type IconName = keyof typeof icons

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
    ...rest
}: Props & AccessibilityProps) {
    const { theme } = useUnistyles()
    const iconColor = theme.utils.getColor(color)
    return (
        <SvgXml
            {...rest}
            xml={icons[name]}
            width={size}
            height={size}
            color={iconColor}
            style={style}
        />
    )
})
