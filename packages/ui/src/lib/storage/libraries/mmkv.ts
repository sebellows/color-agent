interface Listener {
    remove: () => void
}

export interface MMKV {
    set(key: string, value: boolean | string | number | ArrayBuffer): void
    getBoolean(key: string): boolean | undefined
    getString(key: string): string | undefined
    getNumber(key: string): number | undefined
    getBuffer(key: string): ArrayBuffer | undefined
    contains(key: string): boolean
    remove(key: string): boolean
    getAllKeys(): string[]
    clearAll(): void
    recrypt(key: string | undefined): void
    trim(): void
    readonly size: number
    readonly isReadOnly: boolean
    addOnValueChangedListener(onValueChanged: (key: string) => void): Listener
}
