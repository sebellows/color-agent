/**
 * TODO: Replace with real translation function
 */
export const t = (strs: TemplateStringsArray, ...values: string[]) => {
    return strs.reduce((acc, str) => {
        acc += values.reduce((acc2, value) => {
            acc2 += value
            return acc2
        }, str)
        return acc
    }, '')
}
