import { AsyncLocalStorage } from 'node:async_hooks'

import { isServer } from '@core/utils/env-helpers'

import { AsyncStorageAPI, TypeCache } from './types'

type StoreImpl = Map<string, unknown>

export type AsyncLocalStorageServerImpl = AsyncStorageAPI<StoreImpl>

class AsyncLocalStorageServer implements AsyncLocalStorageServerImpl {
    private store: Map<string, unknown> | undefined
    private asyncStorage: AsyncLocalStorage<StoreImpl> | undefined

    typeCache: TypeCache = {}

    get size(): number {
        return this.store ? this.store.size : 0
    }

    constructor() {
        const storage = new Map<string, unknown>()
        const asyncStorage = new AsyncLocalStorage<StoreImpl>()
        this.asyncStorage = asyncStorage

        this.store = this.asyncStorage.run(storage, () => {
            return asyncStorage.getStore()
        })
    }

    getStore(): StoreImpl | undefined {
        return this.asyncStorage?.getStore()
    }

    async get<K extends keyof TypeCache>(key: K): Promise<TypeCache[K] | null | undefined> {
        this.store = this.asyncStorage?.getStore()

        if (!this.store) return undefined

        const storedValue = await this.store.get(key)
        if (storedValue === undefined) {
            return null
        }

        if (typeof storedValue === 'string') {
            return JSON.parse(storedValue) as TypeCache[K]
        }

        return null
    }

    async set<K extends string, V>(key: K, value: V): Promise<void> {
        if (!this.store) return
        this.typeCache[key] = value != null ? (value.constructor as TypeCache[K]) : null
        this.store.set(key, value)
    }

    async delete<K extends keyof TypeCache>(key: K): Promise<boolean> {
        if (!this.store) return false
        const exists = this.store.has(key)
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

let storage: AsyncLocalStorageServer | undefined

if (isServer) {
    storage = new AsyncLocalStorageServer()
}

export { storage }
