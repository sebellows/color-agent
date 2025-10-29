import React from 'react'

export type MaskProps = {
    value: string

    /**
     * Placeholder character in mask.
     */
    slotChar?: string | undefined

    /**
     * Toggles between the raw unmasked value to bound value or the formatted mask value.
     */
    unmasked?: boolean | undefined
}

function maskValue(value: string, slotChar: string = '*') {
    const len = value.length
    return new Array(len).fill(slotChar, 0, -1).join('')
}

export const useMask = ({ value: rawValue, slotChar = '*', unmasked }: MaskProps) => {
    const maskedValue = React.useMemo(() => maskValue(rawValue), [rawValue])

    const toggleMaskedValue = () => {
        return unmasked ? rawValue : maskedValue
    }

    return [maskedValue, toggleMaskedValue]
}
