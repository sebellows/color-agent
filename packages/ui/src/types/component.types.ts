import { HTMLAttributes } from 'react'
import {
    GestureResponderHandlers,
    Image,
    ImageStyle,
    Pressable,
    PressableProps,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native'

export interface AsProp<As extends React.ElementType = React.ElementType> {
    as?: As
}

export type RNImage = typeof Image
export type RNView = typeof View
export type RNPressable = typeof Pressable
export type RNText = typeof Text

export type RNStyleProps = ViewStyle | TextStyle | ImageStyle

export type RNOnlyProps =
    | keyof GestureResponderHandlers
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

export type ViewElement = HTMLElement | RNView
export type TextElement = HTMLElement | RNText

type DivAttributes = HTMLAttributes<HTMLDivElement>

export type WebOnlyPressEvents = Pick<
    PressableProps,
    'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut'
> &
    Pick<
        DivAttributes,
        'onBlur' | 'onFocus' | 'onMouseEnter' | 'onMouseLeave' | 'onMouseDown' | 'onMouseUp'
    > & {
        onHoverIn?: DivAttributes['onMouseEnter']
        onHoverOut?: DivAttributes['onMouseLeave']
    }

// type ComponentDef =
//     | {
//           type: 'Pressable'
//           Component: RNPressable
//           Ref: React.Ref<RNPressable>
//           Props: PressableProps
//       }
//     | {
//           type: 'View'
//           Component: RNView
//           Ref: React.Ref<RNView>
//           Props: ViewProps
//       }
//     | {
//           type: 'Text'
//           Component: RNText
//           Ref: React.Ref<RNText> // ComponentType<T>
//           Props: TextProps
//       }
//     | {
//           type: 'Image'
//           Component: RNImage
//           Ref: React.Ref<RNImage>
//           Props: ImageProps
//       }

// type RCTComponentDef =
//     | {
//           type: 'RCTText'
//           Component: RNText
//           Ref: React.Ref<RNText> // ComponentType<T>
//           Props: TextProps
//       }
//     | {
//           type: 'RCTImage'
//           Component: RNImage
//           Ref: React.Ref<RNImage>
//           Props: ImageProps
//       }
