import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    TextInput as RNTextInput,
    TextInputFocusEvent,
    View,
} from 'react-native'

import { Icon, IconButton } from '@ui/components/primitives'
import { Label } from '@ui/components/primitives/label'
import { FieldValues, RegisterOptions, UseControllerProps } from 'react-hook-form'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { useHaptics } from '../../hooks'
import { Stack } from '../layout/stack'
import { Slot } from '@ui/components/primitives/slot'
import { Text } from '../text'
import {
    CharacterLimitProps,
    ClearButtonProps,
    FormControlProps,
    FormLabelProps,
    TextInputProps,
    TextMaskToggleProps,
} from './form-control.types'
import { FormHint } from './form-hint'

/**************************************************
 * CharacterLimit
 **************************************************/

const CharacterLimit = ({
    accessibilityHint: initialAccessibilityHint,
    accessibilityLabel = 'Character count',
    characterCount,
    maxLength = 200,
}: CharacterLimitProps) => {
    const accessibilityHint =
        initialAccessibilityHint ??
        `Number of characters entered in the input field: currently ${characterCount} out of ${maxLength}`

    return (
        <Stack
            axis="x"
            spacing="none"
            style={styles.characterCount}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        >
            <Text variant="detailBold">{characterCount}</Text>
            <Text variant="detail"> / {maxLength.toString()}</Text>
        </Stack>
    )
}

CharacterLimit.displayName = 'CharacterLimit.Native'

/**************************************************
 * TextMaskToggle
 **************************************************/

const TextMaskToggle = ({
    ref,
    asChild,
    children,
    accessibilityHint: initialAccessibilityHint,
    accessibilityLabel = 'Toggle visibility',
    unmasked,
    onPress,
}: TextMaskToggleProps) => {
    // const [showText, setShowText] = React.useState(initialShowText)
    const accessibilityHint =
        initialAccessibilityHint ?? unmasked ?
            'Hide text by toggling visibility'
        :   'Show text by toggling visibility'

    const Component = asChild ? Slot.Pressable : Pressable

    return (
        <Component
            ref={ref}
            onPress={onPress}
            accessible
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            style={styles.maskToggle}
        >
            {React.Children.only(children) ?
                children
            :   <Icon name={unmasked ? 'eye' : 'eye-off'} size={20} color="text" />}
        </Component>
    )
}

TextMaskToggle.displayName = 'TextMaskToggle.Native'

/**************************************************
 * ClearButton
 **************************************************/

const ClearButton = ({
    ref,
    disabled,
    accessibilityHint = 'Double tap to clear the input',
    accessibilityLabel = 'Clear input',
    onPress,
}: ClearButtonProps) => {
    function handleOnPress(event: any) {
        onPress?.(event)
    }

    return (
        <IconButton
            ref={ref}
            icon="x"
            size="small"
            onPress={handleOnPress}
            disabled={disabled}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        />
    )
}

ClearButton.displayName = 'ClearButton'

/**************************************************
 * TextInput
 **************************************************/

const TextInput = ({
    ref,
    name,
    disabled,
    style,
    autoFocus = false,
    bordered,
    editable,
    isFocused = !!autoFocus,
    isValid,
    accessibilityRole = 'text',
    ...props
}: TextInputProps) => {
    const { theme } = useUnistyles()

    styles.useVariants({
        bordered,
        disabled,
        focused: isFocused,
        valid: isValid,
    })

    const isEditable = `${editable}` === 'true' && !disabled

    return (
        <RNTextInput
            ref={ref}
            {...props}
            underlineColorAndroid="transparent"
            editable={isEditable}
            style={[styles.input, style]}
            placeholderTextColor={theme.colors.fgMuted}
            accessibilityRole={accessibilityRole ?? 'text'}
            accessibilityState={{ disabled }}
        />
    )
}

/**************************************************
 * Controlled Input (React Hook Form Controller)
 **************************************************/

type TRule<T extends FieldValues> =
    | Omit<RegisterOptions<T>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
    | undefined

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> }
export type ControlledInputProps<T extends FieldValues> = TextInputProps & UseControllerProps<T>

// type ControlledInputProps<T extends FieldValues> = React.ComponentPropsWithRef<typeof RNTextInput> & ControllerProps<T>

// const ControlledInput = <T extends FieldValues>(
//   props: ControlledInputProps<T>
// ) => {
//   const { name, control, rules, ...inputProps } = props;

//   const { field, fieldState } = useController({ control, name, rules })

//     return (
//         <TextInput
//             ref={field.ref}
//             autoCapitalize="none"
//             onChangeText={field.onChange}
//             value={(field.value as string) || ''}
//             {...inputProps}
//         />
//     )
// }

const FormLabel = ({ prefix, suffix, Root, ...props }: FormLabelProps) => {
    const stackProps = { axis: 'x', spacing: 'xs', align: 'center', ...Root }
    return (
        <Label.Root {...stackProps}>
            {prefix}
            <Label.Text {...props.Text} />
            {suffix}
        </Label.Root>
    )
}

/**************************************************
 * TextField
 **************************************************/

export const FormControl = ({
    ref,
    name,
    value,
    isValid,
    loading,
    error,
    disabled,
    maxLength,
    returnKeyType = 'done',
    prefix,
    suffix,
    showRequiredAsterisk,
    label,
    labelColor,
    labelIcon,
    labelStyle,
    stackLabel,
    hint,
    hideHint,
    clearable,
    clearA11YHint,
    clearA11YLabel,
    onClear,
    counter,
    counterA11YHint,
    counterA11YLabel,
    icon,
    iconColor,
    iconSize,
    isFocused: initialIsFocused,
    mask,
    maskedVisibleRange,
    reverseFillMask,
    unmasked: initialUnmasked,
    maskA11YHint,
    maskA11YLabel,
    noErrorIcon,
    onChange,
    onBlur,
    onFocus,
    accessibilityRole = 'text',
    ...props
}: FormControlProps) => {
    const { theme } = useUnistyles()
    const inputRef = React.useRef<RNTextInput | null>(null)

    const [unmasked, toggleMasked] = React.useState(initialUnmasked)
    const [isFocused, setIsFocused] = React.useState(initialIsFocused ?? props?.autoFocus)

    const [characterCount, setCharacterCount] = React.useState(value?.length || 0)

    // const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

    styles.useVariants({
        valid: isValid,
        disabled: `${disabled}` === 'true',
    })

    const showRequiredAppearance = Boolean(!!props?.required && showRequiredAsterisk)

    const accessibilityHint =
        hideHint ? undefined : (
            hint ??
            (showRequiredAppearance ?
                'This field is marked as required'
            :   `Double tap to edit ${label}`)
        )

    const accessibilityLabel =
        props?.accessibilityLabel ??
        (showRequiredAppearance ? 'Required field indicator' : `Label for ${label} input`)

    const { triggerHaptics } = useHaptics()

    const handleOnBlur = (event: TextInputFocusEvent) => {
        setIsFocused(false)
        onBlur?.(event)
    }

    function handleOnFocus(event: TextInputFocusEvent) {
        setIsFocused(true)
        triggerHaptics('selection')
        onFocus?.(event)
    }

    function handleOnClear(event: GestureResponderEvent) {
        onClear?.(event)
        inputRef?.current?.blur()
        setCharacterCount(0)
    }

    function handleMaskToggle() {
        toggleMasked(!unmasked)
    }

    return (
        <Stack ref={ref} axis="y" spacing="sm">
            {label && (
                <Stack axis="x" spacing="xs" align="center">
                    <FormLabel
                        showRequiredAsterisk={showRequiredAppearance}
                        accessibilityHint={accessibilityHint}
                        accessibilityLabel={accessibilityLabel}
                    >
                        {label}
                    </FormLabel>
                </Stack>
            )}

            {counter && isFocused && (
                <CharacterLimit characterCount={characterCount} maxLength={maxLength} />
            )}

            <Stack style={styles.formControlWrapper} axis="x" spacing="xs" align="center">
                {!!icon && <Icon name={icon} size={24} color="text" />}

                <TextInput
                    ref={inputRef}
                    {...props}
                    name={name}
                    value={value}
                    underlineColorAndroid="transparent"
                    secureTextEntry={unmasked}
                    returnKeyType={returnKeyType}
                    editable={!disabled}
                    selectTextOnFocus={!disabled}
                    bordered={false}
                    placeholderTextColor={theme.colors.fgMuted}
                    accessibilityRole={accessibilityRole}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityHint={accessibilityHint}
                    accessibilityState={{ disabled }}
                    isFocused={isFocused}
                    onBlur={handleOnBlur}
                    onChangeText={onChange}
                    onFocus={handleOnFocus}
                />

                {mask ?
                    <TextMaskToggle onPress={handleMaskToggle} />
                :   <ClearButton disabled={!value} onPress={handleOnClear} />}
            </Stack>

            {!!hint?.length && <FormHint name={label}>{hint}</FormHint>}
            {!!error?.length && <FormHint hasError={!!error}>{error}</FormHint>}
        </Stack>
    )
}

const styles = StyleSheet.create(theme => ({
    maskToggle: {
        flexDirection: 'row',
        paddingRight: theme.space.xs,
    },
    characterCount: {
        position: 'absolute',
        top: theme.space.default,
        right: theme.space.xs,
    },

    formControlWrapper: {
        padding: theme.space.default,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.bg,
        borderWidth: 1,
        variants: {
            valid: {
                true: { borderColor: theme.colors.line1 },
                false: {
                    backgroundColor: theme.colors.critical.bgSubtle,
                    borderColor: theme.colors.critical.bg,
                },
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
        variants: {
            bordered: {
                true: {
                    borderWidth: 1,
                },
                false: {
                    borderWidth: 0,
                },
            },
            focused: {
                true: {
                    borderColor: theme.colors.primary.line4,
                },
                false: {
                    borderColor: theme.colors.line2,
                },
            },
            valid: {
                true: { borderColor: theme.colors.line1 },
                false: {
                    backgroundColor: theme.colors.critical.bgSubtle,
                    borderColor: theme.colors.critical.bg,
                },
            },
            disabled: {
                true: { backgroundColor: theme.colors.bgMuted },
            },
        },
    },
}))
