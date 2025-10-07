import { useCallback, useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { Icon } from '../icon'

type Props = {
    accessibilityLabel?: string
    accessibilityHint?: string
    showText?: boolean
    onShow?: (value: boolean) => boolean
}

export const TextMaskToggle = ({
    showText: initialShowText = false,
    accessibilityHint: initialAccessibilityHint,
    accessibilityLabel = 'Toggle visibility',
    onShow,
}: Props) => {
    const [showText, setShowText] = useState(initialShowText)
    const accessibilityHint = useMemo(
        () =>
            initialAccessibilityHint ?? showText ?
                'Hide text by toggling visibility'
            :   'Show text by toggling visibility',
        [showText, initialAccessibilityHint],
    )

    const onPress = useCallback(() => {
        const show = !showText
        setShowText(show)
        onShow?.(show)
    }, [showText, setShowText, onShow])

    return (
        <View style={styles.maskToggle}>
            <TouchableOpacity
                onPress={onPress}
                accessible
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
            >
                {showText ?
                    <Icon name="eye" size={20} color="text" />
                :   <Icon name="eye-off" size={20} color="text" />}
            </TouchableOpacity>
        </View>
    )
}

TextMaskToggle.displayName = 'TextMaskToggle'

const styles = StyleSheet.create(theme => ({
    maskToggle: {
        flexDirection: 'row',
        paddingRight: theme.space.xs,
    },
}))
