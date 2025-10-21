import { useCallback, useRef } from 'react'

import { AnyFunction } from '../types'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

/**
 * Keeps a reference to the current value easily
 */
export function useGet<
    Getter extends AnyFunction | undefined,
    Init extends AnyFunction | undefined,
>(currentValue: Getter, initialValue?: Init, forwardToFunction?: boolean): () => Getter {
    const value = useRef(initialValue ?? currentValue)
    useIsomorphicLayoutEffect(() => {
        value.current = currentValue
    })

    return useCallback(
        forwardToFunction ? (...args) => value.current?.apply(null, args) : () => value.current,
        [],
    )
}

export function useEvent<T extends AnyFunction>(callback?: T): T {
    return useGet(callback, defaultValue, true) as T
}

const defaultValue = () => {
    throw new Error('Cannot call an event handler while rendering.')
}
