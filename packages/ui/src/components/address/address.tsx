import React from 'react'

import { chunk, coarsePercentage, getEntries, isEven, toFlexSize } from '@coloragent/utils'

import { Box, BoxProps } from '../box/box'
import { Text } from '../text/text'

export type AddressBaseProps = {
    // Address is an array of label/value objects where the label represents the type of the
    // address section (e.g., 'street', 'city'), while value is self-explanatory.
    address: Record<string, string>
    labelWidth?: number | string
    columns?: number
}

export type AddressProps = AddressBaseProps & BoxProps

export function Address({ address, labelWidth = 1, columns = 3, ...props }: AddressProps) {
    const addressSections = getEntries(address)
    const columnWidths = React.useMemo(() => {
        if (typeof labelWidth === 'number') {
            const { flexSize, remainder } = toFlexSize(labelWidth, columns)
            return [flexSize, remainder] // Default widths for label and value
        } else {
            const labelSize = coarsePercentage(labelWidth)
            const { flexSize, remainder } = toFlexSize(labelSize, columns)
            return [flexSize, remainder] // Default widths for label and value
        }
    }, [labelWidth])

    return (
        <Box flexDirection="column" {...props}>
            {addressSections.map(([label, value], i) => (
                <Box
                    key={label}
                    flexDirection="row"
                    flexWrap="nowrap"
                    gap="2"
                    backgroundColor={isEven(i) ? 'base.bg-secondary' : 'base.bg-primary'}
                >
                    <Text
                        variant="address"
                        fontWeight="700"
                        color="base.fg-primary"
                        flexBasis={columnWidths[0]}
                    >
                        {label}
                    </Text>
                    <Text
                        variant="address"
                        fontWeight="400"
                        color="base.fg-subtle"
                        flexBasis={columnWidths[1]}
                    >
                        {value}
                    </Text>
                </Box>
            ))}
        </Box>
    )
}
