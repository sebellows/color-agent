import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'

import { config as baseConfig } from './index.js'

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
})

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
    { ignores: ['.next/**', 'public/**', 'next.config.js', 'postcss.config.js'] },
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node, ...globals.serviceworker },
        },
    },
    // NOTE: The base config already includes recommended configs for core eslint, typescript, and prettier.
    ...baseConfig,
    ...jsxA11yPlugin.configs.recommended,
    ...compat.config({
        // The Next.js plugin's recommended config comes with rules for react, react-hooks,
        // import, and jsx-a11y out-of-the-box.
        // See https://nextjs.org/docs/app/api-reference/config/eslint#recommended-plugin-ruleset
        extends: ['plugin:@next/next/recommended', 'next/core-web-vitals', 'next/typescript'],
        settings: {
            next: {
                rootDir: 'apps/web/',
            },
        },
    }),
    {
        rules: {
            'react/react-in-jsx-scope': 'off', // Next.js does not require React to be in scope
        },
    },
    {
        files: ['**/*.{jsx,tsx}'],
        rules: {
            'no-console': 'warn',
        },
    },
]
