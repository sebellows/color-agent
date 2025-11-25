import { AnyRecord, getKeys } from '@coloragent/utils'
import { merge } from 'es-toolkit'
import { get, set } from 'es-toolkit/compat'
import { Get, Paths } from 'type-fest'

import { StorageEngine, StorageRegistry } from './lib/storage'

const SPACING_UNIT = 4 as const

// type KeyPath<T extends AnyRecord> =
//     | readonly string[]
//     | LiteralUnion<
//           ToString<
//               | Paths<T, { bracketNotation: false; maxRecursionDepth: 2 }>
//               | Paths<T, { bracketNotation: true; maxRecursionDepth: 2 }>
//           >,
//           string
//       >

export type Configuration = {
    storage: {
        engine: StorageEngine
        registry: typeof StorageRegistry
    }
    theme: {
        SPACING_UNIT: typeof SPACING_UNIT
        ROOT_FONT_SIZE: number
        BASE_FONT_SIZE: number
        BASE_LINE_HEIGHT: number
        [key: string]: any
    }
}

const initialConfig: Configuration = {
    storage: {
        engine: 'memory',
        registry: StorageRegistry,
    },
    theme: {
        SPACING_UNIT,
        ROOT_FONT_SIZE: 16,
        BASE_FONT_SIZE: 14,
        BASE_LINE_HEIGHT: 1.42857,
    },
}

let BaseConfig: Configuration = initialConfig

const isNestedPath = (path: string | symbol | string[]) => {
    if (typeof path === 'string' && path.includes('.')) {
        return path.split('.').length > 1
    }
    return Array.isArray(path) && path.length > 0
}

const isNestedConfigPath = <T extends AnyRecord>(path: Paths<T>) => {
    if (typeof path === 'string' && path.includes('.')) {
        return path.split('.').length > 1
    }
    return Array.isArray(path) && path.length > 0
}

function invariant(key: string | symbol, action: string) {
    if (typeof key === 'string' && key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`)
    }
}

const handler: ProxyHandler<Configuration> = {
    get(target, prop, receiver) {
        if (isNestedPath(prop)) {
            return get(target, prop)
        }
        return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value) {
        const prevValue = get(target, prop)
        if (Object.is(prevValue, value)) {
            return true
        }
        set(target, prop, value)

        return true
    },
    defineProperty(_target, property, _attributes) {
        invariant(property, 'define')
        return true
    },
}

class ConfigImpl<TConfig extends Configuration = Configuration> {
    // private static _instance: ConfigImpl
    private _config: TConfig

    private constructor(config: TConfig) {
        this._config = config
    }

    static getInstance<TConfig extends Configuration = Configuration>(config: TConfig): ConfigImpl {
        return new ConfigImpl(config)
        // if (!ConfigImpl._instance) {
        //     ConfigImpl._instance = new ConfigImpl(config)
        // }
        // return ConfigImpl._instance
    }

    get<TPath extends Paths<TConfig>>(key: TPath): Get<Configuration, TPath> {
        if (isNestedConfigPath<TConfig>(key)) {
            return get(this._config, key) as Get<Configuration, TPath>
        }
        return this._config[key as keyof Configuration] as Get<Configuration, TPath>
    }

    set<TPath extends Paths<TConfig>, TValue>(key: TPath, value: TValue): void {
        if (isNestedConfigPath<TConfig>(key)) {
            set(this._config, key, value)
        } else {
            this._config[key as keyof Configuration] = value as any
        }
    }

    has<TPath extends Paths<TConfig>>(key: TPath): boolean {
        return Boolean(this.get(key))
    }

    keys(): (keyof Configuration)[] {
        return getKeys(this._config) as (keyof Configuration)[]
    }

    size(): number {
        return Object.keys(this._config).length
    }
}

export const EMPTY_CONFIG = {}
export type EMPTY_CONFIG = typeof EMPTY_CONFIG

let Config: ConfigImpl = ConfigImpl.getInstance(BaseConfig) // | EMPTY_CONFIG = EMPTY_CONFIG

export function defineConfig<TConfig extends Partial<Configuration>>(customConfig: TConfig) {
    if (Config) {
        throw new Error('Config has already been defined')
    }

    const config = merge(BaseConfig, customConfig)

    BaseConfig = new Proxy(config, handler)

    Config = ConfigImpl.getInstance(config)
}

export { Config }
export default Config
