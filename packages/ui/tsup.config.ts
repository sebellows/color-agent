import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
    entry: {
        index: 'scripts/cli.ts',
        // index: "src/index.tsx",
    },
    banner: {
        // js: "'use client'",
        js: '// This file is generated by the Color Agent CLI. Do not edit it directly.',
    },
    clean: true,
    format: ['cjs'],
    // external: ["react"],
    // dts: true,
    ...options,
}))
