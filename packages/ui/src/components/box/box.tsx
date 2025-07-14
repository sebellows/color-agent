import Reanimated from 'react-native-reanimated'
import { createBox, type BoxProps as RestyleBoxProps } from '@shopify/restyle'

import { Theme } from '../../../scripts'

type BoxProps = RestyleBoxProps<Theme>

const Box = createBox<Theme>()

const AnimatedBox = Reanimated.createAnimatedComponent(Box)

export { AnimatedBox, Box, type BoxProps }
