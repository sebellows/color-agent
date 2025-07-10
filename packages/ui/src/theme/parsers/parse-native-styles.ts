export type InteropComponentConfig = {
    target: string[]
    inlineProp?: string
    source: string
    propToRemove?: string
    nativeStyleToProp?: Array<[string, string[]]>
}

export function parseNativeStyleToProp(
    nativeStyleToProp?: Record<string, string | true>,
): InteropComponentConfig['nativeStyleToProp'] {
    if (!nativeStyleToProp) return

    return Object.entries(nativeStyleToProp).map(([key, value]) => {
        return [key, value === true ? [key] : value.split('.')]
    })
}
