import React from 'react'
import type { HTMLAttributes } from 'react'
import {
    ActivityIndicator,
    Button,
    GestureResponderHandlers,
    Image,
    ImageStyle,
    Modal,
    Pressable,
    PressableProps,
    ScrollView,
    SectionList,
    Text,
    TextInput,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native'

export interface AsProp<As extends React.ElementType = React.ElementType> {
    as?: As
}

/** Core RN Components */
export type RNImage = typeof Image
export type RNPressable = typeof Pressable
export type RNText = typeof Text
export type RNView = typeof View

/** Extended RN Components (based off of one of the above) */
export type RNActivityIndicator = typeof ActivityIndicator
export type RNButton = typeof Button
export type RNModal = typeof Modal
export type RNScrollView = typeof ScrollView
export type RNSectionList = typeof SectionList
export type RNTextInput = typeof TextInput

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

export type ViewElement = HTMLElement | InstanceType<RNView>
export type TextElement = HTMLElement | InstanceType<RNText>

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
