import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { Keyboard, type AccessibilityProps, type ViewStyle } from 'react-native'

import { haptics } from '@ui/utils/haptics'
import { DateTime } from 'luxon'
import DatePicker from 'react-native-date-picker'
import { StyleSheet } from 'react-native-unistyles'

import { type IconName } from '../icon'
import { Text } from '../text'
import { InputButton } from './input-button'

type Props = {
    confirmText?: string
    cancelText?: string
    label: string
    icon?: IconName
    locale?: string
    value: Date
    message?: string
    style?: ViewStyle
    isValid?: boolean
    isRequired?: boolean
    showRequiredAsterisk?: boolean
    mode?: 'datetime' | 'date' | 'time'
    onChange: (date: Date) => void
}

/**
 * !NOTE:
 * Because `useImperativeHandle` is used in the component, we need to
 * still use `forwardRef` here, since the former receives the `ref`
 * object specifically from the latter.
 */

export const DateField = forwardRef(
    (
        {
            value,
            label,
            message,
            mode = 'date',
            icon = mode === 'time' ? 'clock' : 'calendar',
            locale = 'en',
            onChange,
            accessibilityLabel: _initialAccessibilityLabel,
            accessibilityHint: _initialAccessibilityHint,
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            ...props
        }: Props & AccessibilityProps,
        ref: any,
    ) => {
        const [isPickerOpen, setPickerOpen] = useState(false)

        useImperativeHandle(ref, () => ({
            focus: () => {
                setPickerOpen(true)
            },
            blur: () => {
                setPickerOpen(false)
            },
        }))

        const accessibilityHint = useMemo(
            () => _initialAccessibilityHint ?? 'Double tap to open date picker',
            [_initialAccessibilityHint],
        )

        const accessibilityLabel = useMemo(
            () =>
                _initialAccessibilityLabel ??
                `Date picker input for ${label}, current value: ${value}`,
            [_initialAccessibilityLabel, label, value],
        )

        const format =
            mode === 'date' ? DateTime.DATE_SHORT
            : mode === 'datetime' ? DateTime.DATETIME_SHORT
            : DateTime.TIME_SIMPLE

        return (
            <>
                <InputButton
                    {...props}
                    value={DateTime.fromJSDate(value).toLocaleString(format)}
                    label={label}
                    icon={icon}
                    isFocused={isPickerOpen}
                    onPress={() => {
                        // Dismissing the keyboard is necessary to force any focused input to blur
                        Keyboard.dismiss()
                        setPickerOpen(true)
                        haptics.selection()
                    }}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityHint={accessibilityHint}
                />
                {!!message && (
                    <Text style={styles.message} variant="bodySmall" color="textMuted">
                        {message}
                    </Text>
                )}

                <DatePicker
                    modal
                    theme="light"
                    title={label}
                    confirmText={confirmText}
                    cancelText={cancelText}
                    locale={locale}
                    mode={mode}
                    date={value}
                    open={isPickerOpen}
                    onCancel={() => setPickerOpen(false)}
                    onConfirm={date => {
                        setPickerOpen(false)
                        onChange(date)
                    }}
                />
            </>
        )
    },
)

DateField.displayName = 'DateField'

const styles = StyleSheet.create(theme => ({
    message: {
        marginTop: theme.space.xs,
        marginLeft: theme.space.sm,
    },
}))
