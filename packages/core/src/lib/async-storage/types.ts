import { Constructor } from 'type-fest'

export type TypeCache = Record<
    string,
    Constructor<string | number | boolean | null | object> | null
>

export interface AsyncStorageAPI<Store> {
    readonly typeCache: TypeCache
    getStore: () => Store | undefined
    get: <K extends keyof TypeCache>(key: K) => Promise<TypeCache[K] | null | undefined>
    set: <K extends string, V>(key: K, value: V) => Promise<void>
    delete: <K extends keyof TypeCache>(key: K) => Promise<boolean>
    clear: () => Promise<void>
    readonly size: number

    /**
     * Returns the current store.
     * If called outside of an asynchronous context initialized by calling
     * `asyncLocalStorage.run()` or `asyncLocalStorage.enterWith()`, it
     * returns `undefined`.
     */
    // getStore(): T | undefined

    /**
     * Runs a function synchronously within a context and returns its
     * return value. The store is not accessible outside of the callback function.
     * The store is accessible to any asynchronous operations created within the
     * callback.
     *
     * The optional `args` are passed to the callback function.
     *
     * If the callback function throws an error, the error is thrown by `run()` too.
     * The stacktrace is not impacted by this call and the context is exited.
     *
     * Example:
     *
     * ```ts
     * const store = { id: 2 }
     * try {
     *   asyncLocalStorage.run(store, () => {
     *     asyncLocalStorage.getStore() // Returns the store object
     *     setTimeout(() => {
     *       asyncLocalStorage.getStore() // Returns the store object
     *     }, 200)
     *     throw new Error()
     *   });
     * } catch (e) {
     *   asyncLocalStorage.getStore() // Returns undefined
     *   console.error(`Caught the error here: ${e.message}`)
     * }
     * ```
     */
    // run<R>(store: T, callback: () => R): R
    // run<R, TArgs extends any[]>(store: T, callback: (...args: TArgs) => R, ...args: TArgs): R

    /**
     * Runs a function synchronously outside of a context and returns its
     * return value. The store is not accessible within the callback function or
     * the asynchronous operations created within the callback. Any `getStore()`
     * call done within the callback function will always return `undefined`.
     *
     * The optional `args` are passed to the callback function.
     *
     * If the callback function throws an error, the error is thrown by `exit()` too.
     * The stacktrace is not impacted by this call and the context is re-entered.
     *
     * Example within a call to `run()`:
     *
     * ```ts
     * try {
     *   asyncLocalStorage.getStore() // Returns the store object or value
     *   asyncLocalStorage.exit(() => {
     *     asyncLocalStorage.getStore() // Returns undefined
     *     throw new Error()
     *   });
     * } catch (e) {
     *   asyncLocalStorage.getStore() // Returns the same object or value
     *   console.error(`Caught the error here: ${e.message}`)
     * }
     * ```
     */
    // exit<R, TArgs extends any[]>(callback: (...args: TArgs) => R, ...args: TArgs): R

    /**
     * Transitions into the context for the remainder of the current
     * synchronous execution and then persists the store through any following
     * asynchronous calls.
     *
     * Example replacing previous store with the given store object:
     *
     * ```ts
     * const store = { id: 1 }
     * asyncLocalStorage.enterWith(store)
     * asyncLocalStorage.getStore(); // Returns the store object
     * someAsyncOperation(() => {
     *   asyncLocalStorage.getStore(); // Returns the same object
     * })
     * ```
     */
    // enterWith(store: T): void
}
