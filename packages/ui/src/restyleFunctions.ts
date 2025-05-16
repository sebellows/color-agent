import { BaseTheme, createRestyleFunction, ResponsiveValue } from '@shopify/restyle'
import { ColorValue, ImageResizeMode } from 'react-native'

const overlayColor = createRestyleFunction({ property: 'overlayColor', themeKey: 'colors' })
const objectFit = createRestyleFunction({ property: 'objectFit' })
const overflow = createRestyleFunction({ property: 'overflow' })
const resizeMode = createRestyleFunction({ property: 'resizeMode' })

export { overlayColor, objectFit, overflow, resizeMode }

export interface OverlayColorProps<Theme extends BaseTheme> {
    overlayColor?: ResponsiveValue<keyof Theme['colors'], Theme['breakpoints']>
}

export interface ObjectFitProps<Theme extends BaseTheme> {
    objectFit?: ResponsiveValue<
        'cover' | 'contain' | 'fill' | 'scale-down' | undefined,
        Theme['breakpoints']
    >
}

export interface OverflowProps<Theme extends BaseTheme> {
    overflow?: ResponsiveValue<'visible' | 'hidden' | undefined, Theme['breakpoints']>
}

export interface ResizeModeProps<Theme extends BaseTheme> {
    resizeMode?: ResponsiveValue<ImageResizeMode | undefined, Theme['breakpoints']>
}
