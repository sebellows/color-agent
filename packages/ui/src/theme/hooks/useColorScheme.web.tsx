// import { Appearance, AppState, NativeEventSubscription } from 'react-native'

// import { Effect, observable } from '@ui/utils/observable'
// import { useState } from 'react'
// import { INTERNAL_RESET } from '../constants'

// let appearance = Appearance
// let appearanceListener: NativeEventSubscription | undefined
// let initialColor: 'light' | 'dark' | undefined = undefined

// const systemColorScheme = observable<'light' | 'dark'>(appearance.getColorScheme() ?? 'light')

// const colorSchemeObservable = observable<'light' | 'dark' | undefined>(initialColor, {
//     fallback: systemColorScheme,
// })

// const colorScheme = {
//     set(value: 'light' | 'dark' | 'system') {
//         if (!globalThis.window) {
//             throw new Error('Cannot manually set color scheme while not in a browser environment.')
//         }

//         if (value === 'system') {
//             colorSchemeObservable.set(undefined)
//         } else {
//             colorSchemeObservable.set(value)
//         }

//         if (value === 'dark') {
//             globalThis.window?.document.documentElement.classList.add('dark')
//         } else {
//             globalThis.window?.document.documentElement.classList.remove('dark')
//         }
//     },
//     get: colorSchemeObservable.get,
//     toggle() {
//         let current = colorSchemeObservable.get()
//         if (current === undefined) current = appearance.getColorScheme() ?? 'light'
//         colorScheme.set(current === 'light' ? 'dark' : 'light')
//     },
//     [INTERNAL_RESET]: (appearance: typeof Appearance) => {
//         colorSchemeObservable.set(undefined)
//         resetAppearanceListeners(appearance)
//     },
// }

// function resetAppearanceListeners($appearance: typeof Appearance) {
//     appearance = $appearance
//     appearanceListener?.remove()
//     appearanceListener = appearance.addChangeListener(state => {
//         if (AppState.currentState === 'active') {
//             systemColorScheme.set(state.colorScheme ?? 'light')
//         }
//     })
// }

// export function useColorScheme() {
//     const [effect, setEffect] = useState<Effect>(() => ({
//         run: () => setEffect(s => ({ ...s })),
//         dependencies: new Set(),
//     }))

//     return {
//         colorScheme: colorScheme.get(effect),
//         setColorScheme: colorScheme.set,
//         toggleColorScheme: colorScheme.toggle,
//     }
// }

// resetAppearanceListeners(appearance)
