import type { SlottablePressableProps, SlottableTextProps, SlottableViewProps } from '../types'

type RootProps = SlottableViewProps & {
    open: boolean
    onOpenChange: (value: boolean) => void
    type?: 'foreground' | 'background'
}

type CloseProps = SlottablePressableProps
type ActionProps = SlottablePressableProps
type TitleProps = SlottableTextProps
type DescriptionProps = SlottableTextProps

export type { ActionProps, CloseProps, DescriptionProps, RootProps, TitleProps }
