/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    arrowParens: 'avoid',
    experimentalTernaries: true,
    printWidth: 100,
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: [
        '^react$|^react-native$',
        '',
        '<BUILTIN_MODULES>',
        '',
        '<THIRD_PARTY_MODULES>',
        '',
        '^[..]',
        '',
        '^[./]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx'],
}

export default config
