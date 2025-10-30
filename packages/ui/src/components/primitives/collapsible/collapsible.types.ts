import type { ForceMountable, SlottablePressableProps, SlottableViewProps } from '../types'

interface RootContext {
    open: boolean
    onOpenChange: (open: boolean) => void
    disabled: boolean
}

type RootProps = SlottableViewProps & {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
}

type TriggerProps = SlottablePressableProps
type ContentProps = ForceMountable & SlottableViewProps

export type { ContentProps, RootContext, RootProps, TriggerProps }
