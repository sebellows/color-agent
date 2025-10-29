import type { ReactNode } from 'react'
import type { TouchableWithoutFeedbackProps } from 'react-native'

import { ColorScheme } from '../../design-system/design-tokens/colors.native'
import { type Color } from '../../theme/theme.types'
import { SlottablePressableProps } from '../../types/react-native.types'
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

export type IconButtonProps = SlottablePressableProps &
    ButtonOwnProps & {
        icon: IconName
        color?: ButtonColor
    }
