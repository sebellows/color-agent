import AsyncStorage from '@react-native-async-storage/async-storage'

import { AsyncStorageAPI, TypeCache } from './types'
import { isJSONPrimitive, isJSONSerializable } from '@core/utils/json'

type StoreImpl = typeof AsyncStorage

export type AsyncLocalStorageNativeImpl = AsyncStorageAPI<StoreImpl>

class AsyncLocalStorageNative implements AsyncLocalStorageNativeImpl {
    private store: StoreImpl | undefined

    typeCache: TypeCache = {}

    private _size: number = 0

    get size(): number {
        return this._size
    }

    constructor() {
        this.store = AsyncStorage
    }

    getStore(): StoreImpl | undefined {
        return this.store
    }

    private async _updateSize(): Promise<void> {
        if (!this.store) {
            this._size = 0
            return
        }

        this._size = (await this.store.getAllKeys()).length
    }

    async get<K extends keyof TypeCache>(key: K): Promise<TypeCache[K] | null | undefined> {
        if (!this.store) {
            return undefined
        }
        const value = await this.store.getItem(key)
        return value ? JSON.parse(value) : null
    }

    async set<K extends string, V>(key: K, value: V) {
        if (!this.store) {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error('AsyncLocalStorage is not initialized')
            }

            return
        }

        if (isJSONPrimitive(value)) {
            const strValue = value == null ? 'null' : value.toString()
            await this.store.setItem(key, strValue)
        } else if (isJSONSerializable(value)) {
            const strValue = JSON.stringify(value)
            await this.store.setItem(key, strValue)
        } else {
            if (process.env.NODE_ENV !== 'production') {
                // console.warn(`Value for key "${key}" is not JSON serializable`)
                throw new Error(`Value for key "${key}" is not JSON serializable`)
            }
            return
        }

        this.typeCache[key] = value != null ? (value.constructor as TypeCache[K]) : null
        await this._updateSize()
    }

    async delete<K extends keyof TypeCache>(key: K, cb?: (err: Error) => Promise<boolean>) {
        try {
            if (!this.store) return false

            const exists = (await this.get(key)) !== undefined
            await this.store.removeItem(key)
            delete this.typeCache[key]
            await this._updateSize()
            return exists
        } catch (err) {
            await cb?.(err as Error)
            return false
        }
    }

    async clear() {
        if (!this.store) return
        await this.store.clear()
        await this._updateSize()
        this.typeCache = {}
    }
}

const storage = new AsyncLocalStorageNative()

export { storage }
