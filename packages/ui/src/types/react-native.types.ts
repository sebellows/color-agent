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

/**************************************************
 * Slot Component Props
 **************************************************/

export type ComponentPropsWithAsChild<T extends React.ElementType> =
    React.ComponentPropsWithRef<T> & { asChild?: boolean }

export type SlottableViewProps = ComponentPropsWithAsChild<RNView>

export type SlottablePressableProps = ComponentPropsWithAsChild<RNPressable> & {
    /** Platform: WEB ONLY */
    onKeyDown?: (ev: React.KeyboardEvent) => void
    /** Platform: WEB ONLY */
    onKeyUp?: (ev: React.KeyboardEvent) => void
}

export type SlottableTextProps = ComponentPropsWithAsChild<RNText>

/**
 * More narrowed down type descriptor than React Native's `Insets` interface.
 */
export interface Insets {
    top?: number
    bottom?: number
    left?: number
    right?: number
}

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

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

/**
 * Certain props are only available on the native version of the component.
 * @docs For the web version, see the Radix documentation https://www.radix-ui.com/primitives
 */
export interface PositionedContentProps {
    forceMount?: true | undefined
    style?: ViewStyle
    alignOffset?: number
    insets?: Insets
    avoidCollisions?: boolean
    align?: 'start' | 'center' | 'end'
    side?: 'top' | 'bottom'
    sideOffset?: number
    /**
     * Platform: NATIVE ONLY
     */
    disablePositioningStyle?: boolean
    /** Platform: WEB ONLY */
    loop?: boolean
    /** Platform: WEB ONLY */
    onCloseAutoFocus?: (event: Event) => void
    /** Platform: WEB ONLY */
    onEscapeKeyDown?: (event: KeyboardEvent) => void
    /** Platform: WEB ONLY */
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
    /** Platform: WEB ONLY */
    onFocusOutside?: (event: FocusOutsideEvent) => void
    /** Platform: WEB ONLY */
    onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
    /** Platform: WEB ONLY */
    collisionBoundary?: Element | null | Array<Element | null>
    /** Platform: WEB ONLY */
    sticky?: 'partial' | 'always'
    /** Platform: WEB ONLY */
    hideWhenDetached?: boolean
}

export interface ForceMountable {
    forceMount?: true | undefined
}
