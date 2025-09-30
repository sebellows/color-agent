import { StorageContract as IStorageContract, Listener, StorageGetter } from './storage.types'

export abstract class StorageContract implements IStorageContract {
    /** An ID for the store instance */
    abstract readonly name: string

    abstract readonly keyPrefix: string

    abstract clear(): void

    abstract contains(key: string): boolean

    abstract get(key: string): StorageGetter

    abstract keys(): string[]

    abstract remove(key: string): boolean

    abstract set(key: string, value: boolean | string | number | ArrayBuffer): void

    abstract addListener(listener: Listener): { remove: () => void }
}
