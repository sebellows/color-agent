import type { SlottableViewProps } from '../types'

type RootProps = SlottableViewProps & {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
}

export type { RootProps }
