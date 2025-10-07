import { useLayoutEffect, useState } from 'react'
import { Image, type ImageRequireSource } from 'react-native'

import { type ImageSource } from 'expo-image'

/**
 * NOTE: Advantage over `@react-native-community/hooks` implementation of
 * `useImageDimensions` is this uses `useLayoutEffect` instead of vanilla
 * `useEffect`.
 */
export function useImageDimensions({
    source,
    size,
}: {
    source: ImageSource | ImageRequireSource
    size?: { width: number } | { height: number }
}) {
    let width: number | undefined
    if (size && 'width' in size) {
        width = size.width
    }

    let height: number | undefined
    if (size && 'height' in size) {
        height = size.height
    }

    const [dimensions, setDimensions] = useState<{
        width?: number
        height?: number
    }>({ width, height })

    const src = typeof source === 'object' ? source?.uri : source

    useLayoutEffect(() => {
        if (!width && !height) return

        function calcAspectRatio(w: number, h: number) {
            const aspectRatio = w / h
            setDimensions({
                width: width || aspectRatio * (height as number),
                height: height || (width as number) / aspectRatio,
            })
        }

        if (typeof src === 'string') {
            Image.getSize(src, calcAspectRatio, err => console.log(err))
        } else {
            const asset = Image.resolveAssetSource(src as ImageRequireSource)
            calcAspectRatio(asset.width, asset.height)
        }
    }, [src, width, height])

    return dimensions
}
