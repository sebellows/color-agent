import {
    BounceIn,
    BounceOut,
    Easing,
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutUp,
    StretchInX,
    StretchOutY,
} from 'react-native-reanimated'

const defaultOptions = {
    timing: 'linear',
    duration: 1000,
    iterations: 1,
    fillMode: 'forwards',
    delay: 0,
}

const baseAnimations = {
    fade: {
        from: FadeIn.duration(300).easing(Easing.ease),
        to: FadeOut.duration(300).easing(Easing.quad),
    },
    slide: {
        from: SlideInDown.duration(300).easing(Easing.linear),
        to: SlideOutUp.duration(500).easing(Easing.linear),
    },
    scale: {
        from: StretchInX.duration(300).easing(Easing.ease),
        to: StretchOutY.duration(400).easing(Easing.quad),
    },
    bounce: {
        from: BounceIn.duration(500).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
        to: BounceOut.duration(500).easing(Easing.bezier(0.25, 0.1, 0.25, 1)),
    },
    pulse: {
        from: BounceIn.duration(300).easing(Easing.elastic(3.8)),
        to: BounceOut.duration(500).easing(Easing.elastic(4.0)),
    },
}

export function animate(
    animationName: keyof typeof baseAnimations,
    options: {
        from?: Record<string, any>
        to?: Record<string, any>
        timing?: string // 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier', etc.
        duration?: number
        delay?: number
        iterations?: number
        fillMode?: 'forwards' | 'backwards' | 'both' | 'none'
    } = {},
) {
    const { from: baseFrom, to: baseTo, ...rest } = baseAnimations[animationName]
    const { from: optionsFrom = {}, to: optionsTo = {}, ...optionsRest } = options
    const _options = {
        from: { ...baseFrom, ...optionsFrom },
        to: { ...baseTo, ...optionsTo },
        ...defaultOptions,
        ...optionsRest,
    }

    const { from, to, ...animationOptions } = _options

    // Web: `element.animate([from, to], animationOptions)`
    return {
        keyframes: [from, to],
        options: animationOptions,
    }
}
