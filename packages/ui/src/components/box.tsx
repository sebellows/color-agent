import { Insets, View, ViewProps, ViewStyle } from 'react-native'

import { createComponent } from '../lib/create-component'
import { Role } from '../types/a11y'
import { WebOnlyPressEvents } from '../types/component.types'
import { RNOnlyProps, RNStyleProps } from '../types/react-native.types'

/** Type defining style properties only available on the web. */
export type WebOnlyCSSProperties = Omit<React.CSSProperties, keyof RNStyleProps>

export type SharedComponentProps<As extends React.ElementType = React.ElementType> = {
    /** !NOTE: `tag` in Tamagui */
    as?: As

    target?: string

    /**
     * For parity with React's built-in property for applying a value to the `for`
     * attribute on HTML elements like `label`. This is not a property available
     * naturally on React Native components.
     */
    htmlFor?: string

    /**
     * Same as the web id property for setting a uid on an element. React Native components
     * do not have an `id` property, so this will be used as the `id` attribute for React
     * components on the web and for the `testId` in React Native, but will also be used
     * internally as a reference to a component instance.
     */
    id?: string

    /**
     * Equivalent to "name" property on styled() for automatically applying a theme
     */
    name?: string

    /**
     * Equivalent to role="" attribute on web for accessibility
     */
    role?: Role

    /**
     * Used for controlling the order of focus with keyboard or assistive device enavigation
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
     */
    tabIndex?: string | number

    /**
     * Forces the pseudo style state to be on.
     *
     * !NOTE: `forceStyle` in Tamagui
     */
    updateOn?: 'hover' | 'press' | 'focus' | 'focusVisible' | 'focusWithin'

    /**
     * Adds some area outside the typical bounds of the component for touch actions to register.
     * We uses Pressable internally so it supports `number | Insets` rather than just `Insets`
     */
    hitSlop?: number | Insets | null
}

type LooseCombinedObjects<A extends Object, B extends Object> = A | B | (A & B)

type BoxStyle = Omit<ViewStyle, keyof WebOnlyCSSProperties | 'elevation'>

export type BoxNonStyleProps = Omit<
    ViewProps,
    | 'hitSlop' //  we bring our own via Pressable in WebOnlyPressEvents
    | 'pointerEvents'
    | 'display'
    | 'children'
    | keyof SharedComponentProps
    // these are added back in by core
    | RNOnlyProps
    | 'style'
> &
    WebOnlyPressEvents & {
        // we allow either RN or web style props, of course only web css props only works on web
        style?: LooseCombinedObjects<React.CSSProperties, ViewStyle>
    }

export type BoxProps = BoxNonStyleProps & BoxStyle

export const Box = createComponent<BoxProps>(View, {
    name: 'Box',
})
