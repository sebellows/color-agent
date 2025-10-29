import { AccessibilityProps, GestureResponderEvent, TextStyle } from 'react-native'

import {
    ControllerProps,
    FieldPath,
    FieldValues,
    SubmitErrorHandler,
    SubmitHandler,
    UseFormProps,
    ValidationRule,
} from 'react-hook-form'

import { Space } from '../../theme/theme.types'
import {
    RNTextInput,
    SlottablePressableProps,
    SlottableTextProps,
    SlottableViewProps,
} from '../../types/react-native.types'
import { IconName } from '../icon'
import { StackProps } from '../layout/stack'

export type FormHandlers<TFieldValues extends FieldValues = FieldValues> = {
    onSubmit?: SubmitHandler<TFieldValues>
    onError?: SubmitErrorHandler<TFieldValues>
}

export type FormRootBaseProps<TFieldValues extends FieldValues = FieldValues> = SlottableViewProps &
    FormHandlers<TFieldValues>

export type FormRootProps<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
> = FormRootBaseProps & UseFormProps<TFieldValues, TContext, TTransformedValues>

export type FormTriggerProps<TFieldValues extends FieldValues = FieldValues> =
    SlottablePressableProps & FormHandlers<TFieldValues>

export type FormLegendProps = SlottableTextProps & {
    legend: string
}

/**
 * Combine's props for React Native's `TextInput` component along with
 * props for react-hook-form's `Controller` Higher-Order Component.
 *
 * NOTE: Generic types come from react-hook-form's `ControllerProps`.
 */
export type TextFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TTransformedValues = TFieldValues,
> = React.ComponentPropsWithRef<RNTextInput> &
    ControllerProps<TFieldValues, TName, TTransformedValues> & {
        hint?: string
        label?: string
        labelIcon?: IconName
        labelStyle?: TextStyle
        defaultErrorMessage?: string
        icon?: IconName
        isRequired?: boolean
        isValid?: boolean
        isDisabled?: boolean
        showRequiredAsterisk?: boolean
        allowSecureTextToggle?: boolean
        // message?: string
        showCharacterLimit?: boolean
        securityToggleA11y?: Pick<AccessibilityProps, 'accessibilityHint' | 'accessibilityLabel'>
        clearButtonAccessibilityLabel?: string
        clearButtonAccessibilityHint?: string
        characterCountHint?: string
        characterCountLabel?: string
        validationHint?: string
        onClear?: (event: GestureResponderEvent) => void
    }

export type CharacterLimitProps = SlottableTextProps & {
    accessibilityLabel?: string
    accessibilityHint?: string
    // Stack-/text-alignment
    align?: StackProps['align']
    characterCount?: number
    maxLength?: ValidationRule<number>
    spacing?: Space | undefined
    // Layout the label atop the input field
    stackLabel?: boolean
}

export type TextMaskToggleProps = SlottablePressableProps & {
    accessibilityLabel?: string
    accessibilityHint?: string
    showText?: boolean
    onShow?: (value: boolean) => boolean
}

export type ClearButtonProps<TContext = any> = SlottablePressableProps & {
    context?: TContext
    disabled?: boolean
}
