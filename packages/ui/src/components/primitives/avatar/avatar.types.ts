import type { Image } from 'react-native'

import { SizeToken } from '../../../design-system/design-tokens/sizes'
import type { ComponentPropsWithAsChild, SlottableViewProps } from '../types'

type RootProps = SlottableViewProps & {
    alt: string
    size?: SizeToken
}

type ImageProps = Omit<ComponentPropsWithAsChild<typeof Image>, 'alt'> & {
    children?: React.ReactNode
    onLoadingStatusChange?: (status: 'error' | 'loaded') => void
}

type FallbackProps = SlottableViewProps

export type { FallbackProps, ImageProps, RootProps }
