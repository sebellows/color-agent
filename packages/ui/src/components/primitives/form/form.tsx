import React from 'react'
import { View, type GestureResponderEvent } from 'react-native'

import { FieldValues, useForm, UseFormReturn } from 'react-hook-form'

import { useAugmentedRef } from '../hooks'
import { Pressable } from '../pressable'
import { Slot } from '../slot'
import { ResetProps, RootProps, SubmitProps } from './form.types'

type RootContextValue<
    TFormFields extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFormFields,
> = UseFormReturn<TFormFields, TContext, TTransformedValues> &
    Pick<
        RootProps<TFormFields, TContext, TTransformedValues>,
        'onInvalid' | 'onReset' | 'onSubmit'
    > & {
        nativeID: string
    }

const RootContext = React.createContext<RootContextValue<any, any> | null>(null)

function sortProps<
    TFormFields extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFormFields,
>(props: RootProps<TFormFields, TContext, TTransformedValues>) {
    const {
        mode = 'onSubmit',
        disabled,
        reValidateMode,
        errors,
        resetOptions,
        resolver,
        context,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        progressive,
        criteriaMode,
        delayError,
        formControl,
        ...viewProps
    } = props

    return {
        formProps: {
            mode,
            disabled,
            reValidateMode,
            errors,
            resetOptions,
            resolver,
            context,
            shouldFocusError,
            shouldUnregister,
            shouldUseNativeValidation,
            progressive,
            criteriaMode,
            delayError,
            formControl,
        },
        viewProps,
    }
}

const Root = <
    TFormFields extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFormFields,
>({
    ref,
    asChild,
    onSubmit,
    onInvalid,
    onReset,
    children,
    ...props
}: RootProps<TFormFields, TContext, TTransformedValues>) => {
    const nativeID = React.useId()
    const augmentedRef = useAugmentedRef({ ref })

    const { formProps, viewProps } = sortProps(props)

    const formValue = useForm<TFormFields, TContext, TTransformedValues>(formProps)

    const Component = asChild ? Slot.View : View

    return (
        <RootContext.Provider value={{ ...formValue, onInvalid, onReset, onSubmit, nativeID }}>
            <Component ref={augmentedRef} nativeID={nativeID} {...viewProps} />
        </RootContext.Provider>
    )
}

Root.displayName = 'FormRoot.Native'

function useRootContext() {
    const context = React.useContext(RootContext)
    if (!context) {
        throw new Error('Form compound components cannot be rendered outside the Form component')
    }
    return context
}

const SubmitButton = ({ ref, asChild, onPress: onPressProp, ...props }: SubmitProps) => {
    const formContext = useRootContext()
    if (!formContext) {
        throw new Error('SubmitButton must be used within a Form.Root')
    }

    function onPress(event: GestureResponderEvent) {
        formContext.handleSubmit(
            data => {
                formContext.onSubmit?.(data, event)
            },
            (errors, event) => {
                formContext.onInvalid?.(errors, event)
            },
        )(event)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} onPress={onPress} {...props} />
}

SubmitButton.displayName = 'FormSubmitButton.Native'

const ResetButton = ({ ref, asChild, onPress: onPressProp, ...props }: ResetProps) => {
    const formContext = useRootContext()
    if (!formContext) {
        throw new Error('ResetButton must be used within a Form.Root')
    }

    function onPress(event: GestureResponderEvent) {
        formContext.reset()
        formContext.onReset?.(event)
        onPressProp?.(event)
    }

    const Component = asChild ? Slot.Pressable : Pressable

    return <Component ref={ref} onPress={onPress} {...props} />
}

ResetButton.displayName = 'FormResetButton.Native'

export { Root, SubmitButton, ResetButton, useRootContext }
