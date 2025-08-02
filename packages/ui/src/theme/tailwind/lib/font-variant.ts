import { Style } from '../types'

const regex = /(oldstyle-nums|lining-nums|normal-nums|tabular-nums|proportional-nums)/

const utilities = [
    'oldstyle-nums',
    'lining-nums',
    'normal-nums',
    'tabular-nums',
    'proportional-nums',
]

export const fontVariant = (style: Style, classNames: string) => {
    if (!regex.test(classNames)) return

    const variants = utilities.reduce((acc, utility) => {
        if (classNames.includes(utility)) {
            acc.push(utility)
        }
        return acc
    }, [] as string[])

    const fontVariant: string[] = []

    style['fontVariant'] = variants
}
