import React from 'react'

import { getEntries } from '../../../utils/get-entries'

interface AugmentRefProps<T> {
    ref: React.Ref<T> | undefined
    methods?: Record<string, (...args: any[]) => any>
    deps?: any[]
}

export function useAugmentedRef<T>({ ref, methods, deps = [] }: AugmentRefProps<T>) {
    const augmentedRef = React.useRef<T>(null)

    React.useImperativeHandle(
        ref,
        () => {
            if (typeof augmentedRef === 'function' || !augmentedRef?.current) {
                return {} as T
            }

            if (!methods) return augmentedRef.current

            const newProperties = getEntries(methods).reduce(
                (acc, [fnName, fn]) => {
                    acc[fnName] = { value: fn }
                    return acc
                },
                {} as {
                    [K in keyof AugmentRefProps<T>['methods']]: TypedPropertyDescriptor<
                        AugmentRefProps<T>['methods'][K]
                    >
                },
            )

            Object.defineProperties(augmentedRef.current, newProperties)

            return augmentedRef.current
        },
        deps,
    )

    return augmentedRef
}
