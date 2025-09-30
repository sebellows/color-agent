import React from 'react'
import { View, type ViewStyle } from 'react-native'

import { Slot, type ViewSlotProps } from '../slot'

type RootProps = Omit<ViewSlotProps, 'style'> & {
    ratio?: number
    style?: ViewStyle
}

const Root = ({ ref, asChild, ratio = 1, style, ...props }: RootProps) => {
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} style={[style, { aspectRatio: ratio }]} {...props} />
}

Root.displayName = 'RootAspectRatio'
