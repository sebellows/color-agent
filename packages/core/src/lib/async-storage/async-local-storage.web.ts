import { isObject } from '@coloragent/utils'
import { isBrowser } from '@core/utils/env-helpers'

import {
    storage as memoryStorage,
    type AsyncLocalStorageMemoryImpl,
} from './async-local-storage.memory'
import {
    storage as ssrStorage,
    type AsyncLocalStorageServerImpl,
} from './async-local-storage.server'
import { AsyncStorageAPI, TypeCache } from './types'

export type AsyncLocalStorageWebImpl = AsyncStorageAPI<Storage>

class AsyncLocalStorageWeb implements AsyncLocalStorageWebImpl {
    private store: Storage | undefined

    typeCache: TypeCache = {}

    get size(): number {
        return this.store ? this.store.length : 0
    }

    constructor() {
        this.store = localStorage
    }

    getStore(): Storage | undefined {
        return this.store
    }

    async get<K extends keyof TypeCache>(key: K): Promise<TypeCache[K] | null | undefined> {
        if (!this.store) return undefined
        const value = this.store.get(key)
        return value === undefined ? null : (value as TypeCache[K])
    }

    async set<K extends string, V>(key: K, value: V): Promise<void> {
        if (!this.store) return
        if (value === undefined) {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error(`Cannot set value for key "${key}" to undefined`)
            }
            return
        }

        this.typeCache[key] = value != null ? (value.constructor as TypeCache[K]) : null

        const strValue = isObject(value) ? JSON.stringify(value) : String(value)

        this.store.set(key, strValue)
    }

    async delete<K extends keyof TypeCache>(key: K): Promise<boolean> {
        if (!this.store) return false
        const exists = (await this.get(key)) !== undefined
        this.store.delete(key)
        delete this.typeCache[key]
        return exists
    }

    async clear(): Promise<void> {
        if (!this.store) return
        this.store.clear()
        this.typeCache = {}
    }
}

function getStorage():
    | AsyncLocalStorageWebImpl
    | AsyncLocalStorageServerImpl
    | AsyncLocalStorageMemoryImpl {
    if (isBrowser) {
        return new AsyncLocalStorageWeb() as AsyncLocalStorageWebImpl
    }

    if (typeof ssrStorage !== 'undefined') {
        return ssrStorage as AsyncLocalStorageServerImpl
    }

    return memoryStorage as AsyncLocalStorageMemoryImpl
}

const storage = getStorage()

export { storage }
