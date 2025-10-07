import * as React from 'react'
import {
    StyleSheet,
    type PressableStateCallbackType,
    type ImageStyle as RNImageStyle,
    type PressableProps as RNPressableProps,
    type StyleProp,
} from 'react-native'

import type {
    ComponentTypeName,
    PressableRef,
    PropsWithRef,
    RNPressable,
} from '../../types/component.types'

function isValidElement<P = {}>(props: unknown): props is React.ReactElement<P & { ref: any }> {
    return React.isValidElement(props)
}

export const Pressable = React.forwardRef<React.ComponentRef<RNPressable>, RNPressableProps>(
    (props, forwardedRef) => {
        const { children, ...pressableSlotProps } = props

        if (!React.isValidElement(children)) {
            console.log('Slot.Pressable - Invalid asChild element', children)
            return null
        }

        return React.cloneElement<
            React.ComponentPropsWithoutRef<RNPressable>,
            React.ComponentRef<RNPressable>
        >(isTextChildren(children) ? <></> : children, {
            ...mergeProps(pressableSlotProps, children.props as AnyProps),
            ref:
                forwardedRef ?
                    composeRefs(forwardedRef, (children as any).ref)
                :   (children as any).ref,
        })
    },
)

Pressable.displayName = 'SlotPressable'

export function createSlot<TName extends ComponentTypeName>(componentName: TName) {
    const SlotComponent = ({ ref, ...props }: PropsWithRef<TName>) => {
        const { children, ...slotProps } = props

        if (isTextChildren(children)) {
            return <></>
        }

        if (isValidElement(children)) {
            return React.cloneElement(children, {
                ...mergeProps(slotProps, children.props),
                ref: ref ? composeRefs(ref, (children as any).ref) : (children as any).ref,
            })
        }

        console.log(`Slot.${Text} - Invalid asChild element`, children)

        return null
    }

    SlotComponent.displayName = `Slot${componentName}`

    return SlotComponent
}

// This project uses code from WorkOS/Radix Primitives.
// The code is licensed under the MIT License.
// https://github.com/radix-ui/primitives/tree/main

function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
    return (node: T) =>
        refs.forEach(ref => {
            if (typeof ref === 'function') {
                ref(node)
            } else if (ref != null) {
                ;(ref as React.RefObject<T>).current = node
            }
        })
}

type AnyProps = Record<string, any>

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
    // all child props should override
    const overrideProps = { ...childProps }

    for (const propName in childProps) {
        const slotPropValue = slotProps[propName]
        const childPropValue = childProps[propName]
        // const props: { [K in keyof ChildProps]: (...args: unknown[]) => void } = {}

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
): children is string | string[] {
    return Array.isArray(children) ?
            children.every(child => typeof child === 'string')
        :   typeof children === 'string'
}
