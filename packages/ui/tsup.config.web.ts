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
                    from: ['./src/assets.web/**/*'],
                    to: ['./src/assets.web'],
                },
            ],
            copyOnStart: true,
            watch: true,
        }),
    ],
    format: ['esm'],
    tsconfig: 'tsconfig.json',
    outDir: 'dist-web',
    clean: true,
    dts: true,
    minify: true,
    splitting: true,
    treeshake: true,
    target: 'esnext',
    loader: {
        '.js': 'jsx',
    },
    ...options,
}))
