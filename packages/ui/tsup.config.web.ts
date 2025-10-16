import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entry: ['src/**/*.{ts,tsx}'],
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
