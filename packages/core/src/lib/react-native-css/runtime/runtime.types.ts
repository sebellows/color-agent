import type { ComponentProps, ComponentType, ReactElement } from 'react'
import type { ColorSchemeName, ImageStyle, TextStyle, ViewStyle } from 'react-native'

import type { makeMutable, SharedValue } from 'react-native-reanimated'
import { UnknownRecord } from 'type-fest'

import type { AnimationInterpolation_V1, AnimationKeyframes_V1 } from '../compiler'
import type { ComponentPropsDotNotation, ReactComponent } from './utils'
import type { DotNotation, ResolveDotPath } from './utils/dot-notation.types'

export type StyledReactElement<
    C extends ReactComponent,
    M extends StyledConfiguration<C>,
> = ReactElement<
    ComponentProps<C> & {
        [K in keyof M as K extends string ?
            M[K] extends undefined | false ? never
            : M[K] extends true | string | object ? K
            : never
        :   never]?: string
    }
>

export type StyledProps<P, M extends StyledConfiguration<any>> = P & {
    [K in keyof M as K extends string ?
        M[K] extends undefined | false ? never
        : M[K] extends true | string | object ? K
        : never
    :   never]?: string
}

export type Styled = <const C extends ReactComponent<any>, const M extends StyledConfiguration<C>>(
    component: C,
    mapping: M & StyledConfiguration<C>,
    options?: StyledOptions,
) => StyledComponent<C, M>

type StyledComponent<
    C extends ReactComponent<any>,
    M extends StyledConfiguration<C>,
> = ComponentType<
    ComponentProps<C> & {
        [K in keyof M as K extends string ?
            M[K] extends undefined | false ? never
            : M[K] extends true | string | object ? K
            : never
        :   never]?: string
    }
>

export type StyledConfiguration<C extends ReactComponent<any>, K extends string = string> = Record<
    K,
    | boolean
    | ComponentPropsDotNotation<C>
    | StyledConfigurationObject<C, ComponentPropsDotNotation<C> | false>
>

type StyledConfigurationObject<
    C extends ReactComponent<any>,
    T extends ComponentPropsDotNotation<C> | false,
> = {
    target: T
    nativeStyleMapping?: T extends false ? NativeStyleMapping<string, ComponentProps<C>>
    :   NativeStyleMapping<ResolveDotPath<T, ComponentProps<C>>, ComponentProps<C>>
}

type NativeStyleMapping<T, S> =
    T extends object ?
        {
            [K in keyof T as K extends string ? K : never]: true | DotNotation<S>
        } & {
            fill?: true | DotNotation<S>
            stroke?: true | DotNotation<S>
        }
    :   Record<string, true | DotNotation<S>>

export type StyledOptions = {
    passThrough?: boolean
}

/**********************************************************************
 * Styles
 **********************************************************************/

export type InlineStyleRecord = UnknownRecord & {
    // Used to differentiate between InlineStyleRecord and StyleRule
    specificity?: never
}

export type InlineStyle =
    | InlineStyleRecord
    | undefined
    | null
    | (UnknownRecord | undefined | null)[]
    | (() => unknown)

/**********************************************************************
 * Animations
 **********************************************************************/

export type Mutable<Value> = ReturnType<typeof makeMutable<Value>>
export type AnimationMutable = Mutable<number>

export interface KeyFramesWithStyles {
    animation: AnimationKeyframes_V1
    baseStyles: Record<string, any>
}

export type SharedValueInterpolation = [SharedValue<number>, AnimationInterpolation_V1[]]

/**********************************************************************
 * Transitions
 **********************************************************************/

export type Transition = [string | string[], Mutable<any>]

/**********************************************************************
 * Misc
 **********************************************************************/

export type Props = Record<string, any> // Record<string, any> | undefined | null
export type Callback = () => void
export type RNStyle = ViewStyle & TextStyle & ImageStyle

/**********************************************************************
 * Globals
 **********************************************************************/

export type ColorScheme = {
    get: () => ColorSchemeName
    set: (value: ColorSchemeName) => void
}
