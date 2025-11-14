import type {
    ForceMountable,
    SlottablePressableProps,
    SlottableViewProps,
} from '../../primitives/types'

type RootProps = SlottablePressableProps & {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
}

type TriggerProps = SlottablePressableProps

type IndicatorProps = ForceMountable & SlottableViewProps

export type { IndicatorProps, RootProps, TriggerProps }
