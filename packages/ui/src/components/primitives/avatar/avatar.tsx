import * as React from 'react'
import {
    Image as RNImage,
    View,
    type ImageErrorEvent,
    type ImageLoadEvent,
    type ImageSourcePropType,
} from 'react-native'

import { useIsomorphicLayoutEffect } from '../../../hooks'
import { Slot } from '../slot'
import type { FallbackProps, ImageProps, RootProps } from './avatar.types'

type AvatarState = 'loading' | 'error' | 'loaded'

interface IRootContext extends RootProps {
    status: AvatarState
    setStatus: (status: AvatarState) => void
}

const RootContext = React.createContext<IRootContext | null>(null)

const Root = ({ ref, asChild, alt, ...viewProps }: RootProps) => {
    const [status, setStatus] = React.useState<AvatarState>('error')
    const Component = asChild ? Slot.View : View
    return (
        <RootContext.Provider value={{ alt, status, setStatus }}>
            <Component ref={ref} {...viewProps} />
        </RootContext.Provider>
    )
}

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

    const onLoad = (e: ImageLoadEvent) => {
        setStatus('loaded')
        onLoadingStatusChange?.('loaded')
        onLoadProps?.(e)
    }

    const onError = (e: ImageErrorEvent) => {
        setStatus('error')
        onLoadingStatusChange?.('error')
        onErrorProps?.(e)
    }

    if (status === 'error') return null

    const Component = asChild ? Slot.Image : RNImage

    return <Component ref={ref} alt={alt} onLoad={onLoad} onError={onError} {...props} />
}

Image.displayName = 'AvatarImage'

const Fallback = ({ ref, asChild, ...props }: FallbackProps) => {
    const { alt, status } = useRootContext()

    if (status !== 'error') return null

    const Component = asChild ? Slot.View : View

    return <Component ref={ref} role={'img'} aria-label={alt} {...props} />
}

Fallback.displayName = 'FallbackAvatar'

export { Fallback, Image, Root }

function isValidSource(source?: ImageSourcePropType) {
    if (!source) return false

    // Using require() for the source returns a number
    if (typeof source === 'number') return true

    if (Array.isArray(source)) {
        return source.some(source => !!source.uri)
    }

    return !!source.uri
}
