export function chunk<T, U = T extends string ? T : T[]>(group: U, size?: number): U[] {
    if (!Array.isArray(group) && typeof group !== 'string') {
        throw new TypeError("The function 'chunk' expects an array or string as the first argument")
    }

    if (size == null) size = group.length

    const chunkedArray: U[] = []
    for (let i = 0; i < group.length; i += size) {
        chunkedArray.push(group.slice(i, i + size) as U)
    }
    return chunkedArray
}
