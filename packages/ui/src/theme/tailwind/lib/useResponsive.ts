import React from 'react'
import { Dimensions } from 'react-native'
import { Breakpoints } from '../types'
import { toBreakpointIterator } from './utils'

export const useResponsive = (_breakpoints: Breakpoints) => {
    const [breakpoint, setBreakpoint] = React.useState<
        [keyof Breakpoints, Breakpoints[keyof Breakpoints]] | undefined
    >(undefined)

    const breakpoints = React.useMemo(() => toBreakpointIterator(_breakpoints), [_breakpoints])

    React.useEffect(() => {
        const subscription = Dimensions.addEventListener('change', newDimensions => {
            // Retrieve and save new dimensions
            const screenWidth = newDimensions.window.width

            let bpItem = breakpoints[0]
            let nextBpItem = bpItem.next()
            // let currentBreakpoint: [string, Dimensions] | undefined

            if (breakpoint) {
                const existing = breakpoints.find(bp => bp.name === breakpoint[0])
                if (existing) {
                    bpItem = existing
                }
            }

            while (nextBpItem !== undefined && screenWidth > bpItem.width) {
                if (screenWidth < nextBpItem.width) {
                    nextBpItem = undefined
                    const bp = _breakpoints[bpItem.name]

                    // Trigger screen's rerender with a state update of the orientation variable
                    setBreakpoint([bpItem.name, bp])
                }
            }
        })

        return () => subscription.remove()
    }, [setBreakpoint])

    return breakpoint
}
