import { Listener, StorageGetter } from './storage.types'

export interface StorageConfiguration {
    id: string
}

export abstract class StorageContract<Config extends StorageConfiguration = StorageConfiguration> {
    readonly id: string

    /** An ID for the store instance */
    abstract readonly name: string

    abstract readonly keyPrefix: string

    constructor(config: Config) {
        this.id = config.id
    }

    abstract clear(): void

    abstract contains(key: string): boolean

    abstract get(key: string): StorageGetter

    abstract keys(): string[]

    abstract remove(key: string): boolean

    abstract set(key: string, value: boolean | string | number | ArrayBuffer): void

    abstract addListener(listener: Listener): { remove: () => void }
}
