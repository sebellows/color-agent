const sizesList = [12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64] as const

type SizeList = typeof sizesList
type Size = SizeList[number]
type SizeDefinitions = Record<Size, { width: Size; height: Size }>

const getNativeSizeVariants = (): SizeDefinitions => {
    const init = {} as SizeDefinitions
    const units = sizesList.reduce((acc, unit) => {
        acc[unit] = { width: unit, height: unit }
        return acc
    }, init)

    return units
}

export const sizes = getNativeSizeVariants()

export type SizeTokens = keyof typeof sizes
