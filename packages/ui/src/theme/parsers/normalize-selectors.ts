export function toRNProperty(str: string) {
    return str.replace(/^-rn-/, '').replace(/-./g, x => x[1].toUpperCase())
}
