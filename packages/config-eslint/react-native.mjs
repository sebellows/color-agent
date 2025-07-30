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
    reactHooksPlugin,
    fixupPluginRules(reactNativePlugin),
    unusedImports,
    simpleImportSort,
    {
        languageOptions: {
            globals: {
                React: true,
                ...reactNativePlugin.environments['react-native']['react-native'],
                ...globals.node,
            },
        },
    },
    {
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
    // Test file specific rules
    // These rules are causing false positives with @react-native/testing-library
    {
        files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
        rules: {
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
        },
    },
]
