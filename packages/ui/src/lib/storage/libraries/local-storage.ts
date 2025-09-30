import { isNil, isUndefined } from 'es-toolkit'

import { StorageContract } from '../storage.contract'
import { Listener, StorageGetter, StorageValueType } from '../storage.types'
import { $global, hasAccessToLocalStorage } from './global'
import { MemoryStorage } from './memory-storage'

export function createTextEncoder() {
    if ($global.TextEncoder != null) {
        return new $global.TextEncoder()
    }
    return {
        encode: () => {
            throw new Error('TextEncoder is not supported in this environment!')
        },
        encodeInto: () => {
            throw new Error('TextEncoder is not supported in this environment!')
        },
        encoding: 'utf-8',
    }
}

const config = { id: 'localStorage' }

const storage = ((): Storage => {
    if (hasAccessToLocalStorage()) {
        const domStorage = $global?.localStorage ?? localStorage
        if (isNil(domStorage)) {
            throw new Error('Could not find "localStorage" instance!')
        }

        config.id += '.default'

        return domStorage
    }

    config.id += '.fallback'

    return new MemoryStorage()
})()

const KEY_WILDCARD = '\\'
const textEncoder = createTextEncoder()
const listeners = new Set<Listener>()

class LocalStorageImp extends StorageContract {
    /** The name of the object or library instantiating the store */
    readonly name = hasAccessToLocalStorage() ? 'LocalStorage' : 'MemoryStorage'

    get keyPrefix() {
        return `${config.id}${KEY_WILDCARD}`
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
        return storage.getItem(this.prefixedKey(key))
    }

    clear() {
        storage.clear()
    }

    contains(key: string): boolean {
        return !isUndefined(this._get(key))
    }

    get(key: string): StorageGetter {
        const value = this._get(key) ?? undefined

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
        const _keys = Object.keys(storage)
        return _keys
            .filter(key => key.startsWith(this.keyPrefix))
            .map(key => key.slice(this.keyPrefix.length))
    }

    remove(key: string): boolean {
        return storage.removeItem(key) ?? false
    }

    set(key: string, value: boolean | string | number | ArrayBuffer): void {
        storage.setItem(this.prefixedKey(key), value.toString())
    }

    addListener(listener: Listener): { remove: () => void } {
        listeners.add(listener)

        return {
            remove: () => {
                listeners.delete(listener)
            },
        }
    }
}

export const getLocalStorage = () => new LocalStorageImp()
