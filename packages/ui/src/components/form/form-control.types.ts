import React from 'react'
import { ReturnKeyTypeOptions, TextStyle } from 'react-native'

import { Label, LabelProps } from '@ui/components/primitives/label'
import { Noop } from 'react-hook-form'

import { SizeTokens } from '../../../exports.native'
import {
    RNTextInput,
    SlottablePressableProps,
    SlottableTextProps,
    SlottableViewProps,
} from '../../primitives/types'
import { Color, Space } from '../../theme/theme.types'
import { IconName } from '../icon'
import { StackProps } from '../layout/stack'

type ValidationRule<T> = T | { value: T; message: string }

export type FormControlProps = SlottableViewProps & {
    name: string

    value?: string

    autoFocus?: boolean
    isFocused?: boolean

    isValid?: boolean

    required?: boolean

    returnKeyType?: ReturnKeyTypeOptions

    /**
     * Signals the user a process is in progress by displaying a spinner.
     *
     * Can be set either by the `formState` object's `isLoading` field returned by RHF's `useForm` hook,
     * or set custom if the value(s) of the form control depend on an API call that is in progress.
     *
     * @see formState {@link https://react-hook-form.com/docs/useform/formstate}
     */
    loading?: boolean

    /**
     * Passed to the form control if its field name appears in the `errors` object of the `formState`.
     *
     * @see formState {@link https://react-hook-form.com/docs/useform/formstate}
     */
    error?: string

    /** Sets the field as disabled. */
    disabled?: boolean

    maxLength?: number

    /**************************************************
     *
     * UI & Sub-Component Props
     *
     **************************************************/

    /** Text to display before input text. Example: '$' */
    prefix?: string
    /** Text to display after input text. Example: 'ml' */
    suffix?: string

    /** Signal that the field is required by placing a red asterisk at the end of the label text. */
    showRequiredAsterisk?: boolean

    /******************************
     * Label Component Props
     ******************************/

    label?: string
    labelColor?: Color | string
    /**
     * Prepends an Icon element on the left of the label, if writingDirection is 'ltr',
     * otherwise it is placed on the right for 'rtl'.
     */
    labelIcon?: IconName
    labelStyle?: TextStyle
    /**
     * Label will be laid out above the text input, otherwise laid out horizontally
     * next to input, dependent on reading direction.
     */
    stackLabel?: boolean

    /** Render props for item placed at start of label */
    labelPrefix?: React.ReactNode
    /** Render props for item placed at end of label */
    labelSuffix?: React.ReactNode

    /******************************
     * Hint Text Component Props
     ******************************/

    /** Helper (hint) text which gets placed below your wrapped form component */
    hint?: string
    /** Hide the helper (hint) text when field doesn't have focus */
    hideHint?: boolean

    /******************************
     * ClearButton Component Props
     ******************************/

    /** Appends clearable icon when a value (not undefined or null) is set. */
    clearable?: boolean
    /** Set custom `accessibilityHint` on ClearButton component. */
    clearA11YHint?: string
    /** Set custom `accessibilityLabel` on ClearButton component. */
    clearA11YLabel?: string
    /** Event handler to run when ClearButton has been pressed. */
    onClear?: (...args: any[]) => void

    /******************************
     * CharacterCount component Props
     ******************************/

    /**
     * Show an automatic counter on bottom right.
     * NOTE: If `maxLength` is set, counter will show formated output
     * as `${characterCount} / ${maxLength}`, otherwise just the
     * character count.
     */
    counter?: boolean
    /** Set custom `accessibilityHint` on CharacterCount component. */
    counterA11YHint?: string
    /** Set custom `accessibilityLabel` on CharacterCount component. */
    counterA11YLabel?: string

    /******************************
     * Icon Component Props
     ******************************/

    icon?: IconName
    iconColor?: Color | string
    iconSize?: SizeTokens | number

    /******************************
     * MaskedText Component Props
     ******************************/

    /**
     * If true and value is of type 'string', value's characters will be replaced with default character ('*').
     * If set with string, value's characters will be replaced with set string.
     * If value is not of type 'string', an underscore will be used to fill mask's length
     */
    mask?: string // default is '*'
    /**
     * Number of characters from end to not mask. Default is 1.
     * If `reverseFillMask` is true, then characters from the left would be revealed instead.
     */
    maskedVisibleRange?: number
    /** Fills string from the right side of the mask */
    reverseFillMask?: boolean
    /** Model will be unmasked */
    unmasked?: boolean
    /** Set custom `accessibilityHint` on MaskText component. */
    maskA11YHint?: string
    /** Set custom `accessibilityLabel` on MaskText component. */
    maskA11YLabel?: string

    /******************************
     * Error Hint Component Props
     ******************************/

    /** Hide error icon when there is an error */
    noErrorIcon?: boolean

    /******************************
     * EVENT HANDLERS
     ******************************/

    /** Emitted when input value updates. */
    onChange?: (...event: any) => void
    /** Emitted when component loses focus. */
    onBlur?: (event: any) => void | Noop
    /** Emitted when component gets focused. */
    onFocus?: (event: any) => void | Noop
}

export type TextInputProps = React.ComponentPropsWithRef<RNTextInput> & {
    name: string
    bordered?: boolean
    disabled?: boolean
    isFocused?: boolean
    isValid?: boolean
}

// /**
//  * Combine's props for React Native's `TextInput` component along with
//  * props for react-hook-form's `Controller` Higher-Order Component.
//  *
//  * NOTE: Generic types come from react-hook-form's `ControllerProps`.
//  */
// export type TextFieldProps<
//     TFieldValues extends FieldValues = FieldValues,
//     TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
//     TTransformedValues = TFieldValues,
// > = React.ComponentPropsWithRef<RNTextInput> &
//     ControllerProps<TFieldValues, TName, TTransformedValues> & {
//         hint?: string
//         label?: string
//         labelIcon?: IconName
//         labelStyle?: TextStyle
//         defaultErrorMessage?: string
//         icon?: IconName
//         isRequired?: boolean
//         isValid?: boolean
//         isDisabled?: boolean
//         showRequiredAsterisk?: boolean
//         allowSecureTextToggle?: boolean
//         // message?: string
//         showCharacterLimit?: boolean
//         securityToggleA11y?: Pick<AccessibilityProps, 'accessibilityHint' | 'accessibilityLabel'>
//         clearButtonAccessibilityLabel?: string
//         clearButtonAccessibilityHint?: string
//         characterCountHint?: string
//         characterCountLabel?: string
//         validationHint?: string
//         onClear?: (event: GestureResponderEvent) => void
//     }

export type FormLabelProps = React.ComponentPropsWithRef<typeof Label.Text> & {
    prefix?: React.ReactNode
    suffix?: React.ReactNode
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
    unmasked?: boolean
    // onShow?: (value: boolean) => boolean
}

export type ClearButtonProps<TContext = any> = SlottablePressableProps & {
    context?: TContext
    disabled?: boolean
}
