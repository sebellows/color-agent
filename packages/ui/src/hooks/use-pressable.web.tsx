import { ReactElement } from 'react'

import { useFocus, useHover } from 'use-events'
import { Box, BoxProps } from '@ui/components/box'

function ItemHover({
    isFocused,
    isHovered,
    ...rest
}: {
    isFocused: boolean
    isHovered: boolean
} & BoxProps) {
    return (
        <Box
            opacity={isFocused || isHovered ? 1 : 0}
            // transition="transition"
            borderRadius="xs"
            position="absolute"
            size="calc(100% + 24px)"
            left={-4}
            top={-4}
            bg="base.component-bg-hover"
            zIndex="-1"
            {...rest}
        />
    )
}

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
