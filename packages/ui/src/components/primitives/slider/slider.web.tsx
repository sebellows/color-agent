import { View } from 'react-native'

import { Slider } from 'radix-ui'

import { Slot } from '../slot'
import type { RangeProps, RootProps, ThumbProps, TrackProps } from './slider.types'

const Root = ({
    ref,
    asChild,
    value,
    disabled,
    min,
    max,
    dir,
    inverted,
    step = 1,
    onValueChange,
    ...props
}: RootProps) => {
    const Component = asChild ? Slot.View : View
    return (
        <Slider.Root
            dir={dir}
            inverted={inverted}
            value={[value]}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            onValueChange={onValueChange}
            asChild
        >
            <Component ref={ref} {...props} />
        </Slider.Root>
    )
}

Root.displayName = 'SliderRoot.Web'

const Track = ({ ref, asChild, ...props }: TrackProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Slider.Track asChild>
            <Component ref={ref} {...props} />
        </Slider.Track>
    )
}

Track.displayName = 'SliderTrack.Web'

const Range = ({ ref, asChild, ...props }: RangeProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Slider.Range asChild>
            <Component ref={ref} {...props} />
        </Slider.Range>
    )
}

Range.displayName = 'SliderRange.Web'

const Thumb = ({ ref, asChild, ...props }: ThumbProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Slider.Thumb asChild>
            <Component ref={ref} {...props} />
        </Slider.Thumb>
    )
}

Thumb.displayName = 'SliderThumb.Web'

export { Range, Root, Thumb, Track }
