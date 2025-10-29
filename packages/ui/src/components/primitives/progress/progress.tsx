import { View } from 'react-native'

import { Slot } from '../slot'
import type { IndicatorProps, RootProps } from './progress.types'

// This project uses code from WorkOS/Radix Primitives.
// The code is licensed under the MIT License.
// https://github.com/radix-ui/primitives/tree/main

const DEFAULT_MAX = 100

const Root = ({
    ref,
    asChild,
    value: valueProp,
    max: maxProp,
    getValueLabel = defaultGetValueLabel,
    ...props
}: RootProps) => {
    const max = maxProp ?? DEFAULT_MAX
    const value = isValidValueNumber(valueProp, max) ? valueProp : 0

    const Component = asChild ? Slot.View : View
    return (
        <Component
            role="progressbar"
            ref={ref}
            aria-valuemax={max}
            aria-valuemin={0}
            aria-valuenow={value}
            aria-valuetext={getValueLabel(value, max)}
            accessibilityValue={{
                min: 0,
                max,
                now: value,
                text: getValueLabel(value, max),
            }}
            {...props}
        />
    )
}

Root.displayName = 'ProgressRoot'

const Indicator = ({ ref, asChild, ...props }: IndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role="presentation" {...props} />
}

Indicator.displayName = 'ProgressIndicator'

export { Indicator, Root }

function defaultGetValueLabel(value: number, max: number) {
    return `${Math.round((value / max) * 100)}%`
}

function isValidValueNumber(value: any, max: number): value is number {
    return typeof value === 'number' && !isNaN(value) && value <= max && value >= 0
}
