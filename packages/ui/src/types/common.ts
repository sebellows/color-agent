// import { AriaRole } from 'react'
// import { Role } from 'react-native'
// import { ArrayValues, KeysOfUnion, UnionToTuple } from 'type-fest'

import { LiteralUnion, Paths } from 'type-fest'
import { ToString } from 'type-fest/source/internal'

export type AnyRecord = Record<string, any>
export type AnyFunction = (...args: any[]) => any

export enum PlatformEnv {
    'mobile' = 'mobile',
    'web' = 'web',
}

export type Direction = 'top' | 'right' | 'bottom' | 'left'

export type KeyPathOf<T extends AnyRecord> = LiteralUnion<
    ToString<
        | Paths<T, { bracketNotation: false; maxRecursionDepth: 2 }>
        | Paths<T, { bracketNotation: true; maxRecursionDepth: 2 }>
    >,
    string
>

export type ActionState = 'default' | 'hover' | 'pressed' | 'disabled' | 'selected' | 'focused'
export type ComponentAttrState =
    | 'background'
    | 'border'
    | 'icon'
    | 'input'
    | 'overlay'
    | 'shadow'
    | 'text'

/**
 * Not exported in @types/react, but used internally.
 *
 * Used to represent DOM API's where users can either pass true or false as a boolean
 * or as its equivalent strings.
 */
export type Booleanish = boolean | 'true' | 'false'

const commonRoleNames = [
    'alert',
    'alertdialog',
    'application',
    'article',
    'banner',
    'button',
    'cell',
    'checkbox',
    'columnheader',
    'combobox',
    'complementary',
    'contentinfo',
    'definition',
    'dialog',
    'directory',
    'document',
    'feed',
    'figure',
    'form',
    'grid',
    'group',
    'heading',
    'img',
    'link',
    'list',
    'listitem',
    'log',
    'main',
    'marquee',
    'math',
    'menu',
    'menubar',
    'menuitem',
    'navigation',
    'none',
    'note',
    'option',
    'presentation',
    'progressbar',
    'radio',
    'radiogroup',
    'region',
    'row',
    'rowgroup',
    'rowheader',
    'scrollbar',
    'searchbox',
    'separator',
    'slider',
    'spinbutton',
    'status',
    'tab',
    'table',
    'tablist',
    'tabpanel',
    'term',
    'timer',
    'toolbar',
    'tooltip',
    'tree',
    'treegrid',
    'treeitem',
] as const

type CommonRoleName = (typeof commonRoleNames)[number]

/**
 * Defines the common accessibility properties that can be applied to
 * both web and React Native components. Basically, this is an intersection
 * of the 'AriaAttributes' interface from React and the 'AccessibilityProps'
 * interface from React Native.
 */
export interface CommonAccessibilityProps<TRole extends CommonRoleName> {
    /**
     * The following properties ('-busy', '-checked', '-disabled', '-expanded', '-selected')
     * indicate the current state of an element (if that state applies to that element).
     *
     * In React Native, these `aria-*` attributes are aliased to properties
     * defined on the 'AccessibilityState' interface, and in its context,
     * they are relayed to users of assistive technology.
     *
     * @see {@link https://reactnative.dev/docs/accessibility#accessibilitystate}
     */

    /** Indicates whether an element is currently busy or not. */
    'aria-busy': Booleanish | undefined

    /**
     * Indicates the state of a checkable element. This field can either take a boolean
     * or the "mixed" string to represent mixed checkboxes.
     */
    'aria-checked': Booleanish | 'mixed' | undefined

    /** Indicates whether the element is disabled or not. */
    'aria-disabled': Booleanish | undefined

    /** Indicates whether an expandable element is currently expanded or collapsed. */
    'aria-expanded': Booleanish | undefined

    /** Indicates whether a selectable element is currently selected or not. */
    'aria-selected': Booleanish | undefined

    /**
     * Indicates whether the accessibility elements contained within this accessibility
     * element are hidden.
     */
    'aria-hidden': Booleanish | undefined

    /**
     * Defines a string value that labels an interactive element.
     */
    'aria-label': string | undefined

    /**
     * Identifies the element that labels the element it is applied to.
     *
     * In React Native, the value of `aria-labelledby` should match the 'nativeID' of the related element.
     *
     * NOTE: Android ONLY (See https://reactnative.dev/docs/accessibility#aria-labelledby-android)
     */
    'aria-labelledby': string | undefined

    /**
     * Indicates that an element will be updated and describes the types of updates the user agents,
     * assistive technologies, and user can expect from the live region.
     *
     * NOTE: Android ONLY (See https://reactnative.dev/docs/accessibility#aria-live-android)
     */
    'aria-live': 'assertive' | 'off' | 'polite' | undefined

    /**
     * Boolean value indicating whether VoiceOver should ignore the elements within views that are
     * siblings of the receiver.
     *
     * NOTE: iOS ONLY (See https://reactnative.dev/docs/accessibility#aria-modal-ios)
     */
    'aria-modal': Booleanish | undefined

    /**
     * The following properties indicate the value of a component.
     * In React Native these are defined on the 'AccessibilityValue' interface.
     */

    /** Defines the maximum allowed value for a range widget. */
    'aria-valuemax': number | undefined

    /** Defines the minimum allowed value for a range widget. */
    'aria-valuemin': number | undefined

    /** Defines the current value for a range widget. (See `aria-valuetext`) */
    'aria-valuenow': number | undefined

    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    'aria-valuetext': string | undefined

    /**
     * Communicates the purpose of a component.
     *
     * NOTE:
     * - React and React Native both define the type for 'role' using a Union type of
     *   possible role names, ('AriaRole' and 'Role', respectively). They are almost identical,
     *   but there's enough variation to warrant using a generic type here. 'AriaRole' defines
     *   7 names not defined in 'Role', which has one not present in the former. The outliers are:
     *       - 'AriaRole': 'gridcell', 'listbox', 'menuitemcheckbox', 'menuitemradio', 'search',
     *             'switch', & 'textbox'
     *       - 'Role': 'summary'
     * - In React Native, 'role' has precedence over the 'accessibilityRole' prop.
     *   See https://reactnative.dev/docs/accessibility#role
     *
     * LINKS:
     * - [AriaRole](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts#L2619)
     * - [Role]:(https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/View/ViewAccessibility.d.ts#L354)
     */
    role?: TRole
}

export interface CommonEventProps {
    target: string
}
