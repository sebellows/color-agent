import { createElement } from 'react'
import { ImageProps, TextProps, ViewProps } from 'react-native'

/**
 * Hyper-optimized React Native internal component references for better performance in large lists.
 *
 * References:
 * - https://reactnative.dev/docs/the-new-architecture/using-codegen#configuring-codegen
 * - https://blog.theodo.com/2023/10/native-views-rn-performance/
 */

export const FastText = ({ ref, ...props }: TextProps & { ref?: React.Component<ImageProps> }) => {
    return createElement('RCTText', { ...props, ref })
}
FastText.displayName = 'FastText'

export const FastView = ({ ref, ...props }: ViewProps & { ref?: React.Component<ViewProps> }) => {
    return createElement('FastView', { ...props, ref })
}
FastView.displayName = 'FastView'

export const FastImage = ({
    ref,
    ...props
}: ImageProps & { ref?: React.Component<ImageProps> }) => {
    return createElement('RCTImage', { ...props, ref })
}
FastImage.displayName = 'FastImage'
