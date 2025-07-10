import { Box, type BoxProps } from '../box/box'
import { Theme } from '@ui/theme'
import { DimensionValue } from 'react-native'

type SquareProps = BoxProps & {
    size?: number | string
}

export const Square = ({ size = 100, ...rest }: SquareProps) => {
    return (
        <Box
            {...rest}
            style={{
                width: size,
                height: size,
            }}
        />
    )
}
