import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entry: ['src/**/*.{ts,tsx}'],
    inject: ['./react-shim.mjs'],
    format: ['esm'],
    tsconfig: 'tsconfig.web.json',
    outDir: 'dist-native',
    clean: true,
    dts: true,
    minify: true,
    splitting: true,
    treeshake: true,
    loader: {
        '.js': 'jsx',
    },
    ...options,
}))
