import { ReactElement } from 'react'
import { View, ViewProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'
import { useFocus, useHover } from 'use-events'

import { getPosition } from '../design-system/design-system.utils'
import { UsePressedState, usePressedState } from './use-pressed-state.native'

// export const Card = (props: ViewProps) => <View style={styles.card} {...props} />

// const styles = StyleSheet.create(theme => ({
//     card: {
//         backgroundColor: theme.colors.bg,
//         borderRadius: theme.radii.default,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: theme.colors.line3,
//         padding: theme.space.default,
//         boxShadow: theme.boxShadows.soft3,
//     },
// }))

function ItemHover({
    isFocused,
    isHovered,
    ...props
}: {
    isFocused: boolean
    isHovered: boolean
} & ViewProps) {
    const state = usePressedState()
    return <View style={styles.item(state)} {...props}></View>
}

const styles = StyleSheet.create(theme => {
    return {
        item: (state: UsePressedState) => ({
            backgroundColor: theme.colors.componentBgHover,
            borderRadius: theme.radii.sm,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.line3,
            padding: theme.space.default,
            position: 'absolute',
            ...getPosition(theme, '-md', 'left', 'top'),
            boxShadow: theme.boxShadows.soft3,
            transition: 'transition',
            zIndex: -1,
            opacity: state.pressed?.value ? 1 : 0,
            _web: {
                _hover: {
                    opacity: 1,
                },
                _focus: {
                    opacity: 1,
                },
            },
        }),
    }
})

type HoverBind = ReturnType<typeof useHover>[1]
type FocusBind = ReturnType<typeof useFocus>[1]

interface DefaultSpreadProps extends HoverBind, FocusBind {
    cursor: 'pointer' | 'default'
    position: 'relative'
    zIndex: 1
}

interface StateReturnProps {
    isHovered: boolean
    isFocused: boolean
}

type UsePressableReturn = [ReactElement, DefaultSpreadProps, StateReturnProps]

export function usePressable(isPressable?: boolean): UsePressableReturn {
    const [isHovered, bind] = useHover()
    const [isFocused, focusBind] = useFocus()

    const component = <ItemHover isHovered={isHovered} isFocused={isFocused} />
    if (!isPressable)
        return [
            <></>,
            // Not really this type but it's safe to spread
            {} as unknown as DefaultSpreadProps,
            { isFocused: false, isHovered: false } as const,
        ]
    return [
        component,
        {
            ...bind,
            ...focusBind,
            cursor: isPressable ? 'pointer' : 'default',
            position: 'relative',
            zIndex: 1,
        },
        { isHovered, isFocused },
    ]
}
