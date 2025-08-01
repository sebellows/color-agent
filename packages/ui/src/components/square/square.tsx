import { createBox, type BoxProps as RestyleBoxProps } from '@shopify/restyle'

import { Theme } from '../../../scripts'

type BoxProps = RestyleBoxProps<Theme>

const Box = createBox<Theme>()

export { Box, type BoxProps }
