import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entry: ['src/index.ts'],
    format: ['esm'],
    tsconfig: 'tsconfig.json',
    dts: true,
    minify: true,
    clean: true,
    ...options,
}))
