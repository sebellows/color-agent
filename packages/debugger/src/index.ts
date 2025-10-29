import debug from 'debug'

type Debugger = debug.Debugger['log'] & { namespace: string }

interface DebuggerOptions {
    onlyWhenFocused?: boolean | string
}

const DEBUG = process.env.DEBUG

/**
 * Similar to `createDebugger()` in the Vite source code
 * @see {@link https://github.com/vitejs/vite/blob/main/packages/vite/src/node/utils.ts#L183},
 */
export function createDebugger(
    namespacePartial: string,
    options: DebuggerOptions = {},
): { debug?: Debugger; debugDetails?: Debugger } {
    return {
        debug: createSingleDebugger(namespacePartial, options),
        debugDetails: createSingleDebugger(namespacePartial, options),
    }
}

function createSingleDebugger(
    namespacePartial: string,
    options: DebuggerOptions = {},
): Debugger | undefined {
    const namespace =
        namespacePartial.includes(':') ? namespacePartial : `coloragent:${namespacePartial}`

    const log = debug(namespace)
    const { onlyWhenFocused } = options

    let enabled = log.enabled
    if (enabled && onlyWhenFocused) {
        const ns = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace
        enabled = !!DEBUG?.includes(ns)
    }

    // Not supported since this ain't no CLI
    const filter = undefined

    if (enabled) {
        const fn = (...args: [string, ...any[]]) => {
            if (!filter || args.some(a => a?.includes?.(filter))) {
                log(...args)
            }
        }

        fn.namespace = namespace

        return fn
    }
}
