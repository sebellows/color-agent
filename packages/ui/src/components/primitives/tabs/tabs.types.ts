import type { ForceMountable, SlottablePressableProps, SlottableViewProps } from '../../../types'

type RootProps = SlottableViewProps & {
    value: string
    onValueChange: (value: string) => void
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
    activationMode?: 'automatic' | 'manual'
}

type ListProps = SlottableViewProps
type TriggerProps = SlottablePressableProps & {
    value: string
}
type ContentProps = SlottableViewProps &
    ForceMountable & {
        value: string
    }

export type { ContentProps, ListProps, RootProps, TriggerProps }
