const sizesList = [8, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64] as const

// const sizeValues = sizesList.reduce((acc, size) => {
//     acc[size] = size
//     return acc
// }, {} as { [K in typeof sizesList[number]]: number })

type SizeList = typeof sizesList
type Size = SizeList[number]

// type SizeDefinitions = Record<Size, { width: Size; height: Size }>

// const getNativeSizeVariants = (): SizeDefinitions => {
//     const init = {} as SizeDefinitions
//     const units = sizesList.reduce((acc, unit) => {
//         acc[unit] = { width: unit, height: unit }
//         return acc
//     }, init)

//     return units
// }

export const sizes = sizesList // getNativeSizeVariants()

export type SizeToken = Size // keyof typeof sizes

export const isSizeToken = (size: unknown): size is SizeToken =>
    typeof size === 'number' && sizes.includes(size as SizeToken)
