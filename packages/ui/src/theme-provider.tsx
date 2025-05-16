import React from 'react'
import { ThemeProvider as RestyleProvider, ThemeContext, useTheme } from '@shopify/restyle'

import { darkTheme, theme } from './theme'

const ThemeProvider = ({
    children,
    darkMode,
}: {
    children: React.ReactNode
    darkMode?: boolean
}) => {
    return <RestyleProvider theme={darkMode ? darkTheme : theme}>{children}</RestyleProvider>
}

export { ThemeProvider, ThemeContext, useTheme }
