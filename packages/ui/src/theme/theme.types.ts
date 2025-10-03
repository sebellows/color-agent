import { UnistylesThemes, useUnistyles } from 'react-native-unistyles'

import { KeyPathOf } from '../types'
import { TypographyDefinition, TypographyToken } from './design-tokens'

type Theme = ReturnType<typeof useUnistyles>['theme']

export type Typography<T extends TypographyToken> = Record<T, TypographyDefinition>
export type Color = KeyPathOf<Theme['colors']> // keyof Theme['colors']
export type Space = keyof Theme['space']
export type Radii = keyof Theme['radii']
export type Fonts = keyof Theme['fonts']
export type FontWeight = keyof Theme['fontWeights']
export type LineHeight = keyof Theme['lineHeights']
export type Shadow = keyof Theme['shadows']
export type ZIndex = keyof Theme['zIndices']

export type UnistylesTheme = UnistylesThemes[keyof UnistylesThemes]
