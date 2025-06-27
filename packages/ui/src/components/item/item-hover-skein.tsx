import React from 'react'

import { Box, BoxProps } from '../box/box'

export const ItemHover = ({
    isFocused,
    isHovered,
    offset = 12,
    ...rest
}: {
    isFocused: boolean
    isHovered: boolean
    offset?: number
} & BoxProps) => {
    return (
        <Box
            opacity={isFocused || isHovered ? 1 : 0}
            borderRadius="xs"
            position="absolute"
            size={`calc(100% + ${offset * 2}px)}`}
            left={-offset}
            top={-offset}
            bg="base.component-bg-hover"
            zIndex="-1"
            {...rest}
        />
    )
}
