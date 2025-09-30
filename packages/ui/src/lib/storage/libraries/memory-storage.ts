const inMemoryStorage = new Map<string, string>()

export class MemoryStorage extends Storage {
    get length(): number {
        return inMemoryStorage.size
    }

    getItem(key: string) {
        return inMemoryStorage.get(key) ?? null
    }

    setItem(key: string, value: string) {
        inMemoryStorage.set(key, value)
    }

    removeItem(key: string) {
        inMemoryStorage.delete(key)
    }

    clear() {
        inMemoryStorage.clear()
    }

    key(index: number) {
        return Object.keys(inMemoryStorage).at(index) ?? null
    }
}
