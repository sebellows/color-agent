import React from 'react'
import { GestureResponderEvent, Pressable, TextInput, TextInputFocusEvent, View } from 'react-native'

import { isNil, isPlainObject, isUndefined } from 'es-toolkit'
import { get } from 'es-toolkit/compat'
import { Controller, FieldValues, useForm, UseFormReturn } from 'react-hook-form'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { composeEventHandlers } from '../../lib/compose-events'
import { Slot } from '@ui/components/primitives/slot'
import { FormHint } from './form-hint'
import { CharacterLimitProps, ClearButtonProps, FormRootProps, FormTriggerProps, TextFieldProps, TextMaskToggleProps } from './form.types'
import { Stack } from '../layout/stack'
import { Text } from '../text'
import { FormLabel, Icon, IconButton } from '@ui/components/primitives'
import { RNTextInput } from '../../types/react-native.types'
import { useHaptics } from '../../hooks'

/**************************************************
 * Root Form Context
 **************************************************/

const FORM_NAME = 'FormRoot.Native'

type FormContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
> = UseFormReturn<TFieldValues, TContext, TTransformedValues> & {
    activeFormControl: string | undefined
    setActiveFormControl: React.Dispatch<React.SetStateAction<string | undefined>>
    nativeID: string
}

const FormContext = React.createContext<FormContextValue | null>(null)

function categorizeUseFormProps<Props extends FormRootProps>(props: Props) {
    const {
        context,
        criteriaMode,
        defaultValues,
        delayError,
        disabled,
        errors,
        formControl,
        mode,
        progressive,
        resetOptions,
        resolver,
        reValidateMode,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        values,
        ...viewProps
    } = props

    return {
        useFormProps: {
            context,
            criteriaMode,
            defaultValues,
            delayError,
            disabled,
            errors,
            formControl,
            mode,
            progressive,
            resetOptions,
            resolver,
            reValidateMode,
            shouldFocusError,
            shouldUnregister,
            shouldUseNativeValidation,
            values,
        },
        viewProps,
    }
}

const Root = <
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
>({
    ref,
    asChild,
    ...props
}: FormRootProps<TFieldValues, TContext, TTransformedValues>) => {
    const nativeID = React.useId()
    const [activeFormControl, setActiveFormControl] = React.useState<string | undefined>()
    const { useFormProps, viewProps } = categorizeUseFormProps(props as FormRootProps)
    const hookFormProps = useForm(useFormProps)

    const Component = asChild ? Slot.View : View

    return (
        <FormContext.Provider value={{ ...hookFormProps, activeFormControl, setActiveFormControl, nativeID }}>
            <Component
                ref={ref}
                nativeID={nativeID}
                aria-disabled={props?.disabled}
                {...viewProps}
            />
        </FormContext.Provider>
    )
}

Root.displayName = FORM_NAME

function useFormContext() {
    const context = React.useContext(FormContext)
    if (!context) {
        throw new Error('Form compound components cannot be rendered outside the Form component')
    }
    return context
}

/**************************************************
 * Form Trigger
 **************************************************/

const TRIGGER_NAME = 'FormTrigger.Native'

const defaultOnSubmit = <TFieldValues extends FieldValues = FieldValues>(_data: TFieldValues) => {}

const Trigger = ({
    ref,
    asChild,
    disabled: _disabled,
    onPress,
    onSubmit = defaultOnSubmit,
    onError,
    ...props
}: FormTriggerProps) => {
    const context = useFormContext()

    // Need to coerce `null` to `undefined` in order to reconcile the differing definitions of
    // `disabled` between RN's PressableProps and the one in react-hook-form's `UseFormReturn` object
    const disabled = _disabled === null ? undefined : _disabled

    const Component = asChild ? Slot.Pressable : Pressable

    const handleOnSubmit = (event: GestureResponderEvent) => {
        if (disabled) return
        onPress?.(event)
        context.handleSubmit(onSubmit, onError)
    }

    return (
        <Component
            ref={ref}
            onPress={composeEventHandlers(onPress, handleOnSubmit)}
            aria-disabled={disabled}
            {...props}
        />
    )
}

Trigger.displayName = TRIGGER_NAME

/**************************************************
 * TextField
 **************************************************/

export const CharacterLimit = ({
    accessibilityHint: initialAccessibilityHint,
    accessibilityLabel = 'Character count',
    characterCount = 0,
    maxLength = 200,
    spacing = 'none',
}: CharacterLimitProps) => {
    const accessibilityHint = initialAccessibilityHint ??
            `Number of characters entered in the input field: currently ${characterCount} out of ${maxLength}`

    return (
        <Stack
            axis="x"
            spacing={spacing}
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
 * Text Mask Toggle
 **************************************************/

export const TextMaskToggle = ({
    ref,
    asChild,
    children,
    showText: initialShowText = false,
    accessibilityHint: initialAccessibilityHint,
    accessibilityLabel = 'Toggle visibility',
    onShow,
}: TextMaskToggleProps) => {
    const [showText, setShowText] = React.useState(initialShowText)
    const accessibilityHint = initialAccessibilityHint ?? showText ?
                'Hide text by toggling visibility'
            :   'Show text by toggling visibility'

    const onPress = (_event: GestureResponderEvent) => {
        const show = !showText
        setShowText(show)
        onShow?.(show)
    }

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
            {React.Children.only(children) ? children : (
                <Icon name={ showText ? 'eye' : 'eye-off' } size={20} color="text" />
            )}
        </Component>
    )
}

TextMaskToggle.displayName = 'TextMaskToggle.Native'

/**************************************************
 * Clear Input Button
 **************************************************/

export const ClearButton = ({
    ref,
    context,
    disabled,
    accessibilityHint = 'Double tap to clear the input',
    accessibilityLabel = 'Clear input',
    onPress,
}: ClearButtonProps) => {
    const { resetField } = useFormContext()

    function handleOnPress(event: GestureResponderEvent) {
        resetField(context?.name)
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
 * TextField
 **************************************************/

const TextField = ({
    ref,
    defaultErrorMessage,
    hint,
    icon,
    label,
    labelIcon,
    labelStyle,
    name,
    rules,
    style,
    value: initialValue,
    showRequiredAsterisk = true,
    secureTextEntry,
    allowSecureTextToggle = !!secureTextEntry,
    showCharacterLimit = false,
    // message,
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
    onClear,
    onFocus,
    ...props
}: TextFieldProps) => {
    const {
        control,
        getValues,
        setFocus,
        setValue,
        setActiveFormControl,
        formState: { disabled, errors, isLoading, isValid, isValidating },
    } = useFormContext()

    const { theme } = useUnistyles()
    const inputRef = React.useRef<RNTextInput | null>(null)
    const [secureTextVisible, setSecureTextVisible] = React.useState(false)
    // const [isFocused, setFocused] = React.useState(false)
    const [characterCount, setCharacterCount] = React.useState(initialValue?.length || 0)

    const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

    styles.useVariants({
        valid: isValid,
        disabled: `${disabled}` === 'true',
    })

    const computedErrorMessage = get(errors, `${name}.message`)

    React.useEffect(() => {
        if (!computedErrorMessage) return undefined

        if (isPlainObject(computedErrorMessage)) {
            /** TODO: Not sure if TS fuckery is going on or react-hook-form will really nest
             * an error object like this:
             * @example
             * let msg = errors[name].message
             * => { type: 'required', root: FormRoot, ref: this, types: { required: true }, message: { message: {}, [...] }}
             */
            let currMsg = computedErrorMessage.message
            let msg = defaultErrorMessage ?? ''
            while (isPlainObject(currMsg) && !msg.length) {
                if (isPlainObject(currMsg.message)) {
                    currMsg = currMsg.message
                    break
                }
                if (currMsg.message === undefined) {
                    currMsg = undefined
                    break
                }

                msg = currMsg.message
                currMsg = msg
            }

            setErrorMessage(msg)
        } else if (typeof computedErrorMessage === 'string') {
            setErrorMessage(computedErrorMessage)
        }
    }, [computedErrorMessage, setErrorMessage])

    const showRequiredAppearance = Boolean(!!rules?.required && showRequiredAsterisk)

    const accessibilityHint = initialAccessibilityHint ??
                (showRequiredAppearance ?
                    'This field is marked as required'
                :   `Double tap to edit ${label}`)

    const accessibilityLabel = initialAccessibilityLabel ??
                (showRequiredAppearance ? 'Required field indicator' : `Label for ${label} input`)

    const { triggerHaptics } = useHaptics()

    const currentValue = getValues(name)

    function handleOnFocus(event: TextInputFocusEvent) {
        setActiveFormControl(name)
        setFocus(name)
        triggerHaptics('selection')
        onFocus?.(event)
    }

    function handleOnClear(event: GestureResponderEvent) {
        setValue(name, '')
        onClear?.(event)
        inputRef?.current?.State?.blurTextInput?.()
        setCharacterCount(0)
    }

    return (
        <Stack axis="y" spacing="sm">
            {label && (
                <FormLabel
                    showRequiredAsterisk={showRequiredAppearance}
                    accessibilityHint={accessibilityHint}
                    accessibilityLabel={accessibilityLabel}
                >
                    {label}
                </FormLabel>
            )}

            {showCharacterLimit && (
                <CharacterLimit
                    {{ characterCount, ...(rules?.maxLength ? { maxLength: rules.maxLength } : {})}}
                />
            )}

            <Stack ref={ref} style={styles.formControlWrapper} axis="x" spacing="xs" align="center">
                {!!icon && <Icon name={icon} size={24} color="text" />}

                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            ref={inputRef}
                            {...props}
                            value={value}
                            underlineColorAndroid="transparent"
                            secureTextEntry={
                                allowSecureTextToggle ? !secureTextVisible : secureTextEntry
                            }
                            returnKeyType={returnKeyType}
                            editable={!disabled}
                            selectTextOnFocus={!disabled}
                            multiline={multiline}
                            style={[styles.input, style]}
                            placeholderTextColor={theme.colors.fgMuted}
                            accessibilityRole={accessibilityRole ?? 'text'}
                            accessibilityLabel={accessibilityLabel}
                            accessibilityHint={accessibilityHint}
                            accessibilityState={{ disabled }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            onFocus={handleOnFocus}
                        />
                    )}
                />
                {allowSecureTextToggle ?
                        <TextMaskToggle />
                    :   <ClearButton disabled={!currentValue} onPress={handleOnClear} />
                }
            </Stack>

            {!!hint?.length && <FormHint name={label}>{hint}</FormHint>}
            {!!errorMessage?.length && (
                <FormHint hasError={!!computedErrorMessage}>{errorMessage}</FormHint>
            )}
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
                false: { backgroundColor: theme.colors.critical.bgSubtle, borderColor: theme.colors.critical.bg },
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
    // controller: (hasError?: boolean) => {
    //     if (`${hasError}` === 'true') {
    //         return {
    //             backgroundColor: 'critical.bgSubtle',
    //             borderColor: 'critical.line4',
    //             color: 'critical.fg',
    //         }
    //     }
    //     return {
    //         backgroundColor: 'bg',
    //         borderColor: 'line1',
    //         color: 'fg',
    //     }
    // },
}))
