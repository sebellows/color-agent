import { useMemo } from 'react'

import { StyleSheet } from 'react-native-unistyles'

import type { Space } from '../../theme/theme.types'
import { Stack, StackProps } from '../layout/stack'
import { Text, type TextProps } from '../text'

type Props = TextProps & {
    accessibilityLabel?: string
    accessibilityHint?: string
    // Stack-/text-alignment
    align?: StackProps['align']
    characterCount?: number
    maxLength: number
    spacing?: Space | undefined
    // Layout the label atop the input field
    stackLabel?: boolean
}

export const CharacterLimit = ({
    accessibilityHint: initialAccessibilityHint,
    accessibilityLabel = 'Character count',
    characterCount = 0,
    maxLength = 200,
    spacing = 'none',
}: Props) => {
    const accessibilityHint = useMemo(
        () =>
            initialAccessibilityHint ??
            `Number of characters entered in the input field: currently ${characterCount} out of ${maxLength}`,
        [characterCount, maxLength],
    )

    return (
        <Stack
            axis="x"
            spacing={spacing}
            style={styles.characterCount}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        >
            <Text variant="detailBold">{characterCount}</Text>
            <Text variant="detail"> / {maxLength}</Text>
        </Stack>
    )
}

CharacterLimit.displayName = 'CharacterLimit'

const styles = StyleSheet.create(theme => ({
    characterCount: {
        position: 'absolute',
        top: theme.space.default,
        right: theme.space.xs,
    },
}))
