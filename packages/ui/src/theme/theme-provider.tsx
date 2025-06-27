import React from 'react'
import { ThemeProvider as RestyleProvider } from '@shopify/restyle'

import { generateTheme } from '@ui/theme/generate-theme'

const lightTheme = generateTheme('light')
const darkTheme = generateTheme('dark')

export type ThemeVariant = 'light' | 'dark'

export function ThemeProvider({
    children,
    themeVariant,
}: {
    children: React.ReactNode
    themeVariant?: ThemeVariant
}) {
    return (
        <RestyleProvider theme={themeVariant === 'dark' ? darkTheme : lightTheme}>
            {children}
        </RestyleProvider>
    )
}
