import { isUndefined } from 'es-toolkit'

import { StorageContract } from '../storage.contract'
import { Listener, StorageGetter, StorageValueType } from '../storage.types'
import { createTextEncoder, KEY_WILDCARD, SimpleStorageConfig } from './shared'

class MemoryStore extends Storage {
    get length(): number {
        return this.storage.size
    }

    constructor(public storage: Map<string, string>) {
        super()
    }

    getItem(key: string) {
        return this.storage.get(key) ?? null
    }

    setItem(key: string, value: string) {
        this.storage.set(key, value)
    }

    removeItem(key: string) {
        this.storage.delete(key)
    }

    clear() {
        this.storage.clear()
    }

    key(index: number) {
        return Object.keys(this.storage).at(index) ?? null
    }
}

export class MemoryStorage extends StorageContract<SimpleStorageConfig> {
    readonly id: string

    readonly name = 'MemoryStorage'

    readonly storage: Storage

    readonly textEncoder = createTextEncoder()

    readonly listeners = new Set<Listener>()

    get keyPrefix() {
        return `${this.id}${KEY_WILDCARD}`
    }

    constructor(config: SimpleStorageConfig) {
        super(config)
        this.id = config.id
        this.storage = config?.storage ?? new MemoryStore(new Map())
    }

    protected prefixedKey(key: string) {
        if (key.includes('\\')) {
            throw new Error(
                `${this.constructor.name}: 'key' cannot contain the backslash character ('\\')!`,
            )
        }
        return `${this.keyPrefix}${key}`
    }

    protected _get(key: string) {
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
