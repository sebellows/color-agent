import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
    treeshake: true,
    splitting: true,
    entry: ['src/**/*.ts'],
    format: ['esm'],
    tsconfig: 'tsconfig.json',
    dts: true,
    minify: true,
    clean: true,
    ...options,
}))
