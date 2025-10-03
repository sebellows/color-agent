import { StorageContract } from './storage.contract'

export type StorageEngine = 'localStorage' | 'asyncStorage' | 'memory' | 'MMKV'

const storageRegistry = new Map<string, StorageContract>()

export const StorageRegistry = {
    has: (key: string) => storageRegistry.has(key),
    get: (key: string) => storageRegistry.get(key),
    set: (key: string, storage: StorageContract) => {
        if (storageRegistry.has(key)) {
            console.warn(`Storage with key "${key}" already exists in the registry.`)
            return storageRegistry.get(key)!
        }
        storageRegistry.set(key, storage)
        return storage
    },
    delete: (key: string) => storageRegistry.delete(key),
    clear: () => storageRegistry.clear(),
    entries: () => Array.from(storageRegistry.entries()),
    keys: () => Array.from(storageRegistry.keys()),
    values: () => Array.from(storageRegistry.values()),
    size: () => storageRegistry.size,
} as const
