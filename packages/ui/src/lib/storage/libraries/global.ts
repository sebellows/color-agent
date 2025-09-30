export const $global = global ?? globalThis ?? window

export const hasAccessToLocalStorage = () => {
    try {
        // throws ACCESS_DENIED error if `$global` is Window
        $global.localStorage

        return true
    } catch {
        return false
    }
}
