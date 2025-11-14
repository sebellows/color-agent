import { TouchableOpacity, View, type ViewStyle } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type ButtonProps } from '../buttons/button.types'
import { Icon, type IconName } from '../ui/icon'
import { Stack } from '../layout/stack'
import { Text } from '../text'

type Props = Omit<ButtonProps, 'children'> & {
    value?: string
    label: string
    labelIcon?: IconName
    placeholder?: string
    icon?: IconName
    message?: string
    style?: ViewStyle
    isDisabled?: boolean
    isValid?: boolean
    isRequired?: boolean
    isFocused?: boolean
    showRequiredAsterisk?: boolean
    onPress: () => void
}

// A button that emulates the look-n-feel of `TextInput`
export function InputButton({
    value,
    label,
    labelIcon,
    placeholder,
    icon,
    message,
    style,
    isDisabled = false,
    isValid = true,
    isRequired = false,
    isFocused = false,
    showRequiredAsterisk = true,
    onPress,
    accessibilityLabel,
    accessibilityHint = 'Double tap to enter a value',
    ...rest
}: Props) {
    styles.useVariants({
        focused: isFocused,
        valid: isValid,
        disabled: isDisabled,
    })

    return (
        <Stack axis="y" spacing="default">
            <Stack axis="x" spacing="xs" align="center">
                {labelIcon && <Icon name={labelIcon} size={18} color="text" />}
                <Text variant="label" color="fg">
                    {label}
                </Text>
                {isRequired && showRequiredAsterisk && (
                    <Text variant="body" color="error">
                        *
                    </Text>
                )}
            </Stack>
            <View style={[styles.wrapper, style]}>
                <TouchableOpacity
                    style={styles.inputWrapper}
                    {...rest}
                    activeOpacity={isDisabled ? 1 : 0.5}
                    onPress={isDisabled ? undefined : onPress}
                >
                    <Stack
                        axis="x"
                        spacing="default"
                        justify="around"
                        align="center"
                        style={styles.input}
                    >
                        <Text
                            variant="body"
                            numberOfLines={1}
                            style={{ flex: 1 }}
                            accessibilityLabel={accessibilityLabel ?? value}
                            accessibilityHint={accessibilityHint}
                        >
                            {value || placeholder}
                        </Text>

                        {!!icon && (
                            <View style={styles.inputDecoration}>
                                <Icon name={icon} size={24} color="text" />
                            </View>
                        )}
                    </Stack>
                </TouchableOpacity>
            </View>
            {!!message && (
                <Stack axis="x" spacing="sm" align="center">
                    {!isValid && <Icon name="alert-triangle" size={20} color="errorContrast" />}
                    <Text variant="bodySmall" color={isValid ? 'text' : 'errorContrast'}>
                        {message}
                    </Text>
                </Stack>
            )}
        </Stack>
    )
}

const styles = StyleSheet.create(theme => ({
    wrapper: {
        position: 'relative',
        display: 'flex',
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors['bg'],
        overflow: 'hidden',
        variants: {
            focused: {
                true: { opacity: 0.5 },
            },
            valid: {
                true: { borderColor: theme.colors.line1 },
                false: { borderColor: theme.colors['critical']['bgSubtle'] },
            },
            disabled: {
                true: { backgroundColor: theme.colors['bgMuted'], borderWidth: 0 },
            },
        },
    },
    input: {
        minHeight: 60,
        flexGrow: 1,
        paddingHorizontal: theme.space.sm,
    },
    inputDecoration: {
        paddingRight: theme.space.xs,
    },
}))
