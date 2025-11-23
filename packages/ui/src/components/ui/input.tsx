import * as React from 'react'
import { TextInput, TextInputProps } from 'react-native'

import { useUnistyles } from 'react-native-unistyles'

import { getColor } from '../../design-system/design-system.utils'
import { Color } from '../../theme/theme.types'
import { RNTextInput } from '../../types'
import { uiStyles } from './styles'

type InputProps = Omit<React.ComponentPropsWithRef<RNTextInput>, 'placeholderTextColor'> & {
    placeholderTextColor?: TextInputProps['placeholderTextColor'] | Color
}

const { input } = uiStyles

const Input = ({ ref, style, placeholderTextColor, ...props }: InputProps) => {
    const { theme } = useUnistyles()
    const placeholderColor = getColor(theme, placeholderTextColor ?? 'fgMuted')

    return (
        <TextInput
            ref={ref}
            style={[input.main(props), style]}
            placeholderTextColor={placeholderColor}
            {...props}
        />
    )
}

Input.displayName = 'Input'

export { Input }

// const styles = StyleSheet.create(theme => ({
//     input: {
//         variants: {
//             variant: {},
//         },
//         _focused: {
//             true: {
//                 // 'border-neutral-400 dark:border-neutral-300'
//             },
//         },
//         _error: {
//             true: {
//                 // 'border-danger-600',
//             },
//         },
//         _disabled: {
//             true: {
//                 // 'bg-neutral-200',
//             },
//         },
//     },
//     // label: 'text-danger-600 dark:text-danger-600',
// }))
