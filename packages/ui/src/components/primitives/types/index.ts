import type {
    Pressable as RNPressable,
    Text as RNText,
    View as RNView,
    ViewStyle,
} from 'react-native'

/**************************************************
 * Slot Component Props
 **************************************************/

export type ComponentPropsWithAsChild<T extends React.ElementType> =
    React.ComponentPropsWithRef<T> & { asChild?: boolean }

export type SlottableViewProps = ComponentPropsWithAsChild<typeof RNView>

export type SlottablePressableProps = ComponentPropsWithAsChild<typeof RNPressable> & {
    /** Platform: WEB ONLY */
    onKeyDown?: (event: React.KeyboardEvent) => void
    /** Platform: WEB ONLY */
    onKeyUp?: (event: React.KeyboardEvent) => void
}

export type SlottableTextProps = ComponentPropsWithAsChild<typeof RNText>

/**
 * More narrowed down type descriptor than React Native's `Insets` interface.
 */
export interface Insets {
    top?: number
    bottom?: number
    left?: number
    right?: number
}

export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

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
    /**
     * Platform: WEB ONLY
     */
    loop?: boolean
    /**
     * Platform: WEB ONLY
     */
    onCloseAutoFocus?: (event: Event) => void
    /**
     * Platform: WEB ONLY
     */
    onEscapeKeyDown?: (event: KeyboardEvent) => void
    /**
     * Platform: WEB ONLY
     */
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
    /**
     * Platform: WEB ONLY
     */
    onFocusOutside?: (event: FocusOutsideEvent) => void
    /**
     * Platform: WEB ONLY
     */
    onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
    /**
     * Platform: WEB ONLY
     */
    collisionBoundary?: Element | null | Array<Element | null>
    /**
     * Platform: WEB ONLY
     */
    sticky?: 'partial' | 'always'
    /**
     * Platform: WEB ONLY
     */
    hideWhenDetached?: boolean
}

export interface ForceMountable {
    forceMount?: true | undefined
}
