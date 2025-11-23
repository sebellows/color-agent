import { ViewStyle } from 'react-native'

import { IconProps as UiIconProps } from '../../ui/icon'
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

export type RootProps = SlottableViewProps & {
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

export type TriggerProps = SlottablePressableProps

export type ValueProps = SlottableTextProps & {
    placeholder: string
}

export type IconProps = SlottableViewProps & UiIconProps & { selectIconWrapperStyle?: ViewStyle }

export interface PortalProps extends ForceMountable {
    children: React.ReactNode
    /** Platform: NATIVE ONLY */
    hostName?: string
    /** Platform: WEB ONLY */
    container?: HTMLElement | null | undefined
}

export type OverlayProps = ForceMountable &
    SlottablePressableProps & {
        closeOnPress?: boolean
    }

export type ContentProps = SlottableViewProps &
    PositionedContentProps & {
        /** Platform: WEB ONLY */
        position?: 'popper' | 'item-aligned' | undefined
    }

export type ItemProps = SlottablePressableProps & {
    value: string
    label: string
    closeOnPress?: boolean
}

export type ItemTextProps = Omit<SlottableTextProps, 'children'>

export type ItemIndicatorProps = SlottableViewProps & ForceMountable

export type GroupProps = SlottableViewProps

export type LabelProps = SlottableTextProps

export type SeparatorProps = SlottableViewProps & { decorative?: boolean }

export type ScrollButtonProps = React.ComponentPropsWithoutRef<'div'>

export type ViewportProps = React.ComponentPropsWithoutRef<'div'>
