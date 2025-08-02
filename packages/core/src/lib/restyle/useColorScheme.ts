import { colorScheme } from '../react-native-css/runtime/runtime'

export function useColorScheme() {
    return {
        colorScheme: colorScheme.get(),
        setColorScheme: colorScheme.set,
    }
}
