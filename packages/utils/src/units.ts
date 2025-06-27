type DimensionValue = string | number | undefined

const ROOT_FONT_SIZE = 16

/**
 * Convert pixel value to em units
 */
export function toPx(value: DimensionValue, baseFontSize: number = ROOT_FONT_SIZE) {
    if (!value) return '0'

    let numericValue = +value
    let isRelativeUnit = false

    if (typeof value === 'string') {
        isRelativeUnit = value.endsWith('em')

        numericValue = parseFloat(value)
    }

    numericValue = isRelativeUnit ? numericValue * baseFontSize : numericValue / baseFontSize

    return `${numericValue}px`
}

const toRelativeUnit =
    <U extends 'em' | 'rem'>(unit: U) =>
    (value: DimensionValue, baseFontSize: number = ROOT_FONT_SIZE): '0' | `${number}${U}` => {
        if (!value) return '0'

        let numericValue = +value

        if (typeof value === 'string') {
            numericValue = parseFloat(value)
        }

        numericValue = numericValue / baseFontSize

        return `${numericValue}${unit}`
    }

/**
 * Convert pixel value to em units
 */
export const toEm = toRelativeUnit('em')

/**
 * Convert pixel value to rem units
 */
export const toRem = toRelativeUnit('rem')
