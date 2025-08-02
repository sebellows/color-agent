import { AsyncStorageAPI, TypeCache } from './types'

export type AsyncLocalStorageMemoryImpl = AsyncStorageAPI<Map<string, unknown>>

class AsyncLocalStorageMemory implements AsyncLocalStorageMemoryImpl {
    private store: Map<string, unknown> | undefined

    typeCache: TypeCache = {}

    get size(): number {
        return this.store ? this.store.size : 0
    }

    constructor() {
        this.store = new Map<string, unknown>()
    }

    getStore(): Map<string, unknown> | undefined {
        return this.store
    }

    async get<K extends keyof typeof this.typeCache>(
        key: K,
    ): Promise<(typeof this.typeCache)[K] | null | undefined> {
        if (!this.store) return undefined
        const value = this.store.get(key)
        return value === undefined ? null : (value as (typeof this.typeCache)[K])
    }

    async set<K extends string, V>(key: K, value: V): Promise<void> {
        if (!this.store) return
        if (value === undefined) {
            throw new Error(`Cannot set value for key "${key}" to undefined`)
        }
        this.typeCache[key] =
            value != null ? (value.constructor as (typeof this.typeCache)[K]) : null
        this.store.set(key, value)
    }

    async delete<K extends keyof typeof this.typeCache>(key: K): Promise<boolean> {
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

const storage = new AsyncLocalStorageMemory()

export { storage }
