import { CSSProperties } from 'react'
import { BoxShadowValue, FilterFunction, ImageStyle, TextStyle, ViewStyle } from 'react-native'

import { TransformArrayItem } from 'react-native-reanimated'
import { UnistylesBreakpoints } from 'react-native-unistyles'
import { ValueOf } from 'type-fest'

import { Pseudo } from './pseudo'

type NestedKeys = 'shadowOffset' | 'transform' | 'textShadowOffset' | 'boxShadow' | 'filter'

type ShadowOffset = {
    width: number
    height: number
}

type UnistyleView = Omit<ViewStyle, NestedKeys>
type UnistyleText = Omit<TextStyle, NestedKeys>
type UnistyleImage = Omit<ImageStyle, NestedKeys>

type UnistyleNestedStyles = {
    shadowOffset?: ToDeepUnistyles<ShadowOffset>
    textShadowOffset?: ToDeepUnistyles<ShadowOffset>
    transform?: Array<ToDeepUnistyles<TransformArrayItem>>
    boxShadow?: Array<ToDeepUnistyles<BoxShadowValue>> | string
    filter?: Array<ToDeepUnistyles<FilterFunction>> | string
}

type VariantsObject = {
    [variantName: string]: {
        [variant: string]: Omit<UnistylesValues, 'variants' | 'compoundVariants'>
    }
}

type CustomClassName = {
    _classNames?: string | Array<string>
}

type CompoundVariant = {
    styles: Omit<UnistylesValues, 'variants' | 'compoundVariants'>
}

type VariantsAndCompoundVariants = {
    variants?: VariantsObject
    compoundVariants?: Array<CompoundVariant>
}

type ToDeepUnistyles<T> = {
    [K in keyof T]?:
        | T[K]
        | {
              [key in BreakpointsOrMediaQueries]?: T[K]
          }
}

type AllAvailableStyles = UnistyleView & UnistyleText & UnistyleImage & UnistyleNestedStyles

type AllAvailableKeys = keyof (UnistyleView & UnistyleText & UnistyleImage)

type BreakpointsOrMediaQueries = keyof UnistylesBreakpoints | symbol

type FlatUnistylesValues = {
    [propName in AllAvailableKeys]?:
        | AllAvailableStyles[propName]
        | {
              [key in BreakpointsOrMediaQueries]?: AllAvailableStyles[propName]
          }
}

type UnistylesValues = FlatUnistylesValues & {} & VariantsAndCompoundVariants & {
        [propName in NestedKeys]?: UnistyleNestedStyles[propName]
    } & {
        _web?: ToDeepUnistyles<CSSProperties> &
            CustomClassName & {
                [propName in Pseudo]?: ToDeepUnistyles<CSSProperties>
            }
    }

/**
 * Use of `$` prefix to distinguish from actual Unistyle.
 */
export declare namespace $Unistyle {
    export type View = UnistyleView
    export type Text = UnistyleText
    export type Image = UnistyleImage

    export type Breakpoints = BreakpointsOrMediaQueries

    export type ValueKey = keyof UnistylesValues
    export type Values = UnistylesValues
    export type ValuesFn = (...args: any) => UnistylesValues

    export type NestedKey = NestedKeys
    export type NestedStyles = UnistyleNestedStyles
    export type StyleKey = AllAvailableKeys
    export type Styles = AllAvailableStyles
    export type StyleValueType = ValueOf<AllAvailableStyles>

    export type StyleSheet = {
        [styleName: string]: UnistylesValues | ValuesFn
    }
}
