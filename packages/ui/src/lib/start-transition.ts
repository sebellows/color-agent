import { startTransition as reactStartTransition } from 'react'

import { isWeb } from '../utils/common'

export const startTransition = (callback: React.TransitionFunction): void => {
    if (isWeb) {
        // Pass-through function
        callback()
    } else {
        // Proxy to react.startTransition
        reactStartTransition(callback)
    }
}
