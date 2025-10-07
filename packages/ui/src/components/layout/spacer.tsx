import React from 'react'
import { View, type ViewProps } from 'react-native'

import { type Space } from '@ui/theme'
import { StyleSheet } from 'react-native-unistyles'

type SpacerProps = {
    size: Space
    axis?: 'x' | 'y'
    debug?: boolean
    style?: ViewProps['style']
}

export function Spacer({ size, axis, debug = false, style }: SpacerProps) {
    styles.useVariants({
        axis: axis || 'y',
        debug,
    })

    return <View style={[styles.spacer(size), style]} />
}

const styles = StyleSheet.create(theme => ({
    spacer: (size: Space) => ({
        flexShrink: 0,
        width: theme.space[size],
        height: theme.space[size],
        variants: {
            axis: {
                x: { height: 'auto' },
                y: { width: 'auto' },
            },
            debug: {
                true: { backgroundColor: 'red' },
                false: { backgroundColor: 'transparent' },
            },
        },
    }),
}))

// @ts-ignore
Spacer.__SPACER__ = true // This is used to detect spacers inside Stack component
