import { generateTheme } from './generate-theme'
import { ThemeProvider, type ThemeVariant } from './theme-provider'

export * from './constants'
export * from './utils'

type Theme = ReturnType<typeof generateTheme>

export { generateTheme, ThemeProvider }
export type { Theme, ThemeVariant }
