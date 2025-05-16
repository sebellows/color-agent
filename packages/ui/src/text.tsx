import {
    color,
    createRestyleComponent,
    createText,
    createVariant,
    VariantProps,
    type TextProps as RestyleTextProps,
} from '@shopify/restyle'
import { Theme } from './theme'
import React from 'react'

const TextComponent = createText<Theme>()

export type TextProps = RestyleTextProps<Theme>

const variant = createVariant<Theme, 'textVariants'>({
    themeKey: 'textVariants',
})

const Text = createRestyleComponent<VariantProps<Theme, 'textVariants'> & TextProps, Theme>(
    [variant],
    TextComponent,
)

const Heading = (props: TextProps) => {
    return <Text variant={'header'} {...props} />
}

const Subheading = (props: TextProps) => {
    return <Text variant={'subheader'} {...props} />
}

export { Heading, Subheading, Text }
