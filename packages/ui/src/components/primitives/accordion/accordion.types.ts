import type { ForceMountable, SlottablePressableProps, SlottableViewProps } from '../types'

type RootContext = {
    type: 'single' | 'multiple'
    value: (string | undefined) | string[]
    onValueChange: (value: string | undefined) => void | ((value: string[]) => void)
    collapsible: boolean
    disabled?: boolean
}

type SingleRootProps = {
    type: 'single'
    defaultValue?: string | undefined
    value?: string | undefined
    onValueChange?: (value: string | undefined) => void
}

type MultipleRootProps = {
    type: 'multiple'
    defaultValue?: string[]
    value?: string[]
    onValueChange?: (value: string[]) => void
}

type RootProps = (SingleRootProps | MultipleRootProps) & {
    defaultValue?: string | string[]
    disabled?: boolean
    collapsible?: boolean
    /**
     * Platform: WEB ONLY
     */
    dir?: 'ltr' | 'rtl'
    /**
     * Platform: WEB ONLY
     */
    orientation?: 'vertical' | 'horizontal'
} & SlottableViewProps

type ItemProps = {
    value: string
    disabled?: boolean
} & SlottableViewProps

type ContentProps = ForceMountable & SlottableViewProps
type HeaderProps = SlottableViewProps
type TriggerProps = SlottablePressableProps

export type { ContentProps, HeaderProps, ItemProps, RootContext, RootProps, TriggerProps }
