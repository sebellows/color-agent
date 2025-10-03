import { StorageConfiguration } from '../storage.contract'
import { $global } from './global'

export interface SimpleStorageConfig extends StorageConfiguration {
    storage?: Storage
}

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

export const KEY_WILDCARD = '\\'
