import React from 'react'
import { View } from 'react-native'

import { Slot } from '../slot'
import type { RangeProps, RootProps, ThumbProps, TrackProps } from './slider.types'

const RootContext = React.createContext<RootProps | null>(null)

const Root = ({
    ref,
    asChild,
    value,
    disabled,
    min,
    max,
    dir: _dir,
    inverted: _inverted,
    step: _step,
    onValueChange: _onValueChange,
    ...props
}: RootProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <RootContext.Provider value={{ value, disabled, min, max }}>
            <Component ref={ref} role="group" {...props} />
        </RootContext.Provider>
    )
}

Root.displayName = 'SliderRoot.Native'

function useSliderContext() {
    const context = React.useContext(RootContext)
    if (context === null) {
        throw new Error(
            'Slider compound components cannot be rendered outside the Slider component',
        )
    }
    return context
}

const Track = ({ ref, asChild, ...props }: TrackProps) => {
    const { value, min, max, disabled } = useSliderContext()

    const Component = asChild ? Slot.View : View

    return (
        <Component
            ref={ref}
            aria-disabled={disabled}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            accessibilityValue={{ max, min, now: value }}
            {...props}
        />
    )
}

Track.displayName = 'SliderTrack.Native'

const Range = ({ ref, asChild, ...props }: RangeProps) => {
    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role="presentation" {...props} />
}

Range.displayName = 'SliderRange.Native'

const Thumb = ({ ref, asChild, ...props }: ThumbProps) => {
    const Component = asChild ? Slot.View : View

    return <Component accessibilityRole="adjustable" ref={ref} {...props} />
}

Thumb.displayName = 'SliderThumb.Native'

export { Range, Root, Thumb, Track }
