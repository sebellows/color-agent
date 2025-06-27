import React from 'react'
import { Meta, StoryFn } from '@storybook/react-native'
import { Text as Component } from './text'

export default {
    component: Component,
    args: {
        color: 'base.fg-primary',
        variant: 'body01',
    },
} as Meta<typeof Component>

export const Text: StoryFn<typeof Component> = args => <Component {...args}>Hello world!</Component>
