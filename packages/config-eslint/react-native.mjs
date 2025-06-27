import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactNativePlugin from 'eslint-plugin-react-native'
// import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import { fixupPluginRules } from '@eslint/compat'

import { config as baseConfig } from './index.js'

export default [
    ...baseConfig,
    reactPlugin.configs.flat.recommended,
    {
        languageOptions: {
            globals: {
                React: true,
                ...reactNativePlugin.environments['react-native']['react-native'],
                ...globals.node,
            },
        },
        plugins: {
            // 'no-relative-import-paths': noRelativeImportPaths,
            'react-native': fixupPluginRules(reactNativePlugin),
            'simple-import-sort': simpleImportSort,
            'unused-imports': unusedImports,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            'simple-import-sort/exports': 'warn',
            'simple-import-sort/imports': 'warn',
            'unused-imports/no-unused-imports': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]
