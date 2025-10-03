import { StorageContract } from './storage.contract'

/**
 * Mock MMKV instance when used in a Jest/Test environment.
 */
export function createMockStorage(): StorageContract {
    const storage = new Map<string, string | boolean | number | ArrayBuffer>()
    const listeners = new Set<(key: string) => void>()

    const notifyListeners = (key: string) => {
        listeners.forEach(listener => {
            listener(key)
        })
    }

    const keyPrefix = 'storage.test'

    return {
        id: 'storage.test',
        name: 'StorageTest',
        keyPrefix,
        clear: () => {
            const keysBefore = storage.keys()
            storage.clear()
            // Notify all listeners for all keys that were cleared
            for (const key of keysBefore) {
                notifyListeners(key)
            }
        },
        remove: key => {
            const deleted = storage.delete(key)
            if (deleted) {
                notifyListeners(key)
            }
            return deleted
        },
        set: (key, value) => {
            storage.set(key, value)
            notifyListeners(key)
        },
        get: (key: string) => {
            return {
                as(type) {
                    const result = storage.get(key)
                    switch (type) {
                        case 'string':
                            return typeof result === 'string' ? result : undefined
                        case 'number':
                            return typeof result === 'number' ? result : undefined
                        case 'boolean':
                            return typeof result === 'boolean' ? result : undefined
                        case 'buffer':
                            return result instanceof ArrayBuffer ? result : undefined
                    }
                },
            }
        },
        keys: () => Array.from(storage.keys()),
        contains: key => storage.has(key),
        addListener: listener => {
            listeners.add(listener)
            return {
                remove: () => {
                    listeners.delete(listener)
                },
            }
        },
    }
}
