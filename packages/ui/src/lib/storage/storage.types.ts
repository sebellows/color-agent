export type Listener = (key: string) => void

export type StorageValueType = 'string' | 'number' | 'boolean' | 'buffer'

export type StorageValue = string | number | boolean | ArrayBuffer | undefined

export type StorageGetter = {
    /**
     * This method serves as a way of accessing values of a particular type
     * should the chosen storage library be something like `MMKV`, which
     * has getter methods like `getNumber` and `getBuffer`.
     */
    as<T extends StorageValueType>(type: T): StorageValue
}
