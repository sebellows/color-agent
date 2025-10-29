import { copy } from 'esbuild-plugin-copy'
import svgrPlugin from 'esbuild-plugin-svgr'
import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entry: ['src/index.ts'], // ['src/**/*.{ts,tsx}'],
    banner: {
        js: "'use client'",
    },
    esbuildPlugins: [
        svgrPlugin({ native: true, typescript: true }),
        copy({
            assets: [
                {
                    from: ['./src/assets/**/*'],
                    to: ['./src/assets'],
                },
                {
                    from: ['./src/assets.native/**/*'],
                    to: ['./src/assets.native'],
                },
            ],
            copyOnStart: true,
            watch: true,
        }),
    ],
    inject: ['./react-shim.mjs'],
    format: ['esm'],
    tsconfig: 'tsconfig.native.json',
    outDir: 'dist',
    clean: true,
    dts: true,
    minify: true,
    splitting: true,
    treeshake: true,
    loader: {
        '.js': 'jsx',
        '.png': 'file',
        '.svg': 'jsx',
        '.ttf': 'file',
    },
    ...options,
    esbuildOptions(options) {
        options.jsx = 'preserve'
    },
}))
