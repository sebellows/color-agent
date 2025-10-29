import type { Image } from 'react-native'

import type { ComponentPropsWithAsChild, SlottableViewProps } from '../../../types'

type RootProps = SlottableViewProps & {
    alt: string
}

type ImageProps = Omit<ComponentPropsWithAsChild<typeof Image>, 'alt'> & {
    children?: React.ReactNode
    onLoadingStatusChange?: (status: 'error' | 'loaded') => void
}

type FallbackProps = SlottableViewProps

export type { FallbackProps, ImageProps, RootProps }
