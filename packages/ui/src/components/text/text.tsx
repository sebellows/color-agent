import React, { type ElementRef } from 'react'
import { type TextProps as RNTextProps } from 'react-native'
import {
    color,
    createRestyleComponent,
    createText,
    createVariant,
    LayoutProps,
    VariantProps,
    type TextProps as RestyleTextProps,
} from '@shopify/restyle'

import { Theme } from '@ui/theme'
import { Box } from '../box/box'

const Text = createText<Theme>()

type BaseTextProps = RNTextProps & RestyleTextProps<Theme>

export type TextProps = BaseTextProps & {
    bold?: boolean
    color?: keyof Theme['colors']
    isDisplay?: boolean
    italic?: boolean
    level?: '1' | '2' | '3' | '4' | '5' | '6'
}

function useTextProps({ bold, color, isDisplay, italic, level, variant, ...props }: TextProps) {
    const variantProps = React.useMemo(() => {
        const _props: Pick<TextProps, 'color' | 'fontWeight' | 'fontStyle' | 'level' | 'variant'> =
            {}

        if (isDisplay && !level) level = '1' // Default to display level 1 if not specified

        if (level) {
            let levelNumber = parseInt(level, 10)
            if (isDisplay) {
                if (levelNumber < 1 || levelNumber > 4) {
                    throw new TypeError(`Display level must be between 1 and 4, received ${level}`)
                }
                _props.variant = `display0${level}}` as keyof Theme['textVariants']
            } else {
                if (levelNumber < 1 || levelNumber > 4) {
                    throw new TypeError(`Heading level must be between 1 and 6, received ${level}`)
                }
                _props.variant = `heading0${level}}` as keyof Theme['textVariants']
            }
        } else if (variant) _props.variant = variant
        if (bold) _props.fontWeight = '700'
        if (italic) _props.fontStyle = 'italic'
        if (color) _props.color = color

        return _props
    }, [bold, color, italic, level, variant])

    return {
        ...variantProps,
        ...props,
    }
}

const Heading = (props: TextProps) => {
    const textProps = useTextProps(props)

    return <Text {...textProps} />
}

const Blockquote = ({
    color = 'base.fg-subtle',
    isDisplay = true,
    italic = true,
    level = '4',
    source,
    ...props
}: TextProps & { source?: string }) => {
    const textProps = useTextProps({ color, isDisplay, italic, level, ...props })

    return (
        <Box borderLeftWidth={4} borderLeftColor={'accent.border'} pl={'md'} my={'sm'}>
            <Text {...textProps} />
            {source && (
                <Text
                    {...textProps}
                    variant={'caption'}
                    color={'base.fg-subtle'}
                    mt={'xs'}
                    textAlign={'right'}
                >
                    &emdash;&thinsp;{source}
                </Text>
            )}
        </Box>
    )
}

const CalloutText = ({
    children,
    childPosition,
    ...props
}: TextProps & { childPosition?: 'before' | 'after' }) => {
    const textProps = useTextProps(props)

    return (
        <Box borderLeftWidth={4} borderLeftColor={'accent.border'} pl={'md'}>
            {children && childPosition ?
                childPosition === 'before' ?
                    <>
                        {children}
                        <Text {...textProps} />
                    </>
                :   <>
                        <Text {...textProps} />
                        {children}
                    </>

            :   <Text {...textProps} />}
        </Box>
    )
}

export { Blockquote, CalloutText, Heading, Text }
