import { createLocalStorage } from './libraries/local-storage'
import { MemoryStorage } from './libraries/memory-storage'
import { StorageEngine, StorageRegistry } from './storage-registry'
import { StorageConfiguration, StorageContract } from './storage.contract'

export const createStorage = <T extends StorageEngine, Config extends StorageConfiguration>(
    storageEngine: StorageEngine,
    config: StorageConfiguration = { id: 'default' },
): StorageContract => {
    switch (storageEngine) {
        case 'localStorage': {
            if (StorageRegistry.has(config.id) || StorageRegistry.size() === 1) {
                // We can only have one instance of localStorage, which is why we check the size.
                // If one already exists, return that instance instead of creating a new one.
                return StorageRegistry.get(config.id)!
            }
            const storage = createLocalStorage(config)
            StorageRegistry.set(config.id, storage)
            return storage
        }
        case 'memory': {
            if (StorageRegistry.has(config.id)) {
                return StorageRegistry.get(config.id)!
            }
            const storage = new MemoryStorage(config)
            StorageRegistry.set(config.id, storage)
            return storage
        }
        default:
            throw new Error(`Storage engine "${storageEngine}" is not supported yet.`)
    }
}

// export { StorageRegistry } from './storage-registry'
// export { StorageContract } from './storage.contract'
