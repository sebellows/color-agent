/**********************************************************************
 * Transitions
 **********************************************************************/

import { EasingFunction } from './animation.types'

export type TransitionRule = {
    /** Delay before the transition starts in milliseconds. */
    delay?: number[] // was `de`

    /** Duration of the transition in milliseconds. */
    duration?: number[] // was `du`

    /** Property to transition. */
    properties?: string[] // was `p`

    /** Easing function for the transition. */
    timingFunction?: EasingFunction[] // was `e`
}
