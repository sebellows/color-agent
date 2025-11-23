// import { get as _get } from 'es-toolkit/compat'
// import { Easing, withDelay, withTiming } from 'react-native-reanimated'

// import { dict, Item, list } from '../../utils/typed-objects'

// const animationIntervals = [0, 75, 100, 150, 200, 250, 300, 500, 700, 1000] as const
// const animationDirections = ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const
// const timingFunctions = {
//     easeLinear: 'normal',
//     easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
//     easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
//     easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
// } as const
// const opacities = [
//     0, 0.05, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 0.95, 1,
// ] as const
// const degrees = {
//     default: '30deg',
//     0: '0deg',
//     1: '1deg',
//     2: '2deg',
//     3: '3deg',
//     6: '6deg',
//     12: '12deg',
//     45: '45deg',
//     90: '90deg',
//     180: '180deg',
// }
// const scales = [0, 0.5, 0.8, 0.9, 0.95, 1, 1.05, 1.1, 1.25, 1.5] as const
// const distanceInPoints = [
//     0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 112, 128, 144,
//     160, 176, 192, 208, 224, 240, 256, 272, 288, 304,
// ] as const
// const distanceInPercentages = {
//     half: '50%',
//     third: '33.333333%',
//     twoThirds: '66.666667%',
//     quarter: '25%',
//     threeQuarters: '75%',
//     full: '100%',
// } as const

// type AnimationSettings = {
//     delay?: Item<typeof animationIntervals>
//     duration?: Item<typeof animationIntervals>
//     direction?: Item<typeof animationDirections>
//     timing?: keyof typeof timingFunctions
//     opacity?: Item<typeof opacities>
//     rotate?: keyof typeof degrees
//     scale?: Item<typeof scales>
//     distance?: Item<typeof distanceInPoints> | keyof typeof distanceInPercentages
// }

// export const ANIMATION_SETTINGS = {
//     delays: list(animationIntervals),
//     duration: list(animationIntervals),
//     direction: list(animationDirections),
//     timing: dict(timingFunctions),
//     opacity: list(opacities),
//     rotate: dict(degrees),
//     scale: list(scales),
//     distance: {
//         points: list(distanceInPoints),
//         percentages: dict(distanceInPercentages),
//     },
// }

// export const FadeIn =
//     ({
//         scale = 0.8,
//         opacity = 1,
//         duration = 200,
//         delay = 0,
//     }: Pick<AnimationSettings, 'scale' | 'opacity' | 'duration' | 'delay'> = {}) =>
//     () => {
//         'worklet'

//         const initialValues = {
//             opacity: 0,
//             transform: [{ scale }],
//         }

//         const animations = {
//             opacity: withDelay(
//                 delay,
//                 withTiming(opacity, {
//                     duration,
//                     easing: Easing.out(Easing.ease),
//                 }),
//             ),
//             transform: [
//                 {
//                     scale: withDelay(
//                         delay,
//                         withTiming(1, {
//                             duration,
//                             easing: Easing.out(Easing.ease),
//                         }),
//                     ),
//                 },
//             ],
//         }

//         return {
//             initialValues,
//             animations,
//         }
//     }

// export const FadeOut =
//     ({
//         scale = 0.8,
//         opacity = 0,
//         duration = 200,
//         delay = 0,
//     }: Pick<AnimationSettings, 'scale' | 'opacity' | 'duration' | 'delay'> = {}) =>
//     () => {
//         'worklet'

//         const initialValues = {
//             opacity: 1,
//             transform: [{ scale: 1 }],
//         }

//         const animations = {
//             opacity: withDelay(
//                 delay,
//                 withTiming(opacity, {
//                     duration,
//                     easing: Easing.out(Easing.ease),
//                 }),
//             ),
//             transform: [
//                 {
//                     scale: withDelay(
//                         delay,
//                         withTiming(scale, {
//                             duration,
//                             easing: Easing.out(Easing.ease),
//                         }),
//                     ),
//                 },
//             ],
//         }

//         return {
//             initialValues,
//             animations,
//         }
//     }

export const transitions = {
    easeInOut: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
}
