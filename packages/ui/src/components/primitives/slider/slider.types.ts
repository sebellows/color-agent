import type { SlottableViewProps } from '../types'

type RootProps = SlottableViewProps & {
    value: number
    disabled?: boolean
    min?: number
    max?: number
    /**
     * Platform: WEB ONLY
     */
    dir?: 'ltr' | 'rtl'
    /**
     * Platform: WEB ONLY
     */
    inverted?: boolean
    /**
     * Platform: WEB ONLY
     */
    step?: number
    /**
     * Platform: WEB ONLY
     */
    onValueChange?: (value: number[]) => void
}

type TrackProps = SlottableViewProps
type RangeProps = SlottableViewProps
type ThumbProps = SlottableViewProps

export type { RangeProps, RootProps, ThumbProps, TrackProps }
