import {
    ForceMountable,
    SlottablePressableProps,
    SlottableViewProps,
} from '@ui/types/react-native.types'

export type RootProps = SlottableViewProps & {
    value: string | undefined
    onValueChange: (val: string) => void
    disabled?: boolean
}

export type ItemProps = SlottablePressableProps & {
    value: string
    /**
     * nativeID of the label element that describes this radio group item
     */
    'aria-labelledby'?: string
}

export type IndicatorProps = SlottableViewProps & ForceMountable
