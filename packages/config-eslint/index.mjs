import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
// Unicorn plugin defines lots of rules and opinions on general typescript
// styling outside of conventions covered by framework-specific plugins.
import pluginUnicorn from 'eslint-plugin-unicorn'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 */
export const config = [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintConfigPrettier,
    importPlugin.flatConfigs.recommended,
    pluginUnicorn.configs['recommended'],
    {
        ignores: ['dist/**', 'build/**'],
    },
    {
        plugins: {
            turbo: turboPlugin,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-duplicate-imports': ['error'],
            'turbo/no-undeclared-env-vars': 'warn',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: 'none',
                    caughtErrorsIgnorePattern: '^_',
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
