import { Pressable, PressableProps } from 'react-native'

import { composeEventHandlers } from '../../lib/compose-events'
import { createComponent } from '../../lib/create-component'
import { createContextScope, Scope } from '../../lib/create-context'
import { withStaticProps } from '../../lib/with-static-props'
import { Box, BoxProps } from '../box'

const FORM_NAME = 'Form'

export const FormFrame = createComponent(Box, {
    name: FORM_NAME,
    tag: 'form',
})

type ScopedProps<P> = P & { __scopeForm?: Scope }
const [createFormContext] = createContextScope(FORM_NAME)

type FormContextValue = {
    onSubmit?: () => unknown
}

export const [FormProvider, useFormContext] = createFormContext<FormContextValue>(FORM_NAME)

export type FormProps = BoxProps & {
    onSubmit?: () => void
}

const TRIGGER_NAME = 'FormTrigger'

const FormTriggerFrame = createComponent(Pressable, {
    name: TRIGGER_NAME,
})

export type FormTriggerProps = BoxProps & PressableProps

export const FormTrigger = FormTriggerFrame(
    (props: ScopedProps<FormTriggerProps>, ref: React.ComponentRef<typeof Pressable>) => {
        const { __scopeForm, children, onPress, ...triggerProps } = props
        const context = useFormContext(TRIGGER_NAME, __scopeForm)

        return (
            <FormTriggerFrame
                tag="button"
                {...(triggerProps as any)}
                ref={ref}
                onPress={composeEventHandlers(onPress as any, context.onSubmit)}
            >
                {children}
            </FormTriggerFrame>
        )
    },
)

const FormComponent = function Form({ onSubmit, ...props }: ScopedProps<FormProps>) {
    return (
        <FormProvider scope={props.__scopeForm} onSubmit={onSubmit}>
            <FormFrame {...(props as any)} onSubmit={(e: any) => e.preventDefault()} />
        </FormProvider>
    )
}

export const Form = withStaticProps(FormComponent, {
    Trigger: FormTrigger,
})
