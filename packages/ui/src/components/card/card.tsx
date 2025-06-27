import React from 'react'
import { createRestyleComponent, createVariant, VariantProps } from '@shopify/restyle'

import { Theme } from '@ui/theme/native'

import { Box, BoxProps } from '../box/box'
import { TextProps, Text } from '../text/text'

type CardProps = VariantProps<Theme, 'cardVariants'> & BoxProps

const variant = createVariant<Theme, 'cardVariants'>({
    themeKey: 'cardVariants',
})

const Card = createRestyleComponent<CardProps, Theme>([variant], Box)

const CardHeader = ({ ...props }: CardProps) => {
    return <Card variant="cardHeader" {...props} />
}

const CardTitle = (props: TextProps) => {
    return <Text variant="cardTitle" {...props} />
}

const CardDescription = (props: TextProps) => {
    return <Text variant="detail" {...props} />
}

const CardContent = ({ ...props }: CardProps) => {
    return <Card variant="cardContent" {...props} />
}

const CardFooter = ({ ...props }: CardProps) => {
    return <Card variant="cardFooter" {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, type CardProps }
