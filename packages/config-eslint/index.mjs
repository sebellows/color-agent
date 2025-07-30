import eslint from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'
import importPlugin from 'eslint-plugin-import'
import turbo from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
// Unicorn plugin defines lots of rules and opinions on general typescript
// styling outside of conventions covered by framework-specific plugins.
import unicorn from 'eslint-plugin-unicorn'
import { globalIgnores } from 'eslint/config'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 */
export const config = [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    importPlugin.flatConfigs.recommended,
    unicorn.configs['recommended'],
    turbo,
    prettier,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    globalIgnores([
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        'public/',
        '.turbo/',
        '.next/',
        '.expo/',
        '.expo-shared/',
        '.cache/',
        '.vscode/',
        '**/eslint.config.[cm]js',
        '**/babel.config.[m]js',
        '**/metro.config.[m]js',
    ]),
    {
        rules: {
            'prefer-const': [
                'error',
                {
                    destructuring: 'all',
                },
            ],
            'no-duplicate-imports': ['error'],
            'no-unused-vars': 'off',
            'turbo/no-undeclared-env-vars': 'warn',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'after-used',
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            'unicorn/prevent-abbreviations': 'off',
        },
    },
    {
        name: 'Rules that should be enabled',
        // ! The rules below are temporarily disabled until postmortem is able to be done.
        // ! Some are intentionally duplicated from the rule list above for easier deletion after addressing.
        rules: {
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
        },
    },
]
