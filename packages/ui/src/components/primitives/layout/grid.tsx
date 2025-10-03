import { cloneElement, isValidElement, useState, type ReactNode } from 'react'
import { View, type LayoutChangeEvent, type ViewProps } from 'react-native'

import { type Space } from '@ui/theme'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { flattenChildren } from '../../helpers'

type Props = ViewProps & {
    spacing: Space
    align?: 'center' | 'start' | 'end' | 'stretch'
    justify?: 'center' | 'start' | 'end' | 'between' | 'around'
    columns?: number
    children: ReactNode
}

export function Grid({ children, spacing = 'none', align, justify, columns, ...rest }: Props) {
    // Handle `Fragments` by flattening children
    const elements = flattenChildren(children).filter(e => isValidElement(e))
    const { theme } = useUnistyles()
    const [width, setWidth] = useState(-1)
    const colWidth = columns !== undefined && width !== -1 ? width / columns : undefined

    styles.useVariants({
        align,
        justify,
    })

    const space = theme.space[spacing] || 0

    return (
        <View
            {...rest}
            style={[styles.wrapper, rest.style, { margin: space / -2 }]}
            onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        >
            {elements.map((child, index) => {
                return (
                    <View
                        key={index}
                        style={{
                            margin: space / 2,
                            width: colWidth && colWidth - space,
                        }}
                    >
                        {isValidElement(child) ? cloneElement(child) : null}
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create(() => ({
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        variants: {
            align: {
                center: { alignItems: 'center' },
                start: { alignItems: 'flex-start' },
                end: { alignItems: 'flex-end' },
                stretch: { alignItems: 'stretch' },
            },
            justify: {
                center: { justifyContent: 'center' },
                start: { justifyContent: 'flex-start' },
                end: { justifyContent: 'flex-end' },
                between: { justifyContent: 'space-between' },
                around: { justifyContent: 'space-around' },
            },
        },
    },
}))
