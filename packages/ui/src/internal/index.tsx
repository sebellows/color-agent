import { createElement } from 'react'

import { RNImage, RNText, RNView } from '../types/react-native.types'

/**
 * Hyper-optimized React Native internal component references for better performance in large lists.
 *
 * References:
 * - https://reactnative.dev/docs/the-new-architecture/using-codegen#configuring-codegen
 * - https://blog.theodo.com/2023/10/native-views-rn-performance/
 */

export const FastText = ({ ref, ...props }: React.ComponentPropsWithRef<RNText>) => {
    return createElement('RCTText', { ...props, ref })
}
FastText.displayName = 'FastText'

export const FastView = ({ ref, ...props }: React.ComponentPropsWithRef<RNView>) => {
    return createElement('FastView', { ...props, ref })
}
FastView.displayName = 'FastView'

export const FastImage = ({ ref, ...props }: React.ComponentPropsWithRef<RNImage>) => {
    return createElement('RCTImage', { ...props, ref })
}
FastImage.displayName = 'FastImage'
