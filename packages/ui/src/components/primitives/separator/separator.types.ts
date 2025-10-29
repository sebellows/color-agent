import type { SlottableViewProps } from '../../../types/react-native.types'

type RootProps = SlottableViewProps & {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
}

export type { RootProps }
