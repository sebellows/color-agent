import { View, type ViewStyle } from 'react-native'

import { Slot } from '../slot'
import type { SlottableViewProps } from '../types'

type RootProps = Omit<SlottableViewProps, 'style'> & {
    ratio?: number
    style?: ViewStyle
}

const Root = ({ ref, asChild, ratio = 1, style, ...props }: RootProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} style={[style, { aspectRatio: ratio }]} {...props} />
}

Root.displayName = 'AspectRatioRoot'

export { Root }
export type { RootProps }
