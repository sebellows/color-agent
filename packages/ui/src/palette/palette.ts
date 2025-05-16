import { default as colors } from './oklch'

type ValueOf<T, K extends keyof T = keyof T> = T[K]
type ArrayIndices<Element extends readonly unknown[]> = Exclude<
    Partial<Element>['length'],
    Element['length']
>
type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]]
type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>

const steps = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000] as const

type Steps = typeof steps
type StepIndex = ArrayIndices<Steps>
type Colors = typeof colors
type ColorName = keyof typeof colors
type ColorValues<C extends ColorName, I extends StepIndex = StepIndex> = Record<
    Steps[I],
    ValueOf<Colors, C>[I]
>
type ColorPalette = Record<ColorName, ColorValues<ColorName>>

const entries = Object.entries(colors) as ObjectEntries<Colors>
export const palette = entries.reduce((acc, [key, values]) => {
    const color = key
    acc[color] = values.reduce(
        (acc2, value, i) => {
            const step = steps[i]
            acc2[step] = value
            return acc2
        },
        {} as ColorPalette[typeof key],
    )
    return acc
}, {} as ColorPalette)
