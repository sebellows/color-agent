import type { ComponentType } from 'react'

import type {
    SimpleResolveValue,
    StyleDescriptor,
    StyleFunctionResolver,
} from '@core/react-native-css/compiler'

import { StyleCollection } from '../injection'
import { observable, weakFamily, type Getter } from '../reactivity'
import { shorthandHandler } from './shorthand'

const name = ['name', 'string', 'none'] as const
const delay = ['delay', 'number', 0] as const
const duration = ['duration', 'number', 0] as const
const fill = ['fill', ['none', 'forwards', 'backwards', 'both'], 'none'] as const
const iteration = ['iteration', 'number', 1] as const
const playState = ['playState', ['running', 'paused'], 'running'] as const
const direction = [
    'direction',
    ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    'normal',
] as const
const easing = [
    'timingFunction',
    ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
    'ease',
] as const

export const animationShorthand = shorthandHandler(
    [
        [name],
        [duration, name],
        [name, duration],
        [duration, delay, name],
        [duration, delay, iteration, name],
        [duration, delay, iteration, easing, name],
        [name, duration, easing, delay, iteration, fill],
    ],
    [name, delay, direction, duration, fill, iteration, playState, easing],
)

export const animatedComponentFamily = weakFamily((component: ComponentType) => {
    if ('displayName' in component && component.displayName?.startsWith('Animated.')) {
        return component
    }

    const createAnimatedComponent = require('react-native-reanimated').createAnimatedComponent

    return createAnimatedComponent(component)
})

export const animation: StyleFunctionResolver<'animation-name'> = (
    resolveValue,
    descriptor,
    get,
    options,
) => {
    const animationShortHandTuples = animationShorthand(resolveValue, descriptor, get, options)

    if (!Array.isArray(animationShortHandTuples)) return

    animationShortHandTuples.pop()

    const nameTuple = animationShortHandTuples.find(tuple => tuple[1] === 'animationName')

    const name = nameTuple?.[0]

    if (!nameTuple || typeof name !== 'string') {
        return
    }

    const keyframes = get(StyleCollection.keyframes(name))

    const animation: Record<string, any> = {}
    for (const [progress, declarations] of keyframes) {
        animation[progress] ??= {}

        const props = options.calculateProps?.(
            get,
            // Cast this into a StyleRule[]
            [{ s: [0], d: declarations }],
            options.renderGuards,
            options.inheritedVariables,
            options.inlineVariables,
        )

        if (!props) {
            continue
        }

        if (props.normal) {
            Object.assign(animation[progress], props.normal)
        }
        if (props.important) {
            Object.assign(animation[progress], props.important)
        }

        animation[progress] = animation[progress].style
    }

    nameTuple[0] = animation

    return applyShorthand(animationShortHandTuples)
}

type AnimationFamilyOptions = {
    name: StyleDescriptor
    resolveValue: SimpleResolveValue
    inheritedVariables: any
}

const animationFamily = weakFamily((_: Getter, options: AnimationFamilyOptions) => {
    const { name: nameDescriptor, resolveValue } = options

    return observable(get => {
        const names = resolveValue(nameDescriptor)

        if (!Array.isArray(names)) {
            return
        }

        return names.map((name: string) => {
            const keyframes = get(StyleCollection.keyframes(name))

            const animation: Record<string, any> = {}

            for (const [progress, declarations] of keyframes) {
                const result: Record<string, any> = {}

                // This code needs to match calculateProps
                // TODO: Refactor this to use the same code
                for (const declaration of declarations) {
                    let target = result

                    if (!Array.isArray(declaration)) {
                        // Static styles
                        Object.assign(target, declaration)
                    } else {
                        // Dynamic styles
                        let value: any = declaration[0]
                        let propPath = declaration[1]
                        let prop: string | undefined = ''

                        if (typeof propPath === 'string') {
                            prop = propPath
                        } else {
                            prop = propPath[0]

                            for (
                                let i = 0;
                                i < propPath.length - 2 && typeof prop === 'string';
                                i++
                            ) {
                                target = target[prop] ??= {}
                                prop = propPath[i + 1]
                            }
                        }

                        value = resolveValue(value)
                    }
                }

                animation[progress] = result
            }

            return animation
        })
    })
})
