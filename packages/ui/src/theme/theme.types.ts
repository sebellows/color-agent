import { UnistylesThemes, useUnistyles } from 'react-native-unistyles'

import { type TypographyToken } from '../design-system/design-tokens/typography-token'
import { TypographyDefinition } from '../design-system/design-tokens/utils'
import { KeyPathOf } from '../types/common'

type Theme = ReturnType<typeof useUnistyles>['theme']

export type Typography<T extends TypographyToken> = Record<T, TypographyDefinition>
export type Color = KeyPathOf<Theme['colors']> // keyof Theme['colors']
export type Container = KeyPathOf<Theme['containers']>
export type Space = keyof Theme['space']
export type Radii = keyof Theme['radii']
export type Fonts = keyof Theme['fonts']
export type FontWeight = keyof Theme['fontWeights']
export type LineHeight = keyof Theme['lineHeights']
export type Shadow = keyof Theme['shadows']
export type ZIndex = keyof Theme['zIndices']

export type ThemeTokens = { [K in keyof Theme]: KeyPathOf<Theme[K]> }

export type UnistylesTheme = UnistylesThemes[keyof UnistylesThemes]
