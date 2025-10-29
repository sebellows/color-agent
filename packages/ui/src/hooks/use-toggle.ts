import React from 'react'

import { isRef } from '@ui/utils/react.utils'

type ToggleableValue = string | string[] | undefined

export const useToggle = <V extends ToggleableValue>(externalRef?: V | React.RefObject<V>) => {
    const selected = React.useRef<V>(undefined)

    React.useEffect(() => {
        if (externalRef === undefined) return

        const extValue = (isRef<V>(externalRef) ? externalRef.current : externalRef) as V

        selected.current = extValue
    }, [])

    function isSelected(itemValue: string) {
        if (selected.current === undefined) return false

        if (typeof selected.current === 'string') {
            return selected.current === itemValue
        }

        return selected.current.includes(itemValue)
    }

    /**
     * Returns an updated value only if it is not the same as the previous one.
     */
    function updateSingleValue(itemValue: string) {
        return selected.current === itemValue ? undefined : itemValue
    }

    /**
     * Add a new value an array of multiple values.
     */
    function updateMultipleValues(itemValue: string) {
        if (selected.current === undefined) return [itemValue]

        if (typeof selected.current === 'string') {
            return selected.current === itemValue ? [] : [selected.current, itemValue]
        }

        if (!Array.isArray(selected.current)) {
            throw new Error(
                `This literally will never happen, but TypeScript does not approve of this unholy union.`,
            )
        }

        if (selected.current.includes(itemValue)) {
            return selected.current.filter(v => v !== itemValue)
        }

        const updatedValues = [...selected.current, itemValue] as V

        selected.current = updatedValues

        return updatedValues
    }

    function updateSelected(itemValue: string) {
        if (Array.isArray(selected.current)) {
            return updateMultipleValues(itemValue)
        }

        return updateSingleValue(itemValue)
    }

    return {
        selected,
        isSelected,
        updateSelected,
    }
}
