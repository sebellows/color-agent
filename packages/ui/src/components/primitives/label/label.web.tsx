import { Pressable, Text as RNText } from 'react-native'

import { Label } from 'radix-ui'

import { Slot } from '@ui/components/primitives/slot'
import { RootProps, TextProps } from './label.types'

const Root = ({ ref, asChild, tabIndex = -1, ...props }: RootProps) => {
    const Component = asChild ? Slot.Pressable : Pressable
    return <Component ref={ref} tabIndex={tabIndex} {...props} />
}

Root.displayName = 'LabelRoot.Web'

const Text = ({ ref, asChild, nativeID, htmlFor, ...props }: TextProps) => {
    const Component = asChild ? Slot.Text : RNText
    return (
        <Label.Root asChild={!htmlFor} id={nativeID} htmlFor={htmlFor}>
            <Component ref={ref} {...props} />
        </Label.Root>
    )
}

Text.displayName = 'LabelText.Web'

export { Root, Text }
