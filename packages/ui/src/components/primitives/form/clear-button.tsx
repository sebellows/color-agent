import { AccessibilityProps } from 'react-native'

import { IconButton } from '../buttons/icon-button'

type Props = AccessibilityProps & {
    disabled?: boolean
    onClear?: () => void
}

export const ClearButton = ({
    disabled,
    accessibilityHint = 'Double tap to clear the input',
    accessibilityLabel = 'Clear input',
    onClear,
}: Props) => {
    return (
        <IconButton
            icon="x"
            size="small"
            onPress={onClear}
            disabled={disabled}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        />
    )
}

ClearButton.displayName = 'ClearButton'
