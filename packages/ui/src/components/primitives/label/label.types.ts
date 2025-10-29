import { ViewStyle } from 'react-native'

import { SlottablePressableProps, SlottableTextProps } from '@ui/types/react-native.types'

export type RootProps = Omit<SlottablePressableProps, 'children' | 'hitSlop' | 'style'> & {
    children: React.ReactNode
    style?: ViewStyle
}

export type TextProps = SlottableTextProps & {
    /**
     * Equivalent to `id` so that the same value can be passed as `aria-labelledby` to the input element.
     */
    nativeID?: string

    /** Plateform: WEB ONLY */
    htmlFor?: string
}
