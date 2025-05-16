const space = 4
const spacingUnits = [
    'auto',
    0,
    0.25,
    0.5,
    0.75,
    1,
    1.5, // 6
    2,
    3,
    3.5, // 14
    4,
    5,
    6,
    7,
    8,
    10, // 40
    12, // 48
    64, // 256
    72, // 288
    80, // 320
    96, // 384
]

type StringIndex<T extends number | string> = `${T}`

type SpacingOptions = { [key: StringIndex<(typeof spacingUnits)[number]>]: number | string }

const reduceSpacingStyles = (): SpacingOptions => {
    return spacingUnits.reduce((acc, unit) => {
        const key = typeof unit == 'number' ? unit.toString() : unit
        acc[key] = typeof unit == 'number' ? Math.floor(unit * space) : unit
        return acc
    }, {} as SpacingOptions)
}

export const spacingStyles = reduceSpacingStyles()
