import React from 'react'
import {
    ImageErrorEvent,
    ImageLoadEvent,
    ImageSourcePropType,
    Image as RNImage,
    View,
} from 'react-native'

import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { ComponentRef } from '../../types/component.types'
import { ImageSlotProps, Slot, ViewSlotProps } from '../slot'

type RootRef = ComponentRef<'View'>

type RootProps = ViewSlotProps & {
    alt: string
}

type ImageProps = Omit<ImageSlotProps, 'alt'> & {
    onLoadingStatusChange?: (status: 'error' | 'loaded') => void
}

type FallbackProps = ViewSlotProps

type AvatarState = 'loading' | 'error' | 'loaded'

interface IRootContext extends RootProps {
    status: AvatarState
    setStatus: (status: AvatarState) => void
}

const RootContext = React.createContext<IRootContext | null>(null)

const Root = React.forwardRef<RootRef, RootProps>(({ asChild, alt, ...viewProps }, ref) => {
    const [status, setStatus] = React.useState<AvatarState>('error')
    const Component = asChild ? Slot.View : View
    return (
        <RootContext.Provider value={{ alt, status, setStatus }}>
            <Component ref={ref} {...viewProps} />
        </RootContext.Provider>
    )
})

Root.displayName = 'RootAvatar'

function useRootContext() {
    const context = React.useContext(RootContext)
    if (!context) {
        throw new Error(
            'Avatar compound components cannot be rendered outside the Avatar component',
        )
    }
    return context
}
// React.forwardRef<ComponentRef<'Image'>, ImageProps>
const Image = ({
    ref,
    asChild,
    onLoad: onLoadProps,
    onError: onErrorProps,
    onLoadingStatusChange,
    ...props
}: ImageProps) => {
    const { alt, setStatus, status } = useRootContext()

    useIsomorphicLayoutEffect(() => {
        if (isValidSource(props?.source)) {
            setStatus('loading')
        }

        return () => {
            setStatus('error')
        }
    }, [props?.source])

    const onLoad = React.useCallback(
        (e: ImageLoadEvent) => {
            setStatus('loaded')
            onLoadingStatusChange?.('loaded')
            onLoadProps?.(e)
        },
        [onLoadProps],
    )

    const onError = React.useCallback(
        (e: ImageErrorEvent) => {
            setStatus('error')
            onLoadingStatusChange?.('error')
            onErrorProps?.(e)
        },
        [onErrorProps],
    )

    if (status === 'error') {
        return null
    }

    const Component = asChild ? Slot.Image : RNImage
    return <Component ref={ref} alt={alt} onLoad={onLoad} onError={onError} {...props} />
}

Image.displayName = 'ImageAvatar'

const Fallback = ({ ref, asChild, ...props }: FallbackProps) => {
    const { alt, status } = useRootContext()

    if (status !== 'error') {
        return null
    }
    const Component = asChild ? Slot.View : View
    return <Component ref={ref} role={'img'} aria-label={alt} {...props} />
}

Fallback.displayName = 'FallbackAvatar'

export { Fallback, Image, Root }

function isValidSource(source?: ImageSourcePropType) {
    if (!source) {
        return false
    }
    // Using require() for the source returns a number
    if (typeof source === 'number') {
        return true
    }
    if (Array.isArray(source)) {
        return source.some(source => !!source.uri)
    }
    return !!source.uri
}
