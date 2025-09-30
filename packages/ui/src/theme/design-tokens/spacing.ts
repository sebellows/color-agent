import { getEntries } from '@coloragent/utils'

const DEFAULT_SPACE = 4
const spacingUnits = [
    0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 256,
    288, 320, 384,
] as const

const negativeSpacingUnitRange = [
    -1, -2, -3, -4, -5, -6, -8, -10, -12, -14, -16, -20, -24, -28, -32, -36, -40, -44, -48, -56,
    -64,
] as const

const spacing = {
    auto: undefined,
    xs: spacingUnits[2],
    sm: spacingUnits[4],
    md: spacingUnits[12], // 16
    lg: spacingUnits[14], // 24
    xl: spacingUnits[16], // 32
    '2xl': spacingUnits[18], // 40
    '3xl': spacingUnits[20], // 48
    none: 0,
}

type SpacingUnitNumber = keyof typeof spacing
// | `${(typeof spacingUnits)[number]}`
// | `${(typeof negativeSpacingUnitRange)[number]}`

export type SpacingToken = keyof typeof spacing

export default spacing

export const spacingUtil = (value: number) => value * DEFAULT_SPACE

// const getNativeSpacingVariants = (): SpacingOptions => {
//     const init = {} as SpacingOptions
//     const units = [...spacingUnits, ...negativeSpacingUnitRange].reduce((acc, unit) => {
//         const key = unit.toString() as SpacingUnitNumber
//         acc[key] = unit
//         return acc
//     }, init)

//     for (const [alias, value] of getEntries(unitAliases)) {
//         const unit = value.toString() as SpacingUnitNumber
//         if (!(unit in units)) {
//             throw new Error(`Spacing alias "${alias}" does not match any spacing unit.`)
//         }
//         units[alias] = units[unit]
//     }

//     return units
// }

// const getWebSpacingVariants = (): SpacingOptions => {
//     const init = { auto: 'auto', none: 'none' } as SpacingOptions
//     const units = [...spacingUnits, ...negativeSpacingUnitRange].reduce((acc, unit) => {
//         const key = unit.toString() as SpacingUnitNumber
//         acc[key] = unit === 0 ? '0' : `${Math.floor(unit / space)}rem`
//         return acc
//     }, init)

//     for (const [alias, value] of getEntries(unitAliases)) {
//         const unit = value.toString() as SpacingUnitNumber
//         if (!(unit in units)) {
//             throw new Error(`Spacing alias "${alias}" does not match any spacing unit.`)
//         }
//         units[alias] = units[unit]
//     }

//     return units
// }

// function getSpacingVariants(platform: PlatformEnv): SpacingOptions {
//     if (platform === 'mobile') {
//         return getNativeSpacingVariants()
//     }
//     return getWebSpacingVariants()
// }

// export { getSpacingVariants }
