import { isUndefined, kebabCase } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { Join, Simplify } from 'type-fest'

import { ReduceMotion } from '../../types'
import { isReducedMotionEnabled } from '../../utils'

const animationDirections = ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const
type AnimationDirection = (typeof animationDirections)[number]

const fillModes = ['none', 'forwards', 'backwards', 'both'] as const
type FillMode = (typeof fillModes)[number]

const EASINGS = {
    ease: 'ease',
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const
type Easing = keyof typeof EASINGS
type PresetTimingFunction<K extends Easing = Easing> = (typeof EASINGS)[K]

const iterationCountValues = [
    'infinite',
    'inherit',
    'initial',
    'revert',
    'revert-layer',
    'unset',
] as const
type IterationCountValue = (typeof iterationCountValues)[number]
type IterationCount = number | IterationCountValue

const timingFunctions = [
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear',
    'step-start',
    'start-end',
] as const
type TimingFunction = (typeof timingFunctions)[number]
type SingleTimingFunctionType =
    | Easing
    | TimingFunction
    | `cubic-bezier(${number}, ${number}, ${number}, ${number})`
    | `linear(${number}, ${number}, ${number})`
    | `linear(${number}, ${number}, ${number}, ${number})`
    | `steps(${number}, ${StepValue})`
type TimingFunctionType = SingleTimingFunctionType | Join<SingleTimingFunctionType[], ', '>

const stepValues = ['jump-start', 'jump-end', 'jump-none', 'jump-both', 'start', 'end'] as const
type StepValue = (typeof stepValues)[number]

const globalValues = ['initial', 'inherit', 'revert', 'revert-layer', 'unset'] as const
type GlobalValue = (typeof globalValues)[number]

type TransformVars = {
    scale?: number | GlobalValue
    rotate?: 0 | string | GlobalValue
    translateX?: number | string | GlobalValue
    translateY?: number | string | GlobalValue
    translateZ?: number | string | GlobalValue
}

type Opacity = number | GlobalValue

type AnimationObject = {
    opacity?: Opacity
    transform?: TransformVars
}
type FlattenedAnimationObject = Simplify<Pick<AnimationObject, 'opacity'> & TransformVars>

const toTransformString = (vars: TransformVars) => {
    const { scale = 1, rotate = 0, translateX = 0, translateY = 0, translateZ = 0 } = vars
    return [
        `translate3d(${translateX}, ${translateY}, ${translateZ})`,
        `scale3d(${scale}, ${scale}, ${scale})`,
        `rotate(${rotate})`,
    ].join(', ')
}

type CSSKeyframe = {
    opacity: Opacity
    transform?: string
}

// type CSSKeyframes = {
//     from: CSSKeyframe
//     to: CSSKeyframe
// }

class Keyframe {
    constructor(
        public step: number | string,
        public config: FlattenedAnimationObject,
    ) {}

    toStyleProps() {
        const { opacity = 1, ...transform } = this.config
        const props: CSSKeyframe = { opacity }
        if (!isEmpty(transform)) {
            props.transform = toTransformString(transform)
        }
        return props
    }
}

class Keyframes {
    readonly animationName: string
    readonly keyframes: Keyframe[] = []

    constructor(name: string, from: FlattenedAnimationObject, to: FlattenedAnimationObject) {
        this.animationName = name
        this.keyframes = [new Keyframe('from', from), new Keyframe('to', to)]
    }

    toString() {
        const frames = this.keyframes
            .reduce((acc, kf) => {
                acc.push(`${kf.step} ${JSON.stringify(kf.toStyleProps())}`)
                return acc
            }, [] as string[])
            .join('\n\n')
        return `@keyframes ${this.animationName} {
            ${frames}
        }`
    }
}

type AnimationConfig = {
    animationName: string // reference to keyframe query or object
    animationDuration?: string
    animationDelay?: string
    animationDirection?: AnimationDirection
    animationFillMode?: FillMode
    animationIterationCount?: IterationCount
    animationPlayState?: 'running' | 'paused'
    animationTimingFunction?: TimingFunctionType
    reducedMotion?: boolean
}

type AnimationFunction = (
    delay: number | string | undefined,
    animation: AnimationConfig,
) => AnimationConfig

class AnimationBuilder {
    readonly animationName: string

    protected delayV?: number | string
    protected _delayMs?: number

    get delayMs() {
        return this._delayMs ?? 0
    }

    protected durationV: number | string = 300
    protected directionV?: AnimationDirection
    protected fillModeV?: FillMode
    protected timingV?: TimingFunctionType = 'linear'
    protected reduceMotionV: ReduceMotion = ReduceMotion.System
    protected randomizeDelay = false
    protected callbackV?: (finished: boolean) => void

    /**
     * The initial values from where the animation should start.
     */
    initialValues: FlattenedAnimationObject = {}

    /**
     * The values for where the animation ends up.
     */
    values: FlattenedAnimationObject = {}

    static createInstance: <T extends typeof AnimationBuilder>(this: T) => InstanceType<T>

    build(): {
        initialValues: FlattenedAnimationObject
        animations: FlattenedAnimationObject[]
        callback?: (finished: boolean) => void
    } {
        throw new Error('Unimplemented method in child class.')
    }

    // build(): {
    //     style: { animation: string }
    //     keyframes: CSSKeyframes
    //     callback?: (finished: boolean) => void
    // } {
    //     throw new Error('Unimplemented method in child class.')
    // }

    constructor() {
        this.animationName = kebabCase((this.constructor as any).name)
    }

    getAnimationConfig(): AnimationConfig {
        return {
            animationName: this.animationName,
            animationDuration: this.getDuration(),
            animationDelay: this.getDelay(),
            animationDirection: this.getDirection(),
            animationFillMode: this.getFillMode(),
            animationTimingFunction: this.getEasing(),
            reducedMotion: isReducedMotionEnabled(),
        }
    }

    getDuration(): `${number}ms` | undefined {
        const durationV = this.durationV

        if (!durationV) return

        if (typeof durationV === 'number') {
            const val = durationV < 0 ? 0 : durationV
            return `${val}ms`
        }

        if (durationV.endsWith('ms')) return durationV as `${number}ms`

        const time = parseFloat(durationV)

        if (durationV.endsWith('s')) {
            return `${time * 1000}ms`
        }

        return `${time}ms`
    }

    duration(durationV: number | string | undefined) {
        this.durationV = isUndefined(durationV) ? 0 : durationV
        return this
    }

    getReduceMotion(): ReduceMotion {
        return this.reduceMotionV
    }

    protected resolveDelay(delay: number | string | undefined): `${number}ms` {
        let delayMs = delay == null ? 1000 : 0

        if (typeof delay === 'number') {
            delayMs = delay < 0 ? 0 : delay
        } else if (typeof delay === 'string') {
            delayMs = parseFloat(delay)
            const letters = delay.match(/[a-z]/g) ?? []
            if (letters.join('') === 's') {
                delayMs *= 1000
            }
        }

        if (this.randomizeDelay) {
            delayMs = Math.random() * delayMs
        }

        this._delayMs = delayMs

        return `${delayMs}ms`
    }

    getDelay(): `${number}ms` {
        const delayV = this.delayV
        return this.resolveDelay(delayV)
    }

    delay(delayV: number | string | undefined) {
        this.delayV = delayV
        return this
    }

    getDelayFunction(): AnimationFunction {
        const isDelayProvided = this.randomizeDelay || this.delayV
        return isDelayProvided ?
                (delay, animation) => ({
                    ...animation,
                    animationDelay: this.resolveDelay(delay),
                })
            :   (_, animation) => {
                    animation.reducedMotion = isReducedMotionEnabled()
                    return animation
                }
    }

    reduceMotion(val: ReduceMotion): this {
        this.reduceMotionV = val
        return this
    }

    getFillMode() {
        return this.fillModeV
    }

    fillMode(mode: FillMode | undefined) {
        if (this.fillModeV && fillModes.includes(this.fillModeV)) {
            this.fillModeV = mode
        } else {
            console.warn(`"${mode}" is not a valid option for FillMode.`)
        }
        return this
    }

    getEasing() {
        return this.timingV
    }

    static easing<T extends typeof AnimationBuilder>(this: T, easingFunction: TimingFunctionType) {
        const instance = this.createInstance()
        return instance.easing(easingFunction)
    }

    easing(timingFn: PresetTimingFunction | string | undefined) {
        if (timingFn && timingFn in EASINGS) {
            this.timingV = EASINGS[timingFn]
        } else {
            this.timingV = timingFn
        }
        return this
    }

    getDirection() {
        return this.directionV
    }

    direction(dir: AnimationDirection | undefined) {
        if (dir && animationDirections.includes(dir)) {
            this.directionV = dir
        } else {
            this.directionV = undefined
        }
        return this
    }

    static rotate<T extends typeof AnimationBuilder>(this: T, degree: string) {
        const instance = this.createInstance()
        return instance.rotate(degree)
    }

    rotate(degree: string): this {
        this.values.rotate = degree
        return this
    }

    static scale<T extends typeof AnimationBuilder>(this: T, size: number) {
        const instance = this.createInstance()
        return instance.scale(size)
    }

    scale(size: number): this {
        this.values.scale = size
        return this
    }

    static translateX<T extends typeof AnimationBuilder>(
        this: T,
        amt: number | `${number}px` | `${number}%`,
    ) {
        const instance = this.createInstance()
        return instance.translateX(amt)
    }

    translateX(amt: number | `${number}px` | `${number}%`): this {
        const distance = typeof amt === 'number' ? `${amt}px` : amt
        this.values.translateX = distance
        return this
    }

    static translateY<T extends typeof AnimationBuilder>(
        this: T,
        amt: number | `${number}px` | `${number}%`,
    ) {
        const instance = this.createInstance()
        return instance.translateY(amt)
    }

    translateY(amt: number | `${number}px` | `${number}%`): this {
        const distance = typeof amt === 'number' ? `${amt}px` : amt
        this.values.translateY = distance
        return this
    }

    static translateZ<T extends typeof AnimationBuilder>(
        this: T,
        amt: number | `${number}px` | `${number}%`,
    ) {
        const instance = this.createInstance()
        return instance.translateZ(amt)
    }

    translateZ(amt: number | `${number}px` | `${number}%`): this {
        const distance = typeof amt === 'number' ? `${amt}px` : amt
        this.values.translateZ = distance
        return this
    }

    static withInitialValues<T extends typeof AnimationBuilder>(
        this: T,
        values: FlattenedAnimationObject,
    ) {
        const instance = this.createInstance()
        return instance.withInitialValues(values)
    }

    withInitialValues(values: FlattenedAnimationObject): this {
        this.initialValues = values
        this.values = { ...values }
        return this
    }

    static build<T extends typeof AnimationBuilder>(this: T) {
        const instance = this.createInstance()
        return instance.build()
    }
}

export const useAnimation = <TAnimation extends AnimationBuilder>(animation: TAnimation) => {
    function insertKeyframesRuleScript() {
        const { animationName, initialValues, values } = animation
        return new Keyframes(animationName, initialValues, values).toString()
    }

    function getAnimationStyles() {
        const config = animation.getAnimationConfig()

        if (config?.reducedMotion) {
            return { animation: 'none' }
        }

        const {
            animationName,
            animationDuration,
            animationTimingFunction,
            animationDelay,
            animationIterationCount,
            animationDirection,
            animationFillMode,
            animationPlayState,
        } = config

        /**
         * Sort animation properties into valid shorthand order:
         * animation: [animation-name] [animation-duration] [animation-timing-function] [animation-delay]
         *            [animation-iteration-count] [animation-direction] [animation-fill-mode]
         *            [animation-play-state];
         */
        const animationValue = [
            animationName,
            animationDuration,
            animationTimingFunction,
            animationDelay,
            animationIterationCount,
            animationDirection,
            animationFillMode,
            animationPlayState,
        ]
            .reduce((values, prop) => {
                if (prop != null) {
                    values.push(`${prop}`)
                }
                return values
            }, [] as string[])
            .join(' ')

        return { animation: animationValue }
    }

    return { insertKeyframesRuleScript, getAnimationStyles }
}

class FadeIn extends AnimationBuilder {
    static presetName = 'FadeIn.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeIn() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        // this.withInitialValues({ opacity: 0 })
        return {
            // animate: this.getAnimationStyles(),
            initialValues: { opacity: 0 },
            animations: [{ opacity: 1 }],
            callback,
        }
    }
}

class FadeInRight extends AnimationBuilder {
    static presetName = 'FadeInRight.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeInRight() as InstanceType<T>

        return instance
    }

    build = () => {
        const callback = this.callbackV
        // this.withInitialValues({ opacity: 0, translateX: 25 })
        return {
            initialValues: { opacity: 0, translateX: 25 },
            animations: [{ opacity: 1, translateX: 0 }],
            // style: this.getAnimationStyles(),
            // keyframes: this.setKeyframes({ opacity: 1, translateX: 0 }),
            callback,
        }
    }
}

class FadeInLeft extends AnimationBuilder {
    static presetName = 'FadeInLeft.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeInLeft() as InstanceType<T>

        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 0, translateX: -25 },
            animations: [{ opacity: 1, translateX: 0 }],
        }
    }
}

class FadeInUp extends AnimationBuilder {
    static presetName = 'FadeInUp.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeInUp() as InstanceType<T>

        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 0, translateY: -25 },
            animations: [{ opacity: 1, translateY: 0 }],
        }
    }
}

class FadeInDown extends AnimationBuilder {
    static presetName = 'FadeInDown.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeInDown() as InstanceType<T>

        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 0, translateY: 25 },
            animations: [{ opacity: 1, translateY: 0 }],
        }
    }
}

class FadeOut extends AnimationBuilder {
    static presetName = 'FadeIn.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeOut() as InstanceType<T>

        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 1 },
            animations: [{ opacity: 0 }],
        }
    }
}

class FadeOutRight extends AnimationBuilder {
    static presetName = 'FadeOutRight.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeOutRight() as InstanceType<T>
        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 1, translateX: 0 },
            animations: [{ opacity: 0, translateX: 25 }],
        }
    }
}

class FadeOutLeft extends AnimationBuilder {
    static presetName = 'FadeOutLeft.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeOutLeft() as InstanceType<T>
        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 1, translateX: 0 },
            animations: [{ opacity: 0, translateX: -25 }],
        }
    }
}

class FadeOutUp extends AnimationBuilder {
    static presetName = 'FadeOutUp.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeOutUp() as InstanceType<T>
        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 1, translateY: 0 },
            animations: [{ opacity: 0, translateY: -25 }],
        }
    }
}

class FadeOutDown extends AnimationBuilder {
    static presetName = 'FadeOutDown.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new FadeOutDown() as InstanceType<T>
        return instance
    }

    build = () => {
        return {
            initialValues: { opacity: 1, translateY: 0 },
            animations: [{ opacity: 0, translateY: 25 }],
        }
    }
}

class SlideInRight extends AnimationBuilder {
    static presetName = 'SlideInRight.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideInRight() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateX: '100%' },
            animations: [{ translateX: 0 }],
            callback,
        }
    }
}

class SlideInLeft extends AnimationBuilder {
    static presetName = 'SlideInLeft.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideInLeft() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateX: '-100%' },
            animations: [{ translateX: 0 }],
            callback,
        }
    }
}

class SlideInTop extends AnimationBuilder {
    static presetName = 'SlideInTop.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideInTop() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateY: '-100%' },
            animations: [{ translateY: 0 }],
            callback,
        }
    }
}

class SlideInBottom extends AnimationBuilder {
    static presetName = 'SlideInBottom.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideInBottom() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateY: '100%' },
            animations: [{ translateY: 0 }],
            callback,
        }
    }
}

class SlideOutRight extends AnimationBuilder {
    static presetName = 'SlideOutRight.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideOutRight() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateX: 0 },
            animations: [{ translateX: '100%' }],
            callback,
        }
    }
}

class SlideOutLeft extends AnimationBuilder {
    static presetName = 'SlideOutLeft.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideOutLeft() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateX: 0 },
            animations: [{ translateX: '-100%' }],
            callback,
        }
    }
}

class SlideOutTop extends AnimationBuilder {
    static presetName = 'SlideOutTop.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideOutTop() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateY: 0 },
            animations: [{ translateY: '-100%' }],
            callback,
        }
    }
}

class SlideOutBottom extends AnimationBuilder {
    static presetName = 'SlideOutBottom.Web'

    static createInstance<T extends typeof AnimationBuilder>(this: T): InstanceType<T> {
        const instance = new SlideOutBottom() as InstanceType<T>
        return instance
    }

    build = () => {
        const callback = this.callbackV
        return {
            initialValues: { translateY: 0 },
            animations: [{ translateY: '100%' }],
            callback,
        }
    }
}

export {
    FadeIn,
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp,
    FadeOut,
    FadeOutDown,
    FadeOutLeft,
    FadeOutRight,
    FadeOutUp,
    SlideInBottom,
    SlideInLeft,
    SlideInRight,
    SlideInTop,
    SlideOutBottom,
    SlideOutLeft,
    SlideOutRight,
    SlideOutTop,
}
