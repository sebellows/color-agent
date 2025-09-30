import {
    Image,
    Insets,
    NativeMethods,
    Pressable,
    Text,
    View,
    ViewStyle,
    type ImageProps,
    type PressableProps,
    type TextProps,
    type ViewProps,
} from 'react-native'

import { AnyRecord } from '@coloragent/utils'
import { Constructor, Get, IsAny } from 'type-fest'

export type RNImage = typeof Image
export type RNView = typeof View
export type RNPressable = typeof Pressable
export type RNText = typeof Text

export type ImageRef = React.ComponentRef<RNImage>
export type ViewRef = React.ComponentRef<RNView>
export type PressableRef = React.ComponentRef<RNPressable>
export type TextRef = React.ComponentRef<RNText>

// type ComponentTypeMap = {
//     Pressable: RNPressable
//     View: RNView
//     Text: RNText
//     Image: RNImage
// }

// export type ComponentType<Key extends keyof ComponentTypeMap> = ComponentTypeMap[Key]

type ComponentDef =
    | {
          type: 'Pressable'
          Component: RNPressable
          Ref: React.Ref<RNPressable>
          Props: PressableProps
      }
    | {
          type: 'View'
          Component: RNView
          Ref: React.Ref<RNView>
          Props: ViewProps
      }
    | {
          type: 'Text'
          Component: RNText
          Ref: React.Ref<RNText> // ComponentType<T>
          Props: TextProps
      }
    | {
          type: 'Image'
          Component: RNImage
          Ref: React.Ref<RNImage>
          Props: ImageProps
      }

export type ComponentTypeName = ComponentDef['type']
type GetComponent<T extends ComponentTypeName> = Extract<ComponentDef, { type: T }>

export type ComponentType<T extends ComponentTypeName> = GetComponent<T>['Component']
export type ComponentRef<T extends ComponentTypeName> = GetComponent<T>['Component']
export type ComponentProps<T extends ComponentTypeName> = GetComponent<T>['Props']

// export type SlotComponentProps<T extends ComponentTypeName> = ComponentProps<T> &

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export type PropsWithRef<T extends ComponentTypeName> = React.PropsWithChildren<
    ComponentProps<T> & {
        ref?: React.Ref<ComponentType<T>>
    }
>

/** @deprecated - Use `SlotProps` */
export type ComponentPropsWithAsChild<T extends ComponentTypeName> = React.ComponentPropsWithoutRef<
    ComponentType<T>
> & {
    asChild?: boolean
    ref?: React.Ref<ComponentType<T>>
}

export type IsOptional<T> =
    IsAny<T> extends true ? true
    : Extract<T, undefined> extends never ? false
    : true

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
    /** Platform: NATIVE ONLY */
    disablePositioningStyle?: boolean
    /** * Platform: WEB ONLY */
    loop?: boolean
    /** * Platform: WEB ONLY */
    onCloseAutoFocus?: (event: Event) => void
    /** * Platform: WEB ONLY */
    onEscapeKeyDown?: (event: KeyboardEvent) => void
    /** * Platform: WEB ONLY */
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
    /** * Platform: WEB ONLY */
    onFocusOutside?: (event: FocusOutsideEvent) => void
    /** * Platform: WEB ONLY */
    onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
    /** * Platform: WEB ONLY */
    collisionBoundary?: Element | null | Array<Element | null>
    /** * Platform: WEB ONLY */
    sticky?: 'partial' | 'always'
    /** * Platform: WEB ONLY */
    hideWhenDetached?: boolean
}

export interface ForceMountable {
    forceMount?: true | undefined
}
