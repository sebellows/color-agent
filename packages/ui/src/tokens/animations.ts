const defaultOptions = {
    timing: 'linear',
    duration: 1000,
    iterations: 1,
    fillMode: 'forwards',
    delay: 0,
}

const baseAnimations = {
    fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
        timing: 'ease-in',
        duration: 500,
    },
    fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 },
        timing: 'ease-out',
        duration: 500,
    },
    slideIn: {
        from: { transform: 'translateY(-100%)' },
        to: { transform: 'translateY(0)' },
        ...defaultOptions,
    },
    slideOut: {
        from: { transform: 'translateY(0)' },
        to: { transform: 'translateY(-100%)' },
        ...defaultOptions,
    },
    scaleIn: {
        from: { transform: 'scale(0.95)' },
        to: { transform: 'scale(1)' },
        ...defaultOptions,
    },
    scaleOut: {
        from: { transform: 'scale(1)' },
        to: { transform: 'scale(0.95)' },
        ...defaultOptions,
    },
    spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
        ...defaultOptions,
    },
    bounce: {
        from: { transform: 'translateY(0)' },
        to: { transform: 'translateY(-20px)' },
        ...defaultOptions,
    },
    pulse: {
        from: { transform: 'scale(1)' },
        to: { transform: 'scale(1.05)' },
        ...defaultOptions,
    },
    shake: {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(-10px)' },
        ...defaultOptions,
    },
    wobble: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(15deg)' },
        ...defaultOptions,
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
