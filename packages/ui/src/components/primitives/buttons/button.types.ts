import type { ReactNode } from 'react'
import type { PressableProps, TouchableWithoutFeedbackProps } from 'react-native'

import { Color, ColorScheme } from '@ui/theme'

import type { IconName } from '../icon'

export type ButtonSize = 'small' | 'normal' | 'large'

export type ButtonColor = ColorScheme | Color

export type ButtonVariant = 'filled' | 'soft' | 'outlined' | 'plain'

export type ButtonOwnProps = {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
}

export type ButtonProps = TouchableWithoutFeedbackProps &
    ButtonOwnProps & {
        color?: ButtonColor
        children: ReactNode
        icon?: IconName
        iconPlacement?: 'start' | 'end'
    }

export type IconButtonProps = PressableProps &
    ButtonOwnProps & {
        icon: IconName
        color?: ButtonColor
    }
