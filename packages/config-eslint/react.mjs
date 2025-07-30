import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
// import pluginReactHooks from 'eslint-plugin-react-hooks'

import { config as baseConfig } from './index.js'

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
})

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config} */
export const config = [
    ...baseConfig,
    ...jsxA11yPlugin.configs.recommended,
    ...compat.config({
        extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
        settings: { react: { version: 'detect' } },
        rules: {
            // React scope no longer necessary with new JSX transform.
            'react/react-in-jsx-scope': 'off',
        },
    }),
    {
        languageOptions: {
            globals: {
                ...pluginReact.configs.flat.recommended.languageOptions,
                ...globals.browser,
                ...globals.node,
                ...globals.serviceworker,
            },
        },
    },
]
