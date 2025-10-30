import { ViewStyle } from 'react-native'

import { IconProps } from '@ui/components/icon'

import type {
    ForceMountable,
    PositionedContentProps,
    SlottablePressableProps,
    SlottableTextProps,
    SlottableViewProps,
} from '../types'

export type Option =
    | {
          value: string
          label: string
      }
    | undefined

export interface SharedRootContext {
    value: Option
    onValueChange: (option: Option) => void
    disabled?: boolean
}

export type SelectRootProps = SlottableViewProps & {
    value?: Option
    defaultValue?: Option
    onValueChange?: (option: Option) => void
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
    /** Platform: WEB ONLY */
    dir?: 'ltr' | 'rtl'
    /** Platform: WEB ONLY */
    name?: string
    /** Platform: WEB ONLY */
    required?: boolean
}

export type SelectTriggerProps = SlottablePressableProps

export type SelectValueProps = SlottableTextProps & {
    placeholder: string
}

export type SelectIconProps = SlottableViewProps &
    IconProps & { selectIconWrapperStyle?: ViewStyle }

export interface SelectPortalProps extends ForceMountable {
    children: React.ReactNode
    /** Platform: NATIVE ONLY */
    hostName?: string
    /** Platform: WEB ONLY */
    container?: HTMLElement | null | undefined
}

export type SelectOverlayProps = ForceMountable &
    SlottablePressableProps & {
        closeOnPress?: boolean
    }

export type SelectContentProps = SlottableViewProps &
    PositionedContentProps & {
        /** Platform: WEB ONLY */
        position?: 'popper' | 'item-aligned' | undefined
    }

export type SelectItemProps = SlottablePressableProps & {
    value: string
    label: string
    closeOnPress?: boolean
}

export type SelectItemTextProps = Omit<SlottableTextProps, 'children'>

export type SelectItemIndicatorProps = SlottableViewProps & ForceMountable

export type SelectGroupProps = SlottableViewProps

export type SelectLabelProps = SlottableTextProps

export type SelectSeparatorProps = SlottableViewProps & { decorative?: boolean }

export type SelectScrollButtonProps = React.ComponentPropsWithoutRef<'div'>

export type SelectViewportProps = React.ComponentPropsWithoutRef<'div'>
