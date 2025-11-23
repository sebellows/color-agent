import React from 'react'
import { ViewStyle } from 'react-native'

import { isUndefined } from 'es-toolkit'
import { ScopedTheme } from 'react-native-unistyles'

import { BreakpointToken } from '../../design-system/design-tokens/breakpoints'
import { ColorVariant } from '../../design-system/design-tokens/colors.native'
import { Space } from '../../theme/theme.types'

type GroupContextProps = {
    autoFocus?: boolean

    colorVariant?: ColorVariant

    // Makes inverting color scheme for group possible, allowing opposing colors to what is in rest of app
    dark?: boolean

    disabled?: boolean

    // Based on flexDirection we can resolve how to apply gaps/spaces to child elements
    flexDirection?: ViewStyle['flexDirection']

    // Set a gap between child elements
    space?: number | Space | { [Key in BreakpointToken]: number | Space }

    children?: React.ReactNode
}

type GroupStateType = 'active' | 'focused' | 'hovered' | undefined
type GroupState = { state?: GroupStateType }

type GroupContextValue = Omit<GroupContextProps, 'autoFocus'> & GroupState

function isTrue(value: unknown): boolean {
    return `${value}` === 'true'
}

const defaultContextValue: GroupContextValue = {
    state: undefined,
}

export const createGroupContext = (
    initialContextValue: GroupContextValue = defaultContextValue,
) => {
    const GroupContext = React.createContext<GroupContextValue>(initialContextValue)

    const GroupProvider = ({
        autoFocus,
        children,
        colorVariant,
        dark,
        disabled,
        flexDirection = 'row',
        space,
    }: GroupContextProps) => {
        const [state, setState] = React.useState<GroupStateType>(undefined)

        if (disabled && !isUndefined(state)) setState(undefined)

        if (!disabled && isUndefined(state) && isTrue(autoFocus)) {
            setState('focused')
        }

        return (
            <GroupContext.Provider value={{ colorVariant, dark, disabled, flexDirection, space }}>
                <ScopedTheme name={dark ? 'dark' : 'light'}>
                    <>{children}</>
                </ScopedTheme>
            </GroupContext.Provider>
        )
    }

    function useGroupContext() {
        const context = React.useContext(GroupContext)

        if (!context) {
            throw new Error(
                'Group compound components cannot be rendered outside of a Group provider',
            )
        }

        return context
    }

    return { GroupProvider, useGroupContext }
}
