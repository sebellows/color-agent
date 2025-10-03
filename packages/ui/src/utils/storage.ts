import appConfig from '@ui/constants'

import { Config } from '../config'
import { createStorage } from '../lib/storage'

const createStorageKey = (key: string) => `@${appConfig.scheme}/${key}`

// Add all your storage keys here
export const STORAGE_KEYS = {
    LOCALE: createStorageKey('locale'),
    ACCESS_TOKEN: createStorageKey('access-token'),
    REFRESH_TOKEN: createStorageKey('refresh-token'),
    COLOR_MODE: createStorageKey('color-mode'),
    APP_REVIEW_LAST_REQUESTED: createStorageKey('last-requested-review'),
    APP_REVIEW_DONE: createStorageKey('last-review-done'),
}

// Add all clearable storage keys here so they can be cleared on logout
const CLEARABLE_KEYS = [STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN] as const

// These storage keys should be persisted across logins, e.g. showing some guided tours, etc.
const PERSISTENT_KEYS = [
    STORAGE_KEYS.LOCALE,
    STORAGE_KEYS.COLOR_MODE,
    STORAGE_KEYS.APP_REVIEW_DONE,
    STORAGE_KEYS.APP_REVIEW_LAST_REQUESTED,
] as const

type Key = (typeof CLEARABLE_KEYS)[number]

export function getStorage(key: Key) {
    const storageEngine = Config.get('storage.engine')
    const clearableStorage = createStorage(storageEngine, { id: 'clearable' })
    const persistentStorage = createStorage(storageEngine, { id: 'persistent' })

    return (
        PERSISTENT_KEYS.includes(key) ? persistentStorage
        : CLEARABLE_KEYS.includes(key) ? clearableStorage
        : createStorage(storageEngine, { id: 'default' })
    )
}
