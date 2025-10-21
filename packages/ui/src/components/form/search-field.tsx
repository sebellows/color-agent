import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TouchableOpacity, type TextInput as RNTextInput } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { t } from '../../utils/translation'
import { Icon } from '../icon'
import { Stack } from '../layout/stack'
import { Text } from '../text'
import { TextInput, type TextInputProps } from './text-input'

type SearchInputProps = TextInputProps & {
    suggestions?: string[]
}

export const SearchField = forwardRef<RNTextInput, SearchInputProps>(
    (
        {
            suggestions = [],
            placeholder = t`Search`,
            icon = 'search',
            value,
            onChange,
            accessibilityRole,
            accessibilityLabel,
            accessibilityHint,
            ...rest
        }: SearchInputProps,
        ref,
    ) => {
        const inputRef = useRef<RNTextInput>(null)
        useImperativeHandle(ref, () => inputRef.current as RNTextInput)

        const [showSuggestions, setShowSuggestions] = useState(false)

        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value,
        )

        function handleSuggestionClick(option: string) {
            onChange(option)
            setShowSuggestions(false)
        }

        useEffect(() => {
            setShowSuggestions(!!value)
        }, [value])

        return (
            <Stack axis="y" spacing="default">
                <TextInput
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    icon={icon}
                    accessibilityRole={accessibilityRole ?? 'search'}
                    accessibilityLabel={accessibilityLabel ?? t`Search input`}
                    accessibilityHint={
                        accessibilityHint ?? t`Type to search and select from suggestions`
                    }
                    {...rest}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <Stack
                        style={styles.suggestions}
                        axis="y"
                        spacing="sm"
                        accessibilityRole="list"
                    >
                        {filteredSuggestions.map((option, index) => (
                            <TouchableOpacity
                                accessibilityRole="button"
                                onPress={() => handleSuggestionClick(option)}
                                key={index}
                                accessibilityLabel={option}
                                accessibilityHint={t`Double tap to select this suggestion`}
                            >
                                <Stack axis="x" spacing="xs" align="center">
                                    <Icon name="clock" size={16} color="textMuted" />
                                    <Text variant="bodySmall" color="textMuted">
                                        {option}
                                    </Text>
                                </Stack>
                            </TouchableOpacity>
                        ))}
                    </Stack>
                )}
            </Stack>
        )
    },
)

SearchField.displayName = 'SearchField'

const styles = StyleSheet.create(theme => ({
    suggestions: {
        padding: theme.space.sm,
        borderRadius: theme.radii.default,
        backgroundColor: theme.colors.bg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.line3,
        boxShadow: theme.boxShadows.soft3,
    },
}))
