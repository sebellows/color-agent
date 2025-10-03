import { isUndefined } from 'es-toolkit'

import { StorageContract } from '../storage.contract'
import { Listener, StorageGetter, StorageValueType } from '../storage.types'
import { $global, hasAccessToLocalStorage } from './global'
import { MemoryStorage } from './memory-storage'
import { createTextEncoder, KEY_WILDCARD, SimpleStorageConfig } from './shared'

interface LocalStorageConfig extends Required<SimpleStorageConfig> {}
class LocalStorageImp extends StorageContract<LocalStorageConfig> {
    readonly id: string

    /** The name of the object or library instantiating the store */
    readonly name = 'LocalStorage'

    readonly storage: Storage

    readonly textEncoder = createTextEncoder()

    readonly listeners = new Set<Listener>()

    get keyPrefix() {
        return `${this.id}${KEY_WILDCARD}`
    }

    constructor(config: LocalStorageConfig) {
        super(config)
        this.id = config.id
        this.storage = config.storage
    }

    private prefixedKey(key: string) {
        if (key.includes('\\')) {
            throw new Error(
                `${this.constructor.name}: 'key' cannot contain the backslash character ('\\')!`,
            )
        }
        return `${this.keyPrefix}${key}`
    }

    private _get(key: string) {
        return this.storage.getItem(this.prefixedKey(key))
    }

    clear() {
        this.storage.clear()
    }

    contains(key: string): boolean {
        return !isUndefined(this._get(key))
    }

    get(key: string): StorageGetter {
        const value = this._get(key) ?? undefined
        const textEncoder = this.textEncoder

        return {
            as<T extends StorageValueType>(type: T) {
                switch (type) {
                    case 'string':
                        return value
                    case 'number':
                        return value == null ? undefined : Number(value)
                    case 'boolean':
                        return `${value}` === 'true'
                    case 'buffer':
                        return textEncoder.encode(value).buffer
                }
            },
        }
    }

    keys(): string[] {
        const _keys = Object.keys(this.storage)
        return _keys
            .filter(key => key.startsWith(this.keyPrefix))
            .map(key => key.slice(this.keyPrefix.length))
    }

    remove(key: string): boolean {
        return this.storage.removeItem(key) ?? false
    }

    set(key: string, value: boolean | string | number | ArrayBuffer): void {
        this.storage.setItem(this.prefixedKey(key), value.toString())
    }

    addListener(listener: Listener): { remove: () => void } {
        this.listeners.add(listener)

        return {
            remove: () => {
                this.listeners.delete(listener)
            },
        }
    }
}

export const createLocalStorage = (config: SimpleStorageConfig): StorageContract => {
    if (hasAccessToLocalStorage()) {
        const domStorage = $global?.localStorage ?? localStorage
        if (domStorage) {
            return new LocalStorageImp({ id: config.id, storage: domStorage })
        }

        console.warn('Could not find "localStorage" instance. Using in-memory storage instead.')
    }

    return new MemoryStorage({ id: config.id })
}
