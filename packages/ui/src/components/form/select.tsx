import {
    forwardRef,
    useImperativeHandle,
    useState,
    type ComponentProps,
    type ReactNode,
} from 'react'
import { Keyboard, type AccessibilityProps, type ViewStyle } from 'react-native'

import { useHaptics } from '@ui/hooks/use-haptics.native'
import { callAll } from '@ui/utils/common'

import type { IconName } from '../icon'
import { PickerModal } from '../picker-modal'
import { PickerSheet } from '../picker-sheet'
import { InputButton } from './input-button'

type BaseProps = {
    options: { label: string; value: string }[]
    label: string
    labelIcon?: IconName
    placeholder?: string
    icon?: IconName
    message?: string
    style?: ViewStyle
    isDisabled?: boolean
    isValid?: boolean
    isRequired?: boolean
    showRequiredAsterisk?: boolean
    emptyContent?: ReactNode
    pickerType?: 'modal' | 'sheet'
}

type SingleValueProps = {
    multiple?: false
    value: string | null
    onChange: (option: string) => void
}

type MultipleValueProps = {
    multiple: true
    value: string[] | null
    onChange: (option: string[]) => void
}

type Props = BaseProps & (SingleValueProps | MultipleValueProps) & AccessibilityProps

export const Select = forwardRef(
    (
        {
            value,
            options,
            label,
            labelIcon,
            placeholder = 'Select',
            message,
            emptyContent,
            pickerType,
            multiple = false,
            icon = 'chevron-down',
            onChange,
            accessibilityRole,
            accessibilityLabel,
            accessibilityHint,
            ...rest
        }: Props,
        ref: any, // eslint-disable-line typescript-eslint/no-explicit-any
    ) => {
        const [isPickerOpen, setPickerOpen] = useState(false)
        const visibleValue =
            Array.isArray(value) ?
                options
                    .filter(o => value.includes(o.value))
                    .map(o => o.label)
                    .join(', ')
            :   options.find(o => o.value === value)?.label

        const pickerProps: ComponentProps<typeof PickerSheet> = {
            label,
            options,
            multiple,
            emptyContent,
            isVisible: isPickerOpen,
            // eslint-disable-next-line typescript-eslint/no-explicit-any
            selected: value as any,
            // eslint-disable-next-line typescript-eslint/no-explicit-any
            onConfirm: onChange as any,
            onClose: () => setPickerOpen(false),
        }

        useImperativeHandle(ref, () => ({
            focus: () => {
                setPickerOpen(true)
            },
            blur: () => {
                setPickerOpen(false)
            },
        }))

        const { triggerHaptics } = useHaptics()

        // NOTE: Dismissing the keyboard first is necessary to force any focused input to blur
        const onPress = () =>
            callAll(Keyboard.dismiss, () => setPickerOpen(true), triggerHaptics('selection'))

        return (
            <>
                <InputButton
                    {...rest}
                    value={visibleValue}
                    label={label}
                    labelIcon={labelIcon}
                    icon={icon}
                    message={message}
                    placeholder={placeholder}
                    isFocused={isPickerOpen}
                    onPress={onPress}
                    accessibilityRole={accessibilityRole ?? 'button'}
                    accessibilityLabel={
                        accessibilityLabel ??
                        `Select input for ${label}, current value: ${
                            Array.isArray(value) ? value.join(', ') : value ?? ''
                        }`
                    }
                    accessibilityHint={accessibilityHint ?? 'Double tap to open options to select'}
                />

                {(!pickerType && options.length > 20) || pickerType === 'sheet' ?
                    <PickerSheet {...pickerProps} />
                :   <PickerModal {...pickerProps} />}
            </>
        )
    },
)

Select.displayName = 'Select'
