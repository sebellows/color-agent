import * as React from 'react'
import { View } from 'react-native'

import { Progress } from 'radix-ui'

import { Slot } from '../slot'
import type { IndicatorProps, RootProps } from './progress.types'

const ProgressContext = React.createContext<RootProps | null>(null)

const Root = ({ ref, asChild, value, max, getValueLabel, ...props }: RootProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <ProgressContext.Provider value={{ value, max }}>
            <Progress.Root value={value} max={max} getValueLabel={getValueLabel} asChild>
                <Component ref={ref} {...props} />
            </Progress.Root>
        </ProgressContext.Provider>
    )
}

Root.displayName = 'ProgressRoot'

const Indicator = ({ ref, asChild, ...props }: IndicatorProps) => {
    const Component = asChild ? Slot.View : View

    return (
        <Progress.Indicator asChild>
            <Component ref={ref} {...props} />
        </Progress.Indicator>
    )
}

Indicator.displayName = 'ProgressIndicator'

export { Indicator, Root }
