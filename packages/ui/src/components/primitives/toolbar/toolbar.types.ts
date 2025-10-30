import type { SlottablePressableProps, SlottableViewProps } from '../types'

type RootProps = SlottableViewProps & {
    /**
     * Platform: WEB ONLY
     */
    orientation?: 'horizontal' | 'vertical'
    /**
     * Platform: WEB ONLY
     */
    dir?: 'ltr' | 'rtl'
    /**
     * Platform: WEB ONLY
     */
    loop?: boolean
}

type SingleToggleGroupProps = {
    type: 'single'
    value: string | undefined
    onValueChange: (val: string | undefined) => void
}

type MultipleToggleGroupProps = {
    type: 'multiple'
    value: string[]
    onValueChange: (val: string[]) => void
}

type ToggleGroupProps = (SingleToggleGroupProps | MultipleToggleGroupProps) & {
    disabled?: boolean
} & SlottableViewProps

type ToggleItemProps = SlottablePressableProps & {
    value: string
}

type SeparatorProps = SlottableViewProps
type LinkProps = SlottablePressableProps
type ButtonProps = SlottablePressableProps

export type { ButtonProps, LinkProps, RootProps, SeparatorProps, ToggleGroupProps, ToggleItemProps }
