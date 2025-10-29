import { Pressable } from 'react-native'

import { Slot } from '@ui/components/primitives/slot'
import { Text as RNText } from '@ui/components/text'
import { RootProps, TextProps } from './label.types'

const Root = ({ ref, asChild, ...props }: RootProps) => {
    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} {...props} />
}

Root.displayName = 'LabelRoot.Native'

const Text = ({ ref, asChild, ...props }: TextProps) => {
    const Component = asChild ? Slot.Text : RNText

    return <Component ref={ref} {...props} />
}

Text.displayName = 'LabelText.Native'

export { Root, Text }
