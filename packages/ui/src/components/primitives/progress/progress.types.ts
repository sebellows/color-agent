import { SlottableViewProps } from '../../../types'

type RootProps = SlottableViewProps & {
    value?: number | null | undefined
    max?: number
    getValueLabel?(value: number, max: number): string
}

type IndicatorProps = SlottableViewProps

export type { IndicatorProps, RootProps }
