import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
    AccessibilityProps,
    TextInput as RNTextInput,
    TouchableOpacity,
    View,
    type TextInputProps as RNTextInputProps,
    type TextInputFocusEvent,
} from 'react-native'

import { haptics } from '@ui/utils/haptics'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { Icon, type IconName } from '../icon'
import { Stack } from '../layout/stack'
import { CharacterLimit } from './character-limit'
import { ClearButton } from './clear-button'
import { FormHint } from './form-hint'
import { FormLabel } from './form-label'
import { TextMaskToggle } from './text-mask-toggle'

export type TextInputProps = Omit<RNTextInputProps, 'onChange'> & {
    value: string
    onChange: (val: string) => void
    icon?: IconName
    isRequired?: boolean
    isValid?: boolean
    isDisabled?: boolean
    showRequiredAsterisk?: boolean
    allowSecureTextToggle?: boolean
    label?: string
    labelIcon?: IconName
    message?: string
    showCharacterLimit?: boolean
    securityToggleA11y?: Pick<AccessibilityProps, 'accessibilityHint' | 'accessibilityLabel'>
    clearButtonAccessibilityLabel?: string
    clearButtonAccessibilityHint?: string
    characterCountHint?: string
    characterCountLabel?: string
    validationHint?: string
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
    (
        {
            value,
            placeholder = 'Type here',
            onChange,
            icon,
            isRequired = false,
            isValid = true,
            isDisabled = false,
            showRequiredAsterisk = true,
            secureTextEntry,
            allowSecureTextToggle = !!secureTextEntry,
            showCharacterLimit = false,
            maxLength = 200,
            label,
            labelIcon,
            message,
            style,
            onBlur,
            onFocus,
            multiline = false,
            returnKeyType = 'done',
            accessibilityRole,
            accessibilityHint: initialAccessibilityHint,
            accessibilityLabel: initialAccessibilityLabel,
            securityToggleA11y,
            characterCountHint: initialCharacterCountHint,
            characterCountLabel = 'Character count',
            clearButtonAccessibilityLabel = 'Clear input',
            clearButtonAccessibilityHint = 'Double tap to clear the input',
            validationHint: initialValidationHint,
            ...props
        }: TextInputProps,
        ref,
    ) => {
        const { theme } = useUnistyles()
        const [secureTextVisible, setSecureTextVisible] = useState(false)
        const [isFocused, setFocused] = useState(false)
        const [characterCount, setCharacterCount] = useState(value?.length || 0)

        const inputRef = useRef<RNTextInput>(null)
        useImperativeHandle(ref, () => inputRef.current as RNTextInput)

        styles.useVariants({
            valid: isValid,
            disabled: isDisabled,
        })

        const useRequiredAppearance = useMemo(
            () => Boolean(isRequired && showRequiredAsterisk),
            [isRequired, showRequiredAsterisk],
        )

        const accessibilityLabel = useMemo(
            () =>
                initialAccessibilityLabel ??
                (useRequiredAppearance ? 'Required field indicator' : `Label for ${label} input`),
            [initialAccessibilityLabel, label, useRequiredAppearance],
        )

        const accessibilityHint = useMemo(
            () =>
                initialAccessibilityHint ??
                (useRequiredAppearance ?
                    'This field is marked as required'
                :   `Double tap to edit ${label}`),
            [initialAccessibilityHint, label, useRequiredAppearance],
        )

        const securityToggleLabel = useMemo(
            () => securityToggleA11y?.accessibilityLabel ?? 'Toggle visibility',
            [securityToggleA11y],
        )

        const securityToggleHint = useMemo(
            () =>
                securityToggleA11y?.accessibilityHint ?? secureTextVisible ?
                    'Hide text by toggling visibility'
                :   'Show text by toggling visibility',
            [secureTextVisible, securityToggleA11y],
        )

        const validationHint = useMemo(
            () =>
                isValid ?
                    `Informational message for the ${label ?? ''} input field`
                :   `This is an error message for the ${label ?? ''} input field`,
            [label, isValid],
        )

        function handleCancel() {
            onChange('')
            inputRef.current?.blur()
        }

        function handleFocus(e: TextInputFocusEvent) {
            setFocused(true)
            haptics.selection()
            if (onFocus) onFocus(e)
        }

        function handleBlur(e: TextInputFocusEvent) {
            setFocused(false)
            if (onBlur) onBlur(e)
        }

        function handleChangeText(val: string) {
            if (showCharacterLimit && maxLength && val.length > maxLength) {
                val = val.substring(0, maxLength)
            }
            setCharacterCount(val.length)
            onChange(val)
        }

        return (
            <Stack axis="y" spacing="default">
                {label && (
                    <FormLabel
                        showRequiredAsterisk={useRequiredAppearance}
                        accessibilityHint={accessibilityHint}
                        accessibilityLabel={accessibilityLabel}
                    >
                        {label}
                    </FormLabel>
                )}

                {showCharacterLimit && isFocused && (
                    <CharacterLimit characterCount={characterCount} maxLength={maxLength} />
                )}

                <Stack style={styles.inputWrapper} axis="x" spacing="xs" align="center">
                    {!!icon && <Icon name={icon} size={24} color="text" />}

                    <RNTextInput
                        {...props}
                        ref={inputRef}
                        value={value}
                        placeholder={placeholder}
                        onChangeText={isDisabled ? undefined : handleChangeText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        autoCapitalize="none"
                        underlineColorAndroid="transparent"
                        secureTextEntry={
                            allowSecureTextToggle ? !secureTextVisible : secureTextEntry
                        }
                        returnKeyType={returnKeyType}
                        editable={!isDisabled}
                        selectTextOnFocus={!isDisabled}
                        multiline={multiline}
                        maxLength={maxLength}
                        style={[styles.input, style]}
                        placeholderTextColor={theme.colors.fgMuted}
                        accessibilityRole={accessibilityRole ?? 'text'}
                        accessibilityLabel={accessibilityLabel}
                        accessibilityHint={accessibilityHint}
                        accessibilityState={{ disabled: isDisabled }}
                    />

                    {allowSecureTextToggle ?
                        <TextMaskToggle />
                    :   <ClearButton disabled={!value} onClear={handleCancel} />}
                </Stack>

                {!!message && (
                    <FormHint hasError={!isValid} name={label}>
                        {message}
                    </FormHint>
                )}
            </Stack>
        )
    },
)

TextInput.displayName = 'TextInput'

const styles = StyleSheet.create(theme => ({
    inputWrapper: {
        padding: theme.space.default,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.bg,
        borderWidth: 1,
        variants: {
            valid: {
                true: { borderColor: theme.colors.line1 },
                false: { borderColor: theme.colors.critical.bg },
            },
            disabled: {
                true: { backgroundColor: theme.colors.bgMuted, borderWidth: 0 },
            },
        },
    },
    input: {
        ...theme.typography.body,
        color: theme.colors.fg,
        lineHeight: 20,
        width: '70%', // This is to prevent the input from expanding with the text and pushing the icon out of view
        flexGrow: 1,
    },
    inputDecoration: {
        flexDirection: 'row',
        paddingRight: theme.space.xs,
    },
    characterCount: {
        position: 'absolute',
        top: theme.space.default,
        right: theme.space.xs,
    },
}))
