import { copy } from 'esbuild-plugin-copy'
import svgrPlugin from 'esbuild-plugin-svgr'
import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entry: ['src/**/*.{ts,tsx}'],
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
    outDir: 'dist-native',
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
}))
