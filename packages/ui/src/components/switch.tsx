import { PressableProps, View, type ViewProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { createContextScope, Scope } from '../lib/create-context'

const SWITCH_NAME = 'Switch'

type SwitchBaseProps = ViewProps & Pick<PressableProps, 'onPress'>

export type SwitchExtraProps = {
    labeledBy?: string
    disabled?: boolean
    name?: string
    value?: string
    checked?: boolean
    defaultChecked?: boolean
    required?: boolean
    onCheckedChange?(checked: boolean): void
}

type ScopedProps<P> = P & { __scopeSwitch?: Scope }
const [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME)

type SwitchContextValue = { checked: boolean; disabled?: boolean }
const [SwitchProvider, useSwitchContext] = createSwitchContext<SwitchContextValue>(SWITCH_NAME)

type SwitchElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
interface SwitchProps extends PrimitiveButtonProps {
    checked?: boolean
    defaultChecked?: boolean
    required?: boolean
    onCheckedChange?(checked: boolean): void
}

const styles = StyleSheet.create(theme => ({
    card: {
        backgroundColor: theme.colors.bg,
        borderRadius: theme.radii.default,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.line3,
        padding: theme.space.default,
        boxShadow: theme.boxShadows.soft3,
    },
}))
