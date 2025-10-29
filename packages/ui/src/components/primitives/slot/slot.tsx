import React from 'react'
import {
    Animated,
    Image as RNImage,
    Pressable as RNPressable,
    // Text as RNText,
    View as RNView,
    StyleSheet,
    type PressableStateCallbackType,
    type ImageStyle as RNImageStyle,
    type PressableProps as RNPressableProps,
    type StyleProp,
} from 'react-native'

import { Text as RNText } from '../../text'

/**************************************************
 *
 * Pressable Slot Component
 *
 **************************************************/

const Pressable = ({ ref, ...props }: React.ComponentPropsWithRef<typeof RNPressable>) => {
    const { children, ...pressableSlotProps } = props

    if (!React.isValidElement(children)) {
        console.log('Slot.Pressable - Invalid asChild element', children)
        return null
    }

    return React.cloneElement<
        React.ComponentPropsWithoutRef<typeof RNPressable>,
        React.ComponentRef<typeof RNPressable>
    >(isTextChildren(children) ? <></> : children, {
        ...mergeProps(pressableSlotProps, children.props as AnyProps),
        ref: (children as any).ref,
    })
}

Pressable.displayName = 'SlotPressable'

/**************************************************
 *
 * View Slot Component
 *
 **************************************************/

const View = ({ ref, ...props }: React.ComponentPropsWithRef<typeof RNView>) => {
    const { children, ...viewSlotProps } = props

    if (!React.isValidElement(children)) {
        console.log('Slot.View - Invalid asChild element', children)
        return null
    }

    return React.cloneElement<
        React.ComponentPropsWithoutRef<typeof RNView>,
        React.ComponentRef<typeof RNView>
    >(isTextChildren(children) ? <></> : children, {
        ...mergeProps(viewSlotProps, children.props as AnyProps),
        ref: (children as any).ref,
    })
}

View.displayName = 'SlotView'

/**************************************************
 *
 * Animated View Slot Component
 *
 **************************************************/

const AnimatedView = ({ ref, ...props }: React.ComponentPropsWithRef<typeof Animated.View>) => {
    const { children, ...viewSlotProps } = props

    if (!React.isValidElement(children)) {
        console.log('Slot.AnimatedView - Invalid asChild element', children)
        return null
    }

    return React.cloneElement<
        React.ComponentPropsWithoutRef<typeof Animated.View>,
        React.ComponentRef<typeof RNView>
    >(isTextChildren(children) ? <></> : children, {
        ...mergeProps(viewSlotProps, children.props as AnyProps),
        ref: (children as any).ref,
    })
}

AnimatedView.displayName = 'AnimatedViewSlot'

/**************************************************
 *
 * Text Slot Component
 *
 **************************************************/

const Text = ({ ref, ...props }: React.ComponentPropsWithRef<typeof RNText>) => {
    const { children, ...textSlotProps } = props

    if (!React.isValidElement(children)) {
        console.log('Slot.Text - Invalid asChild element', children)
        return null
    }

    return React.cloneElement<
        React.ComponentPropsWithoutRef<typeof RNText>,
        React.ComponentRef<typeof RNText>
    >(isTextChildren(children) ? <></> : children, {
        ...mergeProps(textSlotProps, children.props as AnyProps),
        ref: (children as any).ref,
    })
}

Text.displayName = 'SlotText'

/**************************************************
 *
 * Image Slot Component
 *
 **************************************************/

const Image: React.FC<React.PropsWithChildren<React.ComponentPropsWithRef<typeof RNImage>>> = ({
    ref,
    ...props
}) => {
    const { children, ...imageSlotProps } = props

    if (!React.isValidElement(children)) {
        console.log('Slot.Image - Invalid asChild element', children)
        return null
    }

    return React.cloneElement<
        React.ComponentPropsWithoutRef<typeof RNImage>,
        React.ComponentRef<typeof RNImage>
    >(isTextChildren(children) ? <></> : children, {
        ...mergeProps(imageSlotProps, children.props as AnyProps),
        ref: (children as any).ref,
    })
}

Image.displayName = 'SlotImage'

export { AnimatedView, Image, Pressable, Text, View }

export type AnyProps = Record<string, any>

export function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
    // all child props should override
    const overrideProps = { ...childProps }

    for (const propName in childProps) {
        const slotPropValue = slotProps[propName]
        const childPropValue = childProps[propName]

        const isHandler = /^on[A-Z]/.test(propName)
        if (isHandler) {
            // if the handler exists on both, we compose them
            if (slotPropValue && childPropValue) {
                overrideProps[propName] = (...args: unknown[]) => {
                    childPropValue(...args)
                    slotPropValue(...args)
                }
            }
            // but if it exists only on the slot, we use only this one
            else if (slotPropValue) {
                overrideProps[propName] = slotPropValue
            }
        }
        // if it's `style`, we merge them
        else if (propName === 'style') {
            overrideProps[propName] = combineStyles(slotPropValue, childPropValue)
        } else if (propName === 'className') {
            overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ')
        }
    }

    return { ...slotProps, ...overrideProps }
}

/**************************************************
 *
 * Slot Helper Functions
 *
 **************************************************/

type PressableStyle = RNPressableProps['style']
type ImageStyle = StyleProp<RNImageStyle>
type Style = PressableStyle | ImageStyle

function combineStyles(slotStyle?: Style, childValue?: Style) {
    if (typeof slotStyle === 'function' && typeof childValue === 'function') {
        return (state: PressableStateCallbackType) => {
            return StyleSheet.flatten([slotStyle(state), childValue(state)])
        }
    }
    if (typeof slotStyle === 'function') {
        return (state: PressableStateCallbackType) => {
            return childValue ?
                    StyleSheet.flatten([slotStyle(state), childValue])
                :   slotStyle(state)
        }
    }
    if (typeof childValue === 'function') {
        return (state: PressableStateCallbackType) => {
            return slotStyle ?
                    StyleSheet.flatten([slotStyle, childValue(state)])
                :   childValue(state)
        }
    }

    return StyleSheet.flatten([slotStyle, childValue].filter(Boolean))
}

export function isTextChildren(
    children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode),
) {
    return Array.isArray(children) ?
            children.every(child => typeof child === 'string')
        :   typeof children === 'string'
}
