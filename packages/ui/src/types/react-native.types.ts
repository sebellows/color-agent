import { GestureResponderHandlers, ImageStyle, TextStyle, ViewStyle } from 'react-native'

type GestureResponderHandlersKey = keyof GestureResponderHandlers

export type RNOnlyProps =
    | GestureResponderHandlersKey
    | 'onStartShouldSetResponder'
    | 'dataSet'
    | 'onScrollShouldSetResponder'
    | 'onScrollShouldSetResponderCapture'
    | 'onSelectionChangeShouldSetResponder'
    | 'onSelectionChangeShouldSetResponderCapture'
    | 'onLayout'
    | 'href'
    | 'hrefAttrs'
    | 'elevationAndroid'
    | 'rel'
    | 'download'
    | 'dir'
    | 'focusable'

export type RNStyleProps = ViewStyle | TextStyle | ImageStyle
