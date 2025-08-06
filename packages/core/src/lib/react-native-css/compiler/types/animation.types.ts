/**********************************************************************
 * Animations V1
 **********************************************************************/

import { AnimationDirection, AnimationFillMode } from 'lightningcss'

import { StyleDeclaration } from '../types'
import { StyleDescriptor, StyleFunction } from './style-functions'

/**
 * An animation with a fallback style value
 */
export type AnimationWithDefault_V1 = [AnimationRule_V1] | [AnimationRule_V1, StyleFunction]

/**
 * A CSS Animation rule
 */
export interface AnimationRule_V1 {
    /** The animation delay. */
    delay?: number[] // was `de`

    /** The direction of the animation. */
    direction?: AnimationDirection[] // was `di`

    /** The animation duration. */
    duration?: number[] // was `du`

    /** The animation fill mode. */
    fill?: AnimationFillMode[] // was `f`

    /** The number of times the animation will run. */
    iteration?: number[] // was `i`

    /** The animation name. */
    name?: string[] // was `n`

    /** The current play state of the animation. */
    playState?: AnimationPlayState[] // was `p`

    /** The animation timeline. */
    timeline?: never[] // was `t`

    /** The easing function for the animation. */
    timingFunction?: EasingFunction[] // was `e`
}

export type AnimationKeyframes_V1 =
    | [AnimationInterpolation_V1[]]
    | [AnimationInterpolation_V1[], AnimationEasing[]]

export type AnimationEasing = number | [number, EasingFunction]

export type AnimationInterpolation_V1 =
    | [string, number[], StyleDescriptor[]]
    | [string, number[], StyleDescriptor[], number]
    | [string, number[], StyleDescriptor[], number, AnimationInterpolationType]

export type AnimationInterpolationType = 'color' | '%' | undefined

export type EasingFunction =
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | {
          type: 'cubic-bezier'
          /** The x-position of the first point in the curve. */
          x1: number
          /** The x-position of the second point in the curve. */
          x2: number
          /** The y-position of the first point in the curve. */
          y1: number
          /** The y-position of the second point in the curve. */
          y2: number
      }
    | {
          type: 'steps'

          /** The number of intervals in the function. */
          count: number // was `c`

          /** The step position. */
          position?: 'start' | 'end' | 'jump-none' | 'jump-both' // was `p`
      }

/**********************************************************************
 * Animations V2
 **********************************************************************/

/**
 * Example:
 * ```ts
 * const animation: AnimationRecord_V2 = {
 *   fadeIn: {
 *       '0': { opacity: 0 }, // value is StaticStyleObj
 *       '100': { opacity: 1 },
 *   ],
 *   spin: ['rotate', { '0': 0, '100': 360 }, 1],
 * }
 * ```
 */
export type AnimationRecord_V2 = Record<string, AnimationKeyframesRecord_V2>
export type AnimationKeyframesRecord_V2 = Record<string | number, StyleDeclaration[]>

export type Animation_V2 = [string, AnimationKeyframes_V2[]]
export type AnimationKeyframes_V2 = [string | number, StyleDeclaration[]]
